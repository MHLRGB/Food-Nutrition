import React, {useState, createContext } from 'react';

export const RecipeContext = createContext();

export const RecipeProvider = ({children}) => {
    const [recipe, setRecipe] = useState({
        recipeTitle: '',
        recipeInfo: '',
        hashtag: '',
        chef : '',
        difficulty : '',
        cookingTime : '',
        serving : '',
        byType: '전체',
        bySituation: '전체',
        byIngredient: '전체',
        byMethod: '전체',
    });

    const [recipeIngredients, setRecipeIngredients] = useState([{ ingredientId: '', ingredientName: '', quantity: '', section:'' }]);

    return (
        <RecipeContext.Provider value={{recipe, setRecipe, recipeIngredients, setRecipeIngredients}}>
            {children}
        </RecipeContext.Provider>
    );
};

