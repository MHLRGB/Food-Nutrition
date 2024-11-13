import React, {useState, createContext } from 'react';

export const RecipeContext = createContext();

export const RecipeProvider = ({children}) => {
    const [recipe, setRecipe] = useState({
        recipeTitle: '',
        recipeInfo: '',
        hashtag: '',
        byType: '',
        bySituation: '',
        byIngredient: '',
        byMethod: '',
    });


    const [recipeIngredients, setRecipeIngredients] = useState([{ ingredientId: '', quantity: '' }]);

    return (
        <RecipeContext.Provider value={{recipe, setRecipe, recipeIngredients, setRecipeIngredients}}>
            {children}
        </RecipeContext.Provider>
    );
};

