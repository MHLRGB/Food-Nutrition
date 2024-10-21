package com.example.TestSecurity.controller;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.TimeUnit;

@RestController
public class PythonScriptController {

    private static final Logger logger = LoggerFactory.getLogger(PythonScriptController.class);

    @Value("${python.path}")
    private String pythonPath;

    @Value("${python.script.path}")
    private String scriptPath;

    @PostMapping(value = "/api/recommend-recipes", produces = "application/json; charset=UTF-8")
    public ResponseEntity<String> recommendRecipes(@RequestBody Map<String, Object> input) {
        ObjectMapper objectMapper = new ObjectMapper();

        logger.info("Received request to recommend recipes.");
        try {
            // 사용자 입력 텍스트 가져오기
            String userInput = (String) input.get("input");
            List<Integer> excludedRecipes = (List<Integer>) input.getOrDefault("excluded_recipes", new ArrayList<>());

            // 사용자 입력 검증
            if (userInput == null || userInput.trim().isEmpty()) {
                logger.warn("User input is null or empty.");
                return ResponseEntity.badRequest().body("{\"error\": \"User input cannot be null or empty\"}");
            }

            // 입력 데이터 준비
            Map<String, Object> scriptInput = new HashMap<>();
            scriptInput.put("input", userInput);
            scriptInput.put("excluded_recipes", excludedRecipes);

            String inputJson = objectMapper.writeValueAsString(scriptInput);
            logger.info("Input JSON prepared: {}", inputJson);

            // ProcessBuilder를 통해 Python 스크립트 실행
            ProcessBuilder pb = new ProcessBuilder(pythonPath, scriptPath);
            pb.redirectErrorStream(true); // 에러 스트림과 표준 스트림을 병합하여 하나의 스트림으로 처리

            // 환경 변수 설정
            Map<String, String> env = pb.environment();
            env.put("PYTHONIOENCODING", "utf-8");

            Process process = pb.start();
            logger.info("Started Python script process.");

            // Python 스크립트에 JSON 데이터를 UTF-8로 전달
            try (Writer writer = new OutputStreamWriter(process.getOutputStream(), StandardCharsets.UTF_8)) {
                writer.write(inputJson);
                writer.flush();
                logger.info("Input JSON sent to Python script.");
            }

            // Python 스크립트의 출력을 UTF-8로 읽어오기 (stdout 및 stderr가 병합됨)
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line);
                }
            }

            logger.info("Output received from Python script: {}", output.toString());

            // Python 스크립트의 종료를 기다림 (최대 30초)
            if (!process.waitFor(30, TimeUnit.SECONDS)) {
                process.destroyForcibly();
                logger.error("Python script execution timed out.");
                return ResponseEntity.internalServerError().body("{\"error\": \"Python script execution timed out\"}");
            }

            int exitCode = process.exitValue();
            if (exitCode != 0) {
                logger.error("Python script execution failed with exit code {}", exitCode);
                return ResponseEntity.internalServerError().body("{\"error\": \"Python script execution failed\"}");
            }

            String result = output.toString().trim();
            logger.info("Python script output: {}", result);

            // JSON 형식 검증
            JsonNode jsonNode = objectMapper.readTree(result);  // JSON 파싱으로 유효성 확인
            logger.info("Output JSON validated successfully.");

            // 명시적으로 UTF-8 응답 헤더 설정
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(result);

        } catch (JsonMappingException e) {
            logger.error("Invalid input data: {}", e.getMessage());
            return ResponseEntity.badRequest().body("{\"error\": \"Invalid input data\"}");
        } catch (IOException e) {
            logger.error("I/O error occurred: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("{\"error\": \"I/O error occurred\"}");
        } catch (Exception e) {
            logger.error("An unexpected error occurred: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("{\"error\": \"" + e.getMessage() + "\"}");
        } finally {
            logger.info("Completed recipe recommendation request processing.");
        }
    }
}
