import React, { useEffect, useState } from 'react';
import {getCommunityTitles} from "../apis/Community_api";


const CommunityRecipeTitleList = () => {
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTitles = async () => {
            try {
                const data = await getCommunityTitles();
                setTitles(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchTitles();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <ul>
                {titles.map((title, index) => (
                    <li key={index}>{title}</li>
                ))}
            </ul>
        </div>
    );
};

export default CommunityRecipeTitleList;