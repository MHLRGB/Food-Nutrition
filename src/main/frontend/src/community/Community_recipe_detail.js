import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {deleteRecipeById, getIngredientById, getRecipeById} from '../apis/Community_api';
import Header from '../Header';

const Community_recipe_Detail = () => {
    return (
        <div className='document'>
            <Header />
            <Body />
        </div>
    );
};

const Body = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [ingredient, setIngredient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    const fetchIngredient = async (event) => {
        if (event) {
            event.preventDefault(); // 기본 동작을 방지합니다.
        }

        try {
            const data = await getIngredientById(1);
            console.log("ingredient:"+data);
            // setIngredient(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteRecipe = async (id) => {
        try {
            await deleteRecipeById(id);
            navigate(-1);
            // 성공적으로 삭제된 후 추가 작업이 필요할 수 있음
        } catch (error) {
            console.log("error:", error);
        }
    };

    const handleNavRecipe = (id) => {
        window.location.href = `/community/update/${id}`;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!recipe) {
        return <div>No data found</div>;
    }

    return (
        <div className='community_board_body_container'>
            <div className='community_board_body_center'>
                <h1>{recipe.title}</h1>
                <p><strong>Author:</strong> {recipe.author}</p>
                <p><strong>Category:</strong> {recipe.category}</p>
                <p><strong>Created Date:</strong> {recipe.createdDate}</p>
                <p>{recipe.content}</p>
                <button
                    type='button'
                    onClick={() => deleteRecipe(recipe.id)}
                >
                    레시피 삭제하기
                </button>

                <div onClick={() => handleNavRecipe(recipe.id)}>수정</div>

                <div onClick={() => fetchIngredient()}>재료확인</div>


            </div>
        </div>
    )
        ;
};

export default Community_recipe_Detail;
