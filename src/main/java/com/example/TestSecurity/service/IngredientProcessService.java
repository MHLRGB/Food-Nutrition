package com.example.TestSecurity.service;

import com.example.TestSecurity.entity.MunTestExRecipe;
import com.example.TestSecurity.entity.TestCrawlingRecipe;
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
    private final TestCrawlingRecipeRepository testCrawlingRecipeRepository;

    @Autowired
    public IngredientProcessService(Mun_Test_ExRecipeRepository mun_Test_ExRecipeRepository, UnitTestIngredientsRepository unitTestIngredientsRepository, TestCrawlingRecipeRepository testCrawlingRecipeRepository) {
        this.mun_Test_ExRecipeRepository = mun_Test_ExRecipeRepository;
        this.unitTestIngredientsRepository = unitTestIngredientsRepository;
        this.testCrawlingRecipeRepository = testCrawlingRecipeRepository;
    }

    public List<String> getAllIngredientContents() {
        List<String> contents = mun_Test_ExRecipeRepository.findAllIngredientContents();
        return contents;
    }

    // 배치삽입 29분 소요
    public List<String> extractBracketContents() {
        List<TestCrawlingRecipe> recipes = testCrawlingRecipeRepository.findAll();
        List<String> result = new ArrayList<>();
        List<UnitTestIngredients> ingredientsToSave = new ArrayList<>();
        int batchSize = 10000; // 배치 크기 설정

        for (TestCrawlingRecipe recipe : recipes) {
            int recipeNumber = recipe.getRecipeNumber();
            String content = recipe.getIngredientsContent();

            if (content != null && !content.isEmpty()) {
                Pattern pattern = Pattern.compile("\\[(.*?)\\]");
                Matcher matcher = pattern.matcher(content);

                while (matcher.find()) {
                    String section = matcher.group(1);
                    String ingredientsSection = content.substring(matcher.end()).split("\\[")[0];
                    String[] ingredients = ingredientsSection.split("\\|");

                    for (String ingredient : ingredients) {
                        String[] parts = ingredient.trim().split("\\}\\{");
                        String ingredientName = parts[0].replaceAll("\\{", "").trim();
                        String quantity = "";
                        String unit = "";
                        double quantityValue = 0.0;

                        if (parts.length > 1) {
                            String quantityAndUnit = parts[1].replaceAll("\\}", "").trim();
                            Pattern quantityUnitPattern = Pattern.compile("([\\d\\.]+)([가-힣a-zA-Z]*)");
                            Matcher quantityUnitMatcher = quantityUnitPattern.matcher(quantityAndUnit);

                            if (quantityUnitMatcher.find()) {
                                quantity = quantityUnitMatcher.group(1);
                                unit = quantityUnitMatcher.group(2);
                                try {
                                    quantityValue = Double.parseDouble(quantity);
                                } catch (NumberFormatException e) {
                                    System.out.println("수량을 double로 변환할 수 없습니다: " + quantity);
                                }
                            }
                        }

                        UnitTestIngredients unitTestIngredient = new UnitTestIngredients();
                        unitTestIngredient.setRecipeId(recipeNumber);
                        unitTestIngredient.setSection(section);
                        unitTestIngredient.setIngredientName(ingredientName);
                        unitTestIngredient.setQuantity(quantity.isEmpty() ? 0.0 : Double.parseDouble(quantity));
                        unitTestIngredient.setUnit(unit);

                        ingredientsToSave.add(unitTestIngredient);

                        // 배치 크기만큼 저장
                        if (ingredientsToSave.size() >= batchSize) {
                            unitTestIngredientsRepository.saveAll(ingredientsToSave);
                            ingredientsToSave.clear(); // 리스트 초기화
                        }
                    }
                }
            }
        }

        // 남아있는 데이터 저장
        if (!ingredientsToSave.isEmpty()) {
            unitTestIngredientsRepository.saveAll(ingredientsToSave);
        }

        // 추출된 데이터 확인
        // System.out.println("추출된 데이터:\n" + String.join("\n", result));
        return result;
    }

    // 일반 saveAll삽입 - 236,568개 데이터 기준 33분 소요
