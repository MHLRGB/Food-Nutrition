package com.example.TestSecurity.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
public class PythonScriptController {

    private static final Logger logger = Logger.getLogger(PythonScriptController.class.getName());

    @Value("${python.path}")
    private String pythonPath;

    @Value("${python.script.path}")
    private String scriptPath;

    @PostMapping(value = "/api/recommend-recipes", produces = "application/json; charset=UTF-8")
    public ResponseEntity<String> recommendRecipes(@RequestBody Map<String, Object> input) {
        logger.info("Received request to recommend recipes with input: " + input);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String userInput = (String) input.get("input");

            List<Integer> excludedRecipes = (List<Integer>) input.getOrDefault("excludedRecipes", new ArrayList<>());

            Map<String, Object> scriptInput = new HashMap<>();
            scriptInput.put("input", userInput);
            scriptInput.put("excluded_recipes", excludedRecipes);

            String inputJson = objectMapper.writeValueAsString(scriptInput);
            logger.info("Prepared input JSON for Python script: " + inputJson);

            File scriptFile = new File(scriptPath);
            ProcessBuilder pb = new ProcessBuilder(pythonPath, scriptFile.getAbsolutePath());
            pb.redirectErrorStream(false); // 오류 스트림 분리
            Process process = pb.start();
            logger.info("Started Python process with path: " + pythonPath + " and script: " + scriptPath);

            // 표준 입력 스트림에 JSON 데이터 전송
            try (Writer writer = new OutputStreamWriter(process.getOutputStream(), "UTF-8")) {
                writer.write(inputJson);
                writer.flush();
                logger.info("Sent input JSON to Python script.");
            }

            // 표준 출력 스트림에서 Python 스크립트의 출력 읽기
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), "UTF-8"))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            // 표준 오류 스트림에서 Python 스크립트의 오류 메시지 읽기
            StringBuilder errorOutput = new StringBuilder();
            try (BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream(), "UTF-8"))) {
                String line;
                while ((line = errorReader.readLine()) != null) {
                    errorOutput.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                logger.severe("Python script exited with error code: " + exitCode);
                logger.severe("Python script error output: " + errorOutput.toString().trim());
                return ResponseEntity.internalServerError().body("{\"error\": \"Python script execution failed\"}");
            }

            String result = output.toString().trim();
            logger.info("Received output from Python script: " + result);

            objectMapper.readTree(result); // JSON 형식 유효성 검사
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            logger.severe("Exception while executing Python script: " + e.getMessage());
            e.printStackTrace(); // 추가적인 에러 정보를 콘솔에 출력
            return ResponseEntity.internalServerError().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
