package com.example.TestSecurity.service;

import com.example.TestSecurity.entity.MunTestExRecipe;
import com.example.TestSecurity.entity.UnitTestIngredients;
import com.example.TestSecurity.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class IngredientProcessService {

    private final Mun_Test_ExRecipeRepository mun_Test_ExRecipeRepository;
    private final UnitTestIngredientsRepository unitTestIngredientsRepository;

    @Autowired
    public IngredientProcessService(Mun_Test_ExRecipeRepository mun_Test_ExRecipeRepository, UnitTestIngredientsRepository unitTestIngredientsRepository) {
        this.mun_Test_ExRecipeRepository = mun_Test_ExRecipeRepository;
        this.unitTestIngredientsRepository = unitTestIngredientsRepository;
    }

    public List<String> getAllIngredientContents() {
        List<String> contents = mun_Test_ExRecipeRepository.findAllIngredientContents();
        return contents;
    }

//    public List<String> extractBracketContents() {
//        List<MunTestExRecipe> recipes = mun_Test_ExRecipeRepository.findAll(); // 모든 레시피 가져오기
//        List<String> result = new ArrayList<>();
//
//        for (MunTestExRecipe recipe : recipes) {
//            int recipeNumber = recipe.getRecipeNumber(); // 레시피 번호 가져오기
//            String content = recipe.getCookingIngredientsContent(); // 조리 재료 내용 가져오기
//
//            if (content != null && !content.isEmpty()) { // 내용이 비어있지 않은지 확인
//                Pattern pattern = Pattern.compile("\\[(.*?)\\]"); // 대괄호 안의 내용 찾기
//                Matcher matcher = pattern.matcher(content);
//
//                while (matcher.find()) {
//                    result.add("레시피 번호 " + recipeNumber + ", " + matcher.group(1) + "\n"); // 레시피 번호와 추출된 재료 추가
//                }
//            }
//        }
//
//        // 추출된 데이터 확인
//        System.out.println("추출된 데이터:\n" + String.join("\n", result));
//        return result;
//    }

    public List<String> extractBracketContents() {
        List<MunTestExRecipe> recipes = mun_Test_ExRecipeRepository.findAll(); // 모든 레시피 가져오기
        List<String> result = new ArrayList<>();

        for (MunTestExRecipe recipe : recipes) {
            int recipeNumber = recipe.getRecipeNumber(); // 레시피 번호 가져오기
            String content = recipe.getCookingIngredientsContent(); // 조리 재료 내용 가져오기

            if (content != null && !content.isEmpty()) { // 내용이 비어있지 않은지 확인
                Pattern pattern = Pattern.compile("\\[(.*?)\\]"); // 대괄호 안의 내용 찾기
                Matcher matcher = pattern.matcher(content);

                while (matcher.find()) {
                    String section = matcher.group(1); // [ ] 안의 문자열 추출
                    String ingredientsSection = content.substring(matcher.end()).split("\\[")[0]; // 다음 [ ] 이전까지의 내용
                    String[] ingredients = ingredientsSection.split("\\|"); // | 기호로 분리

                    for (String ingredient : ingredients) {
                        // 재료와 수량, 단위 추출
                        String[] parts = ingredient.trim().split("(?<=\\d)(?=\\D)"); // 숫자와 문자의 경계에서 나누기

                        String ingredientName = parts[0].replaceAll("[0-9]", "").trim(); // 재료 이름 추출
                        double quantity = 0.0; // 기본 값으로 0.0 설정
                        String unit = "NoU"; // 기본 값으로 "NoU" 설정

                        if (parts.length == 2) {
                            // 수량과 단위가 있는 경우
                            String quantityStr = parts[0].replaceAll("[^0-9.]", "").trim(); // 숫자만 추출, 소수점 포함 가능

                            if (!quantityStr.isEmpty()) {
                                // 수량을 Double로 변환
                                double quantityValue = Double.parseDouble(quantityStr);

                                // BigDecimal을 사용하여 소수점 2자리까지만 반올림
                                BigDecimal bd = new BigDecimal(quantityValue).setScale(2, RoundingMode.HALF_UP);

                                // quantity에 소수점 2자리까지 반영된 값 저장
                                quantity = bd.doubleValue();
                            } else {
                                quantity = 0.0;
                            }
                            unit = parts[1].replaceAll("[0-9]", "").trim(); // 숫자 오른쪽의 단위
                        }
                        // 결과 추가
                        result.add("레시피 번호 " + recipeNumber + ", 재료이름 " + ingredientName + ", 재료량 " + quantity + ", 단위 " + unit + ", " + section +"\n");

                    }
                }
            }
        }

        // 추출된 데이터 확인
        System.out.println("추출된 데이터:\n" + String.join("\n", result));
        return result;
    }



    public void saveExtractedData(List<String> extractedData) {
        // 추출된 데이터 저장 로직 구현
    }
}
