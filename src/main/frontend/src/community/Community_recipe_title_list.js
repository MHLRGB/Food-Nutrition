import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {getAllCommunityRecipes, getAllRecipes} from "../apis/Community_api";

const CommunityRecipeTitleList = () => {
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCommunityRecipes = async () => {
            try {
                const data = await getAllRecipes();
                setTitles(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchCommunityRecipes();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    const handleNavRecipe = (id) => {
        window.location.href = `/community/recipe/${id}`;
    };

    return (
        <div className='community_board_title_list'>
            {titles.map((title, index) => (
                <div className='community_board_title' key={index} onClick={() => handleNavRecipe(title.id)}>
                    {title.title}
                </div>
            ))}
        </div>
    );
};

export default CommunityRecipeTitleList;