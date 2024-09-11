import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {getRecipeById, updateRecipe} from "../../apis/Recipe_api";
import Header from "../../Header";
import {RecipeProvider} from "../RecipeContext";
import Recipe_update_form from "./Recipe_update_form";

const Recipe_update = () => {
    const { id } = useParams(); // URL에서 recipeId를 가져옴

    return (
        <div className='document'>
            <RecipeProvider>
                <Header />
                <Body recipeId={id} />  {/* recipeId를 Body로 전달 */}
            </RecipeProvider>
        </div>
    );
};

const Body = ({ recipeId }) => {  // recipeId를 prop으로 받음
    return (
        <div>
            <Recipe_update_form recipeId={recipeId} />  {/* recipeId를 Recipe_update_form으로 전달 */}
        </div>
    );
};

export default Recipe_update;
