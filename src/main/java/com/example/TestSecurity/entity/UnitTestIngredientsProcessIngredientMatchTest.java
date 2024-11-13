//package com.example.TestSecurity.entity;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.io.Serializable;
//import java.util.Objects;
//
//@Entity
//@Table(name = "Unit_Test_Ingredients_process_ingredient_match_test")
//@Getter
//@Setter
//public class UnitTestIngredientsProcessIngredientMatchTest {
//
//    @EmbeddedId
//    private UnitTestIngredientsProcessIngredientMatchTestId id;
//
//    @Column(name = "Quantity")
//    private Double quantity;
//
//    // TestCrawlingRecipe로 변경
//    @ManyToOne
//    @MapsId("recipeId")
//    @JoinColumn(name = "RecipeID", referencedColumnName = "id")
//    private TestCrawlingRecipe testCrawlingRecipe;
//
//    @ManyToOne
//    @MapsId("ingredientId")
//    @JoinColumn(name = "IngredientID", referencedColumnName = "id", nullable = true)  // ingredientId는 nullable
//    private Ingredients ingredient;
//
//    @Column(name = "Unit")
//    private String unit;
//
//    @Column(name = "ingredientName", length = 255)
//    private String ingredientName;  // ingredientName 추가
//
//    // 복합키 클래스
//    @Getter
//    @Setter
//    @Embeddable
//    public static class UnitTestIngredientsProcessIngredientMatchTestId implements Serializable {
//        @Column(name = "RecipeID", length = 20)
//        private Long recipeId;
//
//        @Column(name = "IngredientID", length = 20)
//        private Long ingredientId;
//
//        @Column(name = "Section")
//        private String section;
//
//        @Override
//        public boolean equals(Object o) {
//            if (this == o) return true;
//            if (o == null || getClass() != o.getClass()) return false;
//            UnitTestIngredientsProcessIngredientMatchTestId that = (UnitTestIngredientsProcessIngredientMatchTestId) o;
//            return recipeId.equals(that.recipeId) &&
//                    Objects.equals(ingredientId, that.ingredientId) &&  // ingredientId는 null 가능
//                    section.equals(that.section);
//        }
//
//        @Override
//        public int hashCode() {
//            return Objects.hash(recipeId, ingredientId, section);
//        }
//    }
//}
