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

    @Getter
    @Setter
    @Embeddable
    public static class RecipeIngredientsId implements Serializable {
        @Column(name = "RecipeID")
        private Long recipeId;

        @Column(name = "IngredientID")
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

