import React, { useEffect, useState, createContext } from 'react';
import './css/Community_Board.css';
import axios from 'axios';
import Header from '../Header';
import {Link, useNavigate} from "react-router-dom";
import {createRecipe} from "../apis/Community_api";

const Recipe_write = () => {
    return (
        <div className='document'>
            <Header/>
            <Body/>
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

        const requestDTO = {
            title,
            content,
            category,
        };

        try {
            const response = await createRecipe(requestDTO);
            navigate('/community');
            console.log('Success:', response);
            // 필요한 추가 작업 (예: 폼 초기화, 리디렉션 등)
        } catch (error) {
            setError('Failed to create community. Please try again.');
            console.error('Error:', error);
            // 에러 처리 (예: 사용자에게 에러 메시지 표시)
        }
    };

    return (
        <div className='community_board_body_container'>
            <div className='community_board_body_center'>
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

export default Recipe_write;