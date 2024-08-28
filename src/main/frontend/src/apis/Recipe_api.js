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


export const createRecipe = async (title,content, category, ingredients) => {
    const requestDTO = {
        title: title,
        content: content,
        category: category,
        ingredients: ingredients.map(ingredient => ({
            ingredientId: ingredient.ingredientId,
            quantity: ingredient.quantity
        }))
    };

    try {
        const response = await axios.post('/recipes', requestDTO, {
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

export const getAllRecipes = async () => {
    const response = await axios.get('/recipes');
    return response.data;
};

export const getRecipeById = async (id) => {
    console.log("getRecipeById 호출됨")
    const response = await axios.get(`/recipes/${id}`);
    return response.data;
};

export const deleteRecipeById = async (id) => {
    console.log("삭제 api 호출 id : "+id);
    const response = await axios.delete(`/recipes/${id}`);
    return response.data;
};

export const getTopPopularRecipes = async () => {
    const response = await axios.get('/recipes/top-popular-recipe');
    return response.data;
};

export const updateRecipe = async (id, requestDTO) => {
    try {
        const response = await axios.put(`/recipes/${id}`, requestDTO, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating community recipe with id ${id}:`, error);
        throw error; // 에러를 상위 호출자에게 전달
    }
};

export const getIngredientById = async (id) => {
    try {
        const response = await axios.get(`/ingredient/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ingredient:", error);
        throw error;
    }
};