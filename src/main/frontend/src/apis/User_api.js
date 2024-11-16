import axios from "axios";


export const checkUpDupId = async (username) => {
    const response = await axios.post(`/api/checkid`, { username });
    return response.data;
};

export const nowUserInfo = async () => {
    const response = await axios.get(`/api/user/now`);
    return response.data;
};


export const saveUser = async (id, cat1, cat2, cat3) => {
    const requestDto = {
        cat1:cat1,
        cat2:cat2,
        cat3:cat3
    }
    const response = await axios.put(`/api/user/save/${id}`, {
        requestDto
    });
    return response.data;
};