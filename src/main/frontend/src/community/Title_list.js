import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {getAllRecipes} from "../apis/Recipe_api";
import {getAllCommunities} from "../apis/Community_api";

const TitleList = ({ category }) => {
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
console.log("category : "+category);
        const fetchRecipes = async () => {
            try {
            let data;
            if (category === "board") {
                data = await getAllCommunities(); // 카테고리 A의 레시피 가져오기
            } else {
                data = await getAllRecipes(); // 카테고리 B의 레시피 가져오기
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
                <div className='community_board_title' key={index} onClick={() => handleNavRecipe(title.id)}>
                    {title.title}
                </div>
            ))}
        </div>
    );
};

export default TitleList;