import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {getAllMyRecipes, getAllRecipes} from "../apis/Recipe_api";
import {getAllCommunities} from "../apis/Community_api";

const TitleList = ({ category, myrecipe }) => {
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("category : "+category);
        const fetchRecipes = async () => {
            try {
            let data;
            if (myrecipe === "1") {
                data = await getAllMyRecipes();
            } else {
                data = await getAllRecipes();
            }
                setTitles(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    const handleNavRecipe = (id) => {
        if(category==="recipe") {
            window.location.href = `/recipe/${id}`;
        } else {
            window.location.href = `/community/board/${id}`;
        }

    };

    return (
        <div className='community_board_title_list'>
            {titles.map((title, index) => (
                <div className='community_board_title' key={index} onClick={() => handleNavRecipe(title.recipeId)}>
                    {title.recipeTitle}
                </div>
            ))}
        </div>
    );
};

export default TitleList;