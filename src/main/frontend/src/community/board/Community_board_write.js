import React, {useContext, useState} from 'react';
import '../css/Community_Board.css';
import Header from '../../Header';
import { useNavigate } from 'react-router-dom';
import { createCommunity } from "../../apis/Community_api";
import Recipe_write_form from "../recipe/Recipe_write_form";
import {RecipeContext, RecipeProvider} from "../RecipeContext";
import RecipeIngredientsCreateBox from "../../main/RecipeIngredientsCreateBox";
import {MainProvider} from "../../main/MainContext";
import StickyBanner from "../../main/StickyBanner";

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

    const { recipeTitle, recipeContent, recipeCategory, recipeIngredients } = useContext(RecipeContext);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await createCommunity(title, content, category, recipeTitle, recipeContent, recipeCategory, recipeIngredients);
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
        <MainProvider>
            <div className='community_board_body_container'>
                <div className='community_board_body_left'>

                </div>
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

                    {/* 레시피 작성 폼 표시 */}
                    {showRecipeForm &&
                        <RecipeIngredientsCreateBox showEditButton={false}/>
                    }
                </div>
                <div className='community_board_body_right'>
                    {showRecipeForm && <StickyBanner/>}
                </div>
            </div>
        </MainProvider>
    );
};

export default Community_board_write;
