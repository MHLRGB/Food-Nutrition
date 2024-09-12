import React, {useContext, useEffect, useState} from "react";
import {createRecipe, getIngredientById, getRecipeById, updateRecipe} from "../apis/Recipe_api";
import {RecipeContext, RecipeProvider} from "../community/RecipeContext";
import {MainContext, MainProvider} from "./MainContext";
import {useNavigate} from "react-router-dom";

const RecipeIngredientsCreateBox = ({showEditButton}) => {
    const navigate = useNavigate();
    const {
        recipeTitle,
        setRecipeTitle,
        recipeContent,
        setRecipeContent,
        recipeCategory,
        setRecipeCategory,
        recipeIngredients,
        setRecipeIngredients
    } = useContext(RecipeContext);  // recipeIngredients와 setRecipeIngredients 사용

    const [error, setError] = useState(null);
    const [newIngredientId, setNewIngredientId] = useState(""); // State for new ingredient ID

    useEffect(() => {
        setRecipeIngredients([]);
    }, [setRecipeIngredients]);


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await createRecipe(recipeTitle, recipeContent, recipeCategory, recipeIngredients);  // prop으로 받은 recipeId 사용
            navigate('/recipe');  // 성공 후 리다이렉트
            console.log('Success:', response);
        } catch (error) {
            setError('Failed to update recipe. Please try again.');
            console.error('Error:', error);
        }
    };

    const handleAddIngredient = () => {
        if (newIngredientId) {

            setRecipeIngredients([...recipeIngredients, { ingredientId: newIngredientId, quantity: 100 }]);
            setNewIngredientId(""); // Reset the input
        }
    };

    const handleRemoveIngredient = (ingredientIdToRemove) => {
        setRecipeIngredients(recipeIngredients.filter(ingredient => ingredient.ingredientId !== ingredientIdToRemove));
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }


    return (
        <div className="recipe_container">
            <div className="recipe_title">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={recipeTitle}
                        onChange={(e) => setRecipeTitle(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={recipeCategory}
                        onChange={(e) => setRecipeCategory(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Content"
                        value={recipeContent}
                        onChange={(e) => setRecipeContent(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Ingredient ID"
                        value={newIngredientId}
                        onChange={(e) => setNewIngredientId(e.target.value)}
                    />
                    <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>

                    {recipeIngredients.length > 0 ? (
                        <>
                            {recipeIngredients.map((ingredient, index) => (
                                <IngredientCreateGroup
                                    ingredientId={ingredient.ingredientId}
                                    standard={ingredient.quantity}
                                    onRemove={() => handleRemoveIngredient(ingredient.ingredientId)}
                                />
                            ))}
                        </>
                    ) : (
                        <p>레시피에 재료가 없습니다.</p>
                    )}
                    {showEditButton && <button type="submit">Create Recipe</button>}
                </form>
            </div>
        </div>
    );
};

const IngredientCreateGroup = ({ingredientId, standard, onRemove}) => {

    const [currentStandard, setCurrentStandard] = useState(standard || 0);  // 값이 없으면 0으로 설정
    const [ingredient, setIngredient] = useState(null);

    const {recipeIngredients, setRecipeIngredients} = useContext(RecipeContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ingredientData = await getIngredientById(ingredientId);
                setIngredient({
                    name: ingredientData.name,
                    calorie: ingredientData.cal,
                    sugar: ingredientData.sugars,
                    sodium: ingredientData.sodium,
                    protein: ingredientData.protein,
                    carbohydrates: ingredientData.carbohydrates,
                    fat: ingredientData.fat,
                });

            } catch (error) {
                console.error("Error fetching ingredient:", error);
            }
        };
        fetchData();
    }, [ingredientId]);

    // 총 재료 값들을 컨텍스트에서 가져오기
    const { totalIngredients, setTotalIngredients } = React.useContext(MainContext);

    // 영양소별 상태값
    const [calorieAmount, setCalorieAmount] = useState(0);
    const [sugarAmount, setSugarAmount] = useState(0);
    const [sodiumAmount, setSodiumAmount] = useState(0);
    const [proteinAmount, setProteinAmount] = useState(0);
    const [carbohydrateAmount, setCarbohydrateAmount] = useState(0);
    const [fatAmount, setFatAmount] = useState(0);

    // 기준이 변경되면 영양소 재계산
    useEffect(() => {
        if (ingredient) {
            calculateTotalIngredient();
        }
    }, [currentStandard, ingredient]);

    const handleStandardChange = (e) => {
        const newQuantity = parseInt(e.target.value) || 0;  // 값이 없으면 0으로 설정
        setCurrentStandard(newQuantity);

        // Update the quantity in recipeIngredients
        const updatedIngredients = recipeIngredients.map((ing) =>
            ing.ingredientId === ingredientId ? { ...ing, quantity: newQuantity } : ing
        );
        setRecipeIngredients(updatedIngredients);
    };

    const calculateTotalIngredient = () => {
        const validStandard = currentStandard || 0;  // 값이 없으면 0으로 설정

        const newCalorieAmount = Math.round(ingredient.calorie * (validStandard / 100));
        const newSugarAmount = Math.round(ingredient.sugar * (validStandard / 100));
        const newSodiumAmount = Math.round(ingredient.sodium * (validStandard / 100));
        const newProteinAmount = Math.round(ingredient.protein * (validStandard / 100));
        const newCarbohydrateAmount = Math.round(ingredient.carbohydrates * (validStandard / 100));
        const newFatAmount = Math.round(ingredient.fat * (validStandard / 100));

        // 상태값 업데이트
        setCalorieAmount(newCalorieAmount);
        setSugarAmount(newSugarAmount);
        setSodiumAmount(newSodiumAmount);
        setProteinAmount(newProteinAmount);
        setCarbohydrateAmount(newCarbohydrateAmount);
        setFatAmount(newFatAmount);

        // 기존 재료 정보를 삭제하고 새로운 재료 정보를 추가
        setTotalIngredients((prevIngredients) =>
            prevIngredients.filter((ing) => ing.name !== ingredient.name)
        );

        const newIngredient = {
            name: ingredient.name,
            calorie: newCalorieAmount,
            sugar: newSugarAmount,
            sodium: newSodiumAmount,
            protein: newProteinAmount,
            carbohydrate: newCarbohydrateAmount,
            fat: newFatAmount,
        };

        setTotalIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    };

    return (
        <div className="ingredient_group">
            {ingredient && (
                <>
                    <div className="ingredient_title">
                        <div className="ingredient_title_text">{ingredient.name}</div>
                        <input
                            type="number"
                            className="ingredient_standard_input"
                            value={currentStandard}
                            onChange={handleStandardChange}
                        />
                        <button type="button" onClick={onRemove}>Remove</button>
                    </div>
                    <div className="ingredient_info">
                        <div className="ingredient_info_detail">
                            <div className="ingredient_info_detail_title">칼로리</div>
                            <div className="ingredient_info_detail_content">{calorieAmount} kcal</div>
                        </div>
                        <div className="ingredient_info_detail">
                            <div className="ingredient_info_detail_title">당류</div>
                            <div className="ingredient_info_detail_content">{sugarAmount} g</div>
                        </div>
                        <div className="ingredient_info_detail">
                            <div className="ingredient_info_detail_title">나트륨</div>
                            <div className="ingredient_info_detail_content">{sodiumAmount} mg</div>
                        </div>
                    </div>

                    <div className="ingredient_info">
                        <div className="ingredient_info_detail">
                            <div className="ingredient_info_detail_title">단백질</div>
                            <div className="ingredient_info_detail_content">{proteinAmount} g</div>
                        </div>
                        <div className="ingredient_info_detail">
                            <div className="ingredient_info_detail_title">탄수화물</div>
                            <div className="ingredient_info_detail_content">{carbohydrateAmount} g</div>
                        </div>
                        <div className="ingredient_info_detail">
                            <div className="ingredient_info_detail_title">지방</div>
                            <div className="ingredient_info_detail_content">{fatAmount} g</div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RecipeIngredientsCreateBox;
