import axios from "axios";

// export const getAllRecipes = async () => {
//     const response = await fetch('/communities');
//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }
//     return response.json();
// };

export const createRecipe = async (requestDTO) => {
    try {
        const response = await axios.post('/recipe', requestDTO, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating community:', error);
        throw error; // 에러를 상위 호출자에게 전달
    }
};


export const getAllRecipes = async () => {
    const response = await axios.get('/recipe');
    return response.data;
};

export const getRecipeById = async (id) => {
    const response = await axios.get(`/recipe/${id}`);
    return response.data;
};

export const deleteRecipeById = async (id) => {
    const response = await axios.delete(`/recipe/${id}`);
    return response.data;
};

export const getTopPopularRecipes = async () => {
    const response = await axios.get('/recipe/top-popular-recipe');
    return response.data;
};

export const updateRecipe = async (id, requestDTO) => {
    try {
        const response = await axios.put(`/recipe/${id}`, requestDTO, {
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
        const response = await axios.get(`/recipe/ingredient/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ingredient:", error);
        throw error;
    }
};