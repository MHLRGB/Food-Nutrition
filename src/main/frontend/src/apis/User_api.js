import axios from "axios";


export const checkUpDupId = async (username) => {
    const response = await axios.post(`/api/checkid`, { username });
    return response.data;
};

export const nowUserInfo = async () => {
    const response = await axios.get(`/api/user/now`);
    return response.data;
};

