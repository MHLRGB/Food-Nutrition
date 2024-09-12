import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteRecipeById, getRecipeById } from '../../apis/Recipe_api';
import Header from '../../Header';
import IngredientGroup from "../../main/RecipeIngredientsBox";
import { MainProvider } from "../../main/MainContext";
import RecipeIngredientsBox from "../../main/RecipeIngredientsBox";
import StickyBanner from "../../main/StickyBanner";

const Recipe_detail = () => {
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 레시피 데이터 가져오기
                const recipeData = await getRecipeById(id);
                setRecipe(recipeData);

            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const deleteRecipe = async (id) => {
        try {
            await deleteRecipeById(id);
            navigate(-1);
        } catch (error) {
            console.log("error:", error);
        }
    };

    const handleNavRecipe = (id) => {
        window.location.href = `/recipe/update/${id}`;
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
        // IngredientGroup 테스트를 위해 임시로 MainProvider 사용
        <MainProvider>
            <div className='community_board_body_container'>
                <div className='community_board_body_left'>

                </div>

                <div className='community_board_body_center'>
                    <RecipeIngredientsBox recipeId={recipe.id}/>

                    <button
                        type='button'
                        onClick={() => deleteRecipe(recipe.id)}
                    >
                        레시피 삭제하기
                    </button>

                    <div onClick={() => handleNavRecipe(recipe.id)}>수정</div>
                </div>

                <div className='community_board_body_right'>
                    <StickyBanner />
                </div>
            </div>
        </MainProvider>
    );
};

export default Recipe_detail;
