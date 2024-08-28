import React, { useState } from 'react';
import './css/Community_Board.css';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import {createCommunity} from "../apis/Community_api";

const Community_write = () => {
    return (
        <div className='document'>
            <Header />
            <Body />
        </div>
    );
};

const Body = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Adjust this as per your API requirements
            const response = await createCommunity(title, content, category);
            navigate('/community');
            console.log('Success:', response);
            // Form reset or additional actions if needed
        } catch (error) {
            setError('Failed to create community. Please try again.');
            console.error('Error:', error);
            // Error handling
        }
    };

    return (
        <div className='community_board_body_container'>
            <div className='community_board_body_center'>
                <h3> 커뮤니티 작성 창</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />

                    <button type="submit">Create Recipe</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Community_write;
