package com.example.TestSecurity.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Getter
@Setter
public class RecipeIngredients {

    @EmbeddedId
    private RecipeIngredientsId id;

//    @GeneratedValue(strategy = GenerationType.IDENTITY)  // 자동 증가 설정
//    @Column(name = "id")
//    private Long id;

    @Column(name = "quantity")
    private Double quantity;

    @Column(name = "ingredientName")
    private String ingredientName;

    @ManyToOne
    @MapsId("recipeId")
    @JoinColumn(name = "recipeId", referencedColumnName = "recipeId")
    private Recipe recipe;

    @ManyToOne
    @MapsId("ingredientId")
    @JoinColumn(name = "IngredientId", referencedColumnName = "IngredientId", nullable = true)
    private Ingredients ingredient;

    @Column(name = "unit")
    private String unit;



    @Getter
    @Setter
    @Embeddable
    public static class RecipeIngredientsId implements Serializable {
        // RecipeID, IngredientID, Section을 복합키로 두어 각 레시피의 섹션마다 같은 재료를 저장할 수 있게 설정

        @Column(name = "id")// 자동 증가 ID
        private Long id;

        @Column(name = "section")
        private String section;

        @Column(name = "recipeId", length = 20)
        private Long recipeId;

        @Column(name = "IngredientId", length = 20)
        private Long ingredientId;

        // equals() and hashCode() methods
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            RecipeIngredientsId that = (RecipeIngredientsId) o;
            return  id.equals(that.id) &&
                    section.equals(that.section) &&
                    recipeId.equals(that.recipeId) &&
                    ingredientId.equals(that.ingredientId);

        }

        @Override
        public int hashCode() {
            return Objects.hash(id, section, recipeId, ingredientId );
        }
    }
}