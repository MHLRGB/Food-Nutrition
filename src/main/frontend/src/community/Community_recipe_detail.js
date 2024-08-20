import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteRecipeById, getIngredientById, getRecipeById } from '../apis/Community_api';
import Header from '../Header';
import IngredientGroup from "../main/IngredientGroup";
import {MainProvider} from "../main/MainContext";

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
        const fetchData = async () => {
            try {
                // 레시피 데이터 가져오기
                const recipeData = await getRecipeById(id);
                setRecipe(recipeData);

                // 재료 데이터 가져오기
                const ingredientData = await getIngredientById(1); // 여기에 필요한 재료 ID를 사용하세요
                setIngredient(ingredientData);
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
        //IngredientGroup 테스트를 위해 임시로 MainProvider 사용
        <MainProvider>
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

                {/* 재료 정보가 존재할 때 표시 */}
                {ingredient && (
                    <div className="ingredient-details">
                        <h2>재료 정보</h2>
                        <IngredientGroup
                            name={ingredient.foodName}
                            standard={100}
                            calorie={ingredient.energyKcal}
                            sugar={ingredient.sugarG}
                            sodium={ingredient.sodiumMg}
                            protein={ingredient.proteinG}
                            carbohydrate={ingredient.carbohydrateG}
                            fat={ingredient.fatG}
                        />
                        {/*<p><strong>ID:</strong> {ingredient.id}</p>*/}
                        {/*<p><strong>식품군:</strong> {ingredient.foodGroup}</p>*/}
                        {/*<p><strong>식품명:</strong> {ingredient.foodName}</p>*/}
                        {/*<p><strong>에너지 (kcal):</strong> {ingredient.energyKcal}</p>*/}
                        {/*<p><strong>탄수화물 (g):</strong> {ingredient.carbohydrateG}</p>*/}
                        {/*<p><strong>단백질 (g):</strong> {ingredient.proteinG}</p>*/}
                        {/*<p><strong>나트륨 (mg):</strong> {ingredient.sodiumMg}</p>*/}
                        {/*<p><strong>지방 (g):</strong> {ingredient.fatG}</p>*/}
                        {/*<p><strong>당류 (g):</strong> {ingredient.sugarG}</p>*/}
                    </div>
                )}
            </div>
        </div>
</MainProvider>
    );
};

export default Community_recipe_Detail;
