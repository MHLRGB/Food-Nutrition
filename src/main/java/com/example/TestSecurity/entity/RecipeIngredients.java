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

    @Column(name = "Quantity")
    private Double quantity;

    @ManyToOne
    @MapsId("recipeId")
    @JoinColumn(name = "RecipeID", referencedColumnName = "id")
    private Recipe recipe;

    @ManyToOne
    @MapsId("ingredientId")
    @JoinColumn(name = "IngredientID", referencedColumnName = "id")
    private Ingredients ingredient;

    @Column(name = "Unit")
    private String unit;


    @Getter
    @Setter
    @Embeddable
    public static class RecipeIngredientsId implements Serializable {
        @Column(name = "RecipeID", length = 20)
        private Long recipeId;

        @Column(name = "IngredientID", length = 20)
        private Long ingredientId;

        // RecipeID, IngredientID, Section을 복합키로 두어 각 레시피의 섹션마다 같은 재료를 저장할 수 있게 설정
        @Column(name = "Section")
        private String section;

        // equals() and hashCode() methods
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            RecipeIngredientsId that = (RecipeIngredientsId) o;
            return recipeId.equals(that.recipeId) &&
                    ingredientId.equals(that.ingredientId) &&
                    section.equals(that.section);
        }

        @Override
        public int hashCode() {
            return Objects.hash(recipeId, ingredientId, section);
        }
    }
}