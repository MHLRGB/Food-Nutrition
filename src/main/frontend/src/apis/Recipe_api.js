import axios from "axios";

// export const getAllRecipes = async () => {
//     const response = await fetch('/communities');
//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }
//     return response.json();
// };

// export const createRecipe = async (requestDTO) => {
//     try {
//         const response = await axios.post('/recipe', requestDTO, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error creating community:', error);
//         throw error; // 에러를 상위 호출자에게 전달
//     }
// };


export const createRecipe = async (title, content, category, ingredients) => {
    const requestDTO = {
        title: title,
        category: category,
        content: content,
        ingredients: ingredients.map(ingredient => ({
            ingredientId: ingredient.ingredientId,
            quantity: ingredient.quantity
        }))
    };

    try {
        const response = await axios.post('/api/recipe', requestDTO, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 서버로부터 받은 데이터를 반환
    } catch (error) {
        console.error('Error creating recipe:', error);
        throw error; // 에러를 상위 호출자에게 전달
    }
};

export const updateRecipe = async (id, recipeTitle, recipeContent, recipeCategory, recipeIngredients) => {

    // requestDTO 정의
    const requestDTO = {
        title: recipeTitle || null,
        category: recipeCategory || null,
        content: recipeContent || null,
        ingredients: recipeIngredients && recipeIngredients.length > 0 ? recipeIngredients.map(ingredient => ({
            ingredientId: ingredient.ingredientId || null,
            quantity: ingredient.quantity || 0
        })) : []
    };

    try {
        const response = await axios.put(`/api/recipe/${id}`, requestDTO, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(`Error updating recipe with id ${id}:`, error);
        throw error; // 에러를 상위 호출자에게 전달
    }
};

export const getAllRecipes = async () => {
    const response = await axios.get('/api/recipe');
    return response.data;
};

export const getRecipeById = async (id) => {
    console.log("getRecipeById 호출됨");
    try {
        const response = await axios.get(`/api/recipe/${id}`);
        return response.data;
    } catch (error) {
        console.error("API 호출 중 에러 발생:", error);
        return null; // 에러 발생 시 null 반환
    }
};

export const deleteRecipeById = async (id) => {
    console.log("삭제 api 호출 id : "+id);
    const response = await axios.delete(`/api/recipe/${id}`);
    return response.data;
};

export const getTopPopularRecipes = async () => {
    const response = await axios.get('/api/recipe/top-popular-recipe');
    return response.data;
};



export const getIngredientById = async (id) => {
    try {
        const response = await axios.get(`/api/ingredient/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ingredient:", error);
        throw error;
    }
};

export const searchIngredients = async (keyword) => {
    try {
        const response = await axios.get(`/api/ingredients/search?keyword=${keyword}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching search results:", error);
        throw error;
    }
};