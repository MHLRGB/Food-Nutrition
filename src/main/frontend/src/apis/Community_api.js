import axios from "axios";


export const createCommunity = async (title,content, category) => {
    const requestDTO = {
        title: title,
        content: content,
        category: category
    };

    try {
        const response = await axios.post('/communities', requestDTO, {
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
    const response = await axios.get('/communities');
    return response.data;
};

export const getBoardById = async (id) => {
    console.log("id:"+id);
    const response = await axios.get(`/communities/${id}`);
    return response.data;
};

export const updateBoard = async (id, requestDTO) => {
    try {
        const response = await axios.put(`/communities/${id}`, requestDTO, {
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
    const response = await axios.delete(`/communities/${id}`);
    return response.data;
};