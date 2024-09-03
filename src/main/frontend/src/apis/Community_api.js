import axios from "axios";


export const createCommunity = async (title,content, category, recipeTitle, recipeCategory, recipeIngredients) => {
    const recipeRequestDTO = {
        title: recipeTitle || null,
        category: recipeCategory || null,
        ingredients: recipeIngredients && recipeIngredients.length > 0 ? recipeIngredients.map(ingredient => ({
            ingredientId: ingredient.ingredientId || null,
            quantity: ingredient.quantity || 0
        })) : null
    };

    const requestDTO = {
        title: title,
        content: content,
        category: category,
        recipeRequestDTO
    };

    try {
        const response = await axios.post('/api/community', requestDTO, {
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

export const getAllCommunities = async () => {
    const response = await axios.get('/api/community');
    return response.data;
};

export const getBoardById = async (id) => {
    console.log("id:"+id);
    const response = await axios.get(`/api/community/${id}`);
    return response.data;
};

export const updateBoard = async (id, requestDTO) => {
    try {
        const response = await axios.put(`/api/community/${id}`, requestDTO, {
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

export const deleteCommunityById = async (id) => {
    console.log("삭제 api 호출 id : "+id);
    const response = await axios.delete(`/api/community/${id}`);
    return response.data;
};