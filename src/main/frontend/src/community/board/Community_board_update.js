import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../Header';
import { MainProvider } from "../../main/MainContext";
import { getBoardById, updateCommunity, deleteCommunityById } from "../../apis/Community_api";
import { RecipeContext, RecipeProvider } from "../RecipeContext";
import Recipe_update_form from "../recipe/Recipe_update_form"; // 수정 API 호출 함수 추가
import Recipe_write_form from "../recipe/Recipe_write_form"; // 레시피 추가 폼

const Community_board_detail = () => {
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
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [recipeId, setRecipeId] = useState(null);
    const [showRecipeForm, setShowRecipeForm] = useState(false); // 레시피 추가 폼을 제어할 상태

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { recipeTitle, recipeCategory, recipeIngredients } = useContext(RecipeContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const boardData = await getBoardById(id);
                setTitle(boardData.title);
                setContent(boardData.content);
                setCategory(boardData.category);
                setRecipeId(boardData.recipeId);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await updateCommunity(id, title, content, category, recipeTitle, recipeCategory, recipeIngredients);
            navigate('/community');
            console.log('Success:', response);
        } catch (error) {
            setError('Failed to update community. Please try again.');
            console.error('Error:', error);
        }
    };

    const deleteRecipe = async (id) => {
        try {
            await deleteCommunityById(id);
            navigate(-1); // 삭제 후 이전 페이지로 이동
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const toggleRecipeForm = () => {
        setShowRecipeForm((prevShow) => !prevShow);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <MainProvider>
            <div className='community_board_body_container'>
                <div className='community_board_body_center'>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                        <textarea
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <button type="submit">수정 완료</button>
                    </form>
                    <button onClick={() => deleteRecipe(id)}>글 삭제하기</button>

                    {/* recipeId가 null이면 레시피 추가 버튼과 폼을 표시 */}
                    {recipeId === null ? (
                        <>
                            <button type="button" onClick={toggleRecipeForm}>
                                {showRecipeForm ? "Hide Recipe Form" : "레시피 추가"}
                            </button>

                            {showRecipeForm && <Recipe_write_form />}
                        </>
                    ) : (
                        // recipeId가 있으면 Recipe_update_form 표시
                        <Recipe_update_form recipeId={recipeId} showUpdateButton={false}/>
                    )}
                </div>
            </div>
        </MainProvider>
    );
};

export default Community_board_detail;
