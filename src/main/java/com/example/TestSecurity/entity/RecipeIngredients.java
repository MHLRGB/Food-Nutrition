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

    @Column(name = "quantity")
    private Double quantity;

    @Column(name = "ingredient_name")
    private String ingredient_name;

    @ManyToOne
    @MapsId("recipe_id")
    @JoinColumn(name = "recipe_id", referencedColumnName = "recipe_id")
    private Recipe recipe;

    @ManyToOne
    @MapsId("ingredient_id")
    @JoinColumn(name = "Ingredient_id", referencedColumnName = "Ingredient_id")
    private Ingredients ingredient;

    @Column(name = "unit")
    private String unit;


    @Getter
    @Setter
    @Embeddable
    public static class RecipeIngredientsId implements Serializable {
        @Column(name = "recipe_id", length = 20)
        private Long recipe_id;

        @Column(name = "Ingredient_id", length = 20)
        private Long ingredient_id;

        // RecipeID, IngredientID, Section을 복합키로 두어 각 레시피의 섹션마다 같은 재료를 저장할 수 있게 설정
        @Column(name = "section")
        private String section;

        // equals() and hashCode() methods
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            RecipeIngredientsId that = (RecipeIngredientsId) o;
            return recipe_id.equals(that.recipe_id) &&
                    ingredient_id.equals(that.ingredient_id) &&
                    section.equals(that.section);
        }

        @Override
        public int hashCode() {
            return Objects.hash(recipe_id, ingredient_id, section);
        }
    }
}