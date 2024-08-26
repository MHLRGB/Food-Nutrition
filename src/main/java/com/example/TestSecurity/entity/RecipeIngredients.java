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

    @Getter
    @Setter
    @Embeddable
    public static class RecipeIngredientsId implements Serializable {
        @Column(name = "RecipeID", length = 20) // 길이를 20으로 설정
        private Long recipeId;

        @Column(name = "IngredientID", length = 20) // 길이를 20으로 설정
        private Long ingredientId;

        // equals() and hashCode() methods
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            RecipeIngredientsId that = (RecipeIngredientsId) o;
            return recipeId.equals(that.recipeId) && ingredientId.equals(that.ingredientId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(recipeId, ingredientId);
        }
    }
}
