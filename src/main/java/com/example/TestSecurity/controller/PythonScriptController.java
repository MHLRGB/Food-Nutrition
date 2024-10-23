package com.example.TestSecurity.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

            System.out.println("userInput 값 : " + userInput);
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
//
//    @GetMapping(value = "/api/recommend-recipes", produces = "application/json; charset=UTF-8")
//    public ResponseEntity<String> recommendRecipes(@RequestParam String input) {
//        try {
//            ObjectMapper objectMapper = new ObjectMapper();
//
//            // 사용자 입력 텍스트 가져오기
//            String userInput = (String) input;
//
//
//            // 입력 데이터 준비
//            Map<String, Object> scriptInput = new HashMap<>();
//            scriptInput.put("input", userInput);
//
//            String inputJson = objectMapper.writeValueAsString(scriptInput);
//
//            File scriptFile = new File(scriptPath);
//            ProcessBuilder pb = new ProcessBuilder(pythonPath, scriptFile.getAbsolutePath());
//            pb.redirectErrorStream(true);
//            Process process = pb.start();
//
//            // Python 스크립트에 JSON 데이터를 전달
//            try (Writer writer = new OutputStreamWriter(process.getOutputStream(), "UTF-8")) {
//                writer.write(inputJson);
//                writer.flush();
//            }
//
//            // Python 스크립트의 출력을 읽어오기
//            StringBuilder output = new StringBuilder();
//            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), "UTF-8"))) {
//                String line;
//                while ((line = reader.readLine()) != null) {
//                    output.append(line).append("\n");
//                }
//            }
//
//            // Python 스크립트의 종료 코드 확인
//            int exitCode = process.waitFor();
//            if (exitCode != 0) {
//                return ResponseEntity.internalServerError().body("{\"error\": \"Python script execution failed\"}");
//            }
//
//            String result = output.toString().trim();
//            // JSON 형식 검증
//            objectMapper.readTree(result);
//
//            return ResponseEntity.ok(result);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.internalServerError().body("{\"error\": \"" + e.getMessage() + "\"}");
//        }
//    }
//}

/*
* 초기 추천 요청:
사용자가 처음 레시피를 요청합니다.
프론트엔드는 excluded_recipes 없이 요청을 보냅니다.
백엔드 컨트롤러가 요청을 받아 파이썬 스크립트를 실행합니다.
파이썬 스크립트는 모든 레시피를 대상으로 추천을 생성합니다.
추천된 레시피가 프론트엔드로 반환됩니다.
프론트엔드에서 레시피 번호 저장:
프론트엔드는 받은 레시피의 레시피_번호를 배열에 저장합니다.
"다른 레시피" 요청:
사용자가 "다른 레시피" 버튼을 클릭합니다.
프론트엔드는 저장된 레시피_번호 배열을 excluded_recipes로 포함하여 새 요청을 보냅니다.
백엔드 처리:
컨트롤러가 요청을 받아 excluded_recipes를 포함한 데이터를 파이썬 스크립트에 전달합니다.
파이썬 스크립트 처리:
스크립트는 excluded_recipes를 받아 해당 레시피를 제외하고 새로운 추천을 생성합니다.
결과 반환:
새로운 추천 결과가 프론트엔드로 반환됩니다.
프로세스 반복:
프론트엔드는 새로 받은 레시피 번호를 기존 배열에 추가합니다.
사용자가 다시 "다른 레시피"를 요청하면 3~6 단계가 반복됩니다.
이 프로세스를 구현하기 위해 각 부분에서 해야 할 일은 다음과 같습니다:
프론트엔드:
추천받은 레시피 번호를 배열로 관리합니다.
"다른 레시피" 버튼 클릭 시 저장된 레시피 번호를 excluded_recipes로 포함하여 요청을 보냅니다.
백엔드 컨트롤러:
excluded_recipes를 포함한 요청을 처리할 수 있도록 수정합니다.
이 정보를 파이썬 스크립트에 전달합니다.
파이썬 스크립트:
excluded_recipes를 받아 처리하는 로직을 구현합니다 (이미 완료됨).
* */