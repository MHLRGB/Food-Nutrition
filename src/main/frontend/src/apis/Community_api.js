import axios from "axios";

export const getAllCommunityRecipes = async () => {
    const response = await fetch('/communities');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const getCommunityById = async (id) => {
    const response = await axios.get(`/communities/${id}`);
    return response.data;
};

export const getTopPopularCommunityRecipes = async () => {
    const response = await axios.get('/communities/top-popular-recipe');
    return response.data;
};