import React, {useEffect, useState} from "react";
import {MainContext} from "./MainContext";
import recipeImg from "../image/recipe.png";
import {getIngredientById, getRecipeById} from "../apis/Recipe_api";

const RecipeIngredientsBox = ({recipeId}) => {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState(null);

    const [renderedIngredients, setRenderedIngredients] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 레시피 데이터 가져오기
                const recipeData = await getRecipeById(recipeId);
                setRecipe(recipeData);

                // 재료 데이터 가져오기
                setIngredients(recipeData.ingredientsInfo || []);
            } catch (error) {
                console.log("Error : "+error.message);
            } finally {
                setLoading(false);
            }
        };

        // recipeId가 존재하는 경우에만 fetchData 호출
        if (recipeId !== null) {
            fetchData();
        }
    }, [recipeId]);  // recipeId가 변경될 때마다 실행

    return (
        <div className='recipe_container'>
            <div className="recipe_info">
                <div className="recipe_title">{recipe.title}</div>
            </div>
            <div className="recipe_bottom" />
        </div>
    );
}

export default RecipeIngredientsBox;