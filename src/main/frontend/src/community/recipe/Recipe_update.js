import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {getRecipeById, updateRecipe} from "../../apis/Recipe_api";
import Header from "../../Header";

const Recipe_update = () => {
    return (
        <div className='document'>
            <Header/>
            <Body/>
        </div>
    );
};

const Body = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe , setRecipe ] = useState({
        title: '',
        content: '',
        author: '',
        category: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const data = await getRecipeById(id);
                setRecipe(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleChange = (e) => {
        setRecipe({
            ...recipe,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentId = id;

        try {
            const updatedRecipe = await updateRecipe(currentId, recipe);
            console.log('Updated recipe:', updatedRecipe);
            navigate(-1);  // 성공 시 이전 페이지로 이동
        } catch (error) {
            console.error('Failed to update recipe:', error);
            alert('업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.');
            navigate(-1);  // 오류 발생 시 이전 페이지로 이동
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>오류 발생: {error.message}</div>;

    return (
        <div>
            <h2>글 수정</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목:</label>
                    <input
                        type="text"
                        name="title"
                        value={recipe.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>내용:</label>
                    <textarea
                        name="content"
                        value={recipe.content}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>작성자:</label>
                    <input
                        type="text"
                        name="author"
                        value={recipe.author}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div>
                    <label>카테고리:</label>
                    <input
                        type="text"
                        name="category"
                        value={recipe.category}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">수정하기</button>
            </form>
        </div>
    );
};

export default Recipe_update;
