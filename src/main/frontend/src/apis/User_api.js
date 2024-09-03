import axios from "axios";


export const checkUpDupId = async (username) => {
    const response = await axios.post(`/api/checkid`, { username });
    return response.data;
};