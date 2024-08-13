import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {getAllCommunityRecipes} from "../apis/Community_api";

const CommunityRecipeTitleList = () => {
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCommunityRecipes = async () => {
            try {
                const data = await getAllCommunityRecipes();
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

    const handleClick = (id) => {
        navigate(`/community/recipe/${id}`);
    };

    return (
        <div>
            <ul>
                {titles.map((title, index) => (
                    <li key={index} onClick={() => handleClick(title.id)}>
                        {title.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommunityRecipeTitleList;