import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCommunityById } from "../apis/Community_api";

const Community_recipe_detail = () => {
    const { id } = useParams();
    const [community, setCommunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const data = await getCommunityById(id);
                setCommunity(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchCommunity();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!community) {
        return <div>No data found</div>;
    }

    return (
        <div>
            <h1>{community.title}</h1>
            <p><strong>Author:</strong> {community.author}</p>
            <p><strong>Category:</strong> {community.category}</p>
            <p><strong>Created Date:</strong> {community.createdDate}</p>
            <p>{community.content}</p>
        </div>
    );
};

export default Community_recipe_detail;
