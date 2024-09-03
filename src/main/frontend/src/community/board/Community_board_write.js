import React, {useContext, useState} from 'react';
import '../css/Community_Board.css';
import Header from '../../Header';
import { useNavigate } from 'react-router-dom';
import { createCommunity } from "../../apis/Community_api";
import Recipe_write_form from "../recipe/Recipe_write_form";
import {RecipeContext, RecipeProvider} from "../RecipeContext";

const Community_board_write = () => {
    return (
        <div className='document'>
            <RecipeProvider>
                <Header />
                <Body />
            </RecipeProvider>
        </div>
    );
};

const Body = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState(null);
    const [showRecipeForm, setShowRecipeForm] = useState(false);  // 레시피 작성 폼 상태

    const { recipeTitle, recipeCategory, recipeIngredients } = useContext(RecipeContext);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await createCommunity(title, content, category, recipeTitle, recipeCategory, recipeIngredients);
            navigate('/community');
            console.log('Success:', response);
        } catch (error) {
            setError('Failed to create community. Please try again.');
            console.error('Error:', error);
        }
    };

    const toggleRecipeForm = () => {
        setShowRecipeForm(!showRecipeForm);  // 레시피 작성 폼 표시 여부 토글
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

                    <button type="submit">Create Community</button>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                </form>

                {/* "레시피 추가" 버튼 */}
                <button type="button" onClick={toggleRecipeForm}>
                    {showRecipeForm ? "Hide Recipe Form" : "레시피 추가"}
                </button>


                <p>Title: {recipeTitle}</p>
                <p>Category: {recipeCategory}</p>
                <h3>Ingredients:</h3>
                <ul>
                    {recipeIngredients.map((ingredient, index) => (
                        <li key={index}>
                            ID: {ingredient.ingredientId}, Quantity: {ingredient.quantity}
                        </li>
                    ))}
                </ul>

                {/* 레시피 작성 폼 표시 */}
                {showRecipeForm &&
                    <Recipe_write_form/>
                }
            </div>
        </div>
    );
};

export default Community_board_write;
