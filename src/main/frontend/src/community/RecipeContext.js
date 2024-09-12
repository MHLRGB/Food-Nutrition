import React, {useState, createContext } from 'react';

export const RecipeContext = createContext();

export const RecipeProvider = ({children}) => {
    const [recipeTitle, setRecipeTitle] = useState('');
    const [recipeCategory, setRecipeCategory] = useState('');
    const [recipeContent, setRecipeContent] = useState('');
    const [recipeIngredients, setRecipeIngredients] = useState([{ ingredientId: '', quantity: '' }]);

    return (
        <RecipeContext.Provider value={{recipeTitle, setRecipeTitle, recipeContent, setRecipeContent, setRecipeCategory, recipeCategory, recipeIngredients, setRecipeIngredients}}>
            {children}
        </RecipeContext.Provider>
    );
};