//    public List<String> extractBracketContents() {
//        List<TestCrawlingRecipe> recipes = testCrawlingRecipeRepository.findAll(); // 모든 레시피 가져오기
//        List<String> result = new ArrayList<>();
//        List<UnitTestIngredients> ingredientsToSave = new ArrayList<>(); // 저장할 재료 리스트
//
//        for (TestCrawlingRecipe recipe : recipes) {
//            int recipeNumber = recipe.getRecipeNumber(); // 레시피 번호 가져오기
//            String content = recipe.getIngredientsContent(); // 조리 재료 내용 가져오기
//
//            if (content != null && !content.isEmpty()) { // 내용이 비어있지 않은지 확인
//                Pattern pattern = Pattern.compile("\\[(.*?)\\]"); // 대괄호 안의 내용 찾기
//                Matcher matcher = pattern.matcher(content);
//
//                while (matcher.find()) {
//                    String section = matcher.group(1); // [ ] 안의 문자열 추출
//                    String ingredientsSection = content.substring(matcher.end()).split("\\[")[0]; // 다음 [ ] 이전까지의 내용
//                    String[] ingredients = ingredientsSection.split("\\|"); // | 기호로 분리
//
//                    for (String ingredient : ingredients) {
//                        // 재료와 수량, 단위 추출
//                        String[] parts = ingredient.trim().split("\\}\\{"); // { } 기호로 재료, 수량, 단위를 구분
//                        String ingredientName = parts[0].replaceAll("\\{", "").trim(); // 재료 이름 추출
//
//                        String quantity = ""; // 기본 값으로 빈 문자열 설정
//                        String unit = ""; // 기본 값으로 빈 문자열 설정
//                        double quantityValue = 0.0; // 수량을 double로 변환할 변수
//
//                        if (parts.length > 1) {
//                            // 수량과 단위가 결합된 문자열에서 수량과 단위 분리
//                            String quantityAndUnit = parts[1].replaceAll("\\}", "").trim();
//
//                            // 숫자와 문자를 분리하는 패턴 (숫자는 수량, 문자는 단위로 구분)
//                            Pattern quantityUnitPattern = Pattern.compile("([\\d\\.]+)([가-힣a-zA-Z]*)");
//                            Matcher quantityUnitMatcher = quantityUnitPattern.matcher(quantityAndUnit);
//
//                            if (quantityUnitMatcher.find()) {
//                                quantity = quantityUnitMatcher.group(1); // 수량 부분
//                                unit = quantityUnitMatcher.group(2); // 단위 부분
//
//                                try {
//                                    // 수량을 double로 변환
//                                    quantityValue = Double.parseDouble(quantity);
//                                } catch (NumberFormatException e) {
//                                    System.out.println("수량을 double로 변환할 수 없습니다: " + quantity);
//                                }
//                            }
//                        }
//
//                        // UnitTestIngredients 객체 생성
//                        UnitTestIngredients unitTestIngredient = new UnitTestIngredients();
//                        unitTestIngredient.setRecipeId(recipeNumber); // 레시피 번호 설정
//                        unitTestIngredient.setSection(section); // 섹션 설정
//                        unitTestIngredient.setIngredientName(ingredientName); // 재료 이름 설정
//                        unitTestIngredient.setQuantity(quantity.isEmpty() ? 0.0 : Double.parseDouble(quantity)); // 수량 설정
//                        unitTestIngredient.setUnit(unit); // 단위 설정
//
//                        // 리스트에 추가
//                        ingredientsToSave.add(unitTestIngredient);
//                        // 결과 추가 (형식에 맞게 출력)
//                        result.add("레시피 번호 " + recipeNumber + ", 재료이름: " + ingredientName + ", 수량: " + quantityValue + " 단위:" + unit + " , 섹션: " + section + "\n");
//                    }
//                }
//            }
//        }
//
//        // 한 번에 DB에 저장
//        System.out.println("저장할 행의 개수: " + ingredientsToSave.size());
//        System.out.println("DB 저장중...");
//        unitTestIngredientsRepository.saveAll(ingredientsToSave);
//        System.out.println("DB 저장 완료!");
//        // 추출된 데이터 확인
//        System.out.println("추출된 데이터:\n" + String.join("\n", result));
//        return result;
//    }





}
