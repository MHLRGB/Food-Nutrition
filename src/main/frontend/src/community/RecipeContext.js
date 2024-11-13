import React, {useState, createContext } from 'react';

export const RecipeContext = createContext();

export const RecipeProvider = ({children}) => {
    const [recipeTitle, setRecipeTitle] = useState('');
    const [recipeCategory, setRecipeCategory] = useState('');
    const [recipeContent, setRecipeContent] = useState('');

    const [recipe, setRecipe] = useState({
        recipe_title: '',
        recipe_info: '',
        chef: '',
        hashtag: '',
        by_type: '',
        by_situation: '',
        by_ingredient: '',
        by_method: '',
    });


    const [recipeIngredients, setRecipeIngredients] = useState([{ ingredientId: '', quantity: '' }]);

    return (
        <RecipeContext.Provider value={{recipe, setRecipe, recipeTitle, setRecipeTitle, recipeContent, setRecipeContent, setRecipeCategory, recipeCategory, recipeIngredients, setRecipeIngredients}}>
            {children}
        </RecipeContext.Provider>
    );
};

