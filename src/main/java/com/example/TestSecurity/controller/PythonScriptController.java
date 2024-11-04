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

@RestController
public class PythonScriptController {

    @Value("${python.path}")
    private String pythonPath;

    @Value("${python.script.path}")
    private String scriptPath;

    @PostMapping(value = "/api/recommend-recipes", produces = "application/json; charset=UTF-8")
    public ResponseEntity<String> recommendRecipes(@RequestBody Map<String, Object> input) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();

            // 사용자 입력 텍스트 가져오기
            String userInput = (String) input.get("input");

            // 이전에 추천된 레시피 번호 리스트 처리
            List<Integer> excludedRecipes = (List<Integer>) input.getOrDefault("excludedRecipes", new ArrayList<>());

            // 입력 데이터 준비
            Map<String, Object> scriptInput = new HashMap<>();
            scriptInput.put("input", userInput);
            scriptInput.put("excluded_recipes", excludedRecipes);

            String inputJson = objectMapper.writeValueAsString(scriptInput);

            File scriptFile = new File(scriptPath);
            ProcessBuilder pb = new ProcessBuilder(pythonPath, scriptFile.getAbsolutePath());
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // Python 스크립트에 JSON 데이터를 전달
            try (Writer writer = new OutputStreamWriter(process.getOutputStream(), "UTF-8")) {
                writer.write(inputJson);
                writer.flush();
            }

            // Python 스크립트의 출력을 읽어오기
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), "UTF-8"))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            // Python 스크립트의 종료 코드 확인
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                return ResponseEntity.internalServerError().body("{\"error\": \"Python script execution failed\"}");
            }

            String result = output.toString().trim();
            // JSON 형식 검증
            objectMapper.readTree(result);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
