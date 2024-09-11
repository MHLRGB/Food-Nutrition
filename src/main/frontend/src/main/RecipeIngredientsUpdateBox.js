import React, {useContext, useEffect, useState} from "react";
import {MainContext} from "./MainContext";
import recipeImg from "../image/recipe.png";
import {getRecipeById, updateRecipe} from "../apis/Recipe_api";
import {RecipeContext} from "../community/RecipeContext";
import {useNavigate} from "react-router-dom";

const RecipeIngredientsUpdateBox = ({recipeId}) => {
    const navigate = useNavigate();
    const {
        recipeTitle,
        setRecipeTitle,
        recipeCategory,
        setRecipeCategory,
        recipeIngredients,
        setRecipeIngredients
    } = useContext(RecipeContext);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const recipeData = await getRecipeById(recipeId);
                setRecipeTitle(recipeData.title);
                setRecipeCategory(recipeData.category);
                setRecipeIngredients(recipeData.ingredients || []);  // 재료 목록 설정
                setLoading(false);
            } catch (error) {
                setError('Failed to load recipe. Please try again.');
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [recipeId, setRecipeTitle, setRecipeCategory, setRecipeIngredients]);

    const handleIngredientChange = (index, event) => {
        const { name, value } = event.target;
        const newIngredients = [...recipeIngredients];

        if (name === 'ingredientId') {
            newIngredients[index].ingredientInfo.ingredientsID = value;  // ingredientId 업데이트
        } else {
            newIngredients[index][name] = value;  // quantity 등 다른 필드 업데이트
        }

        setRecipeIngredients(newIngredients);
    };

    const addIngredient = () => {
        setRecipeIngredients([
            ...recipeIngredients,
            { ingredientInfo: { ingredientsID: '' }, quantity: '' }  // ingredientInfo 추가
        ]);
    };

    const removeIngredient = (index) => {
        const newIngredients = recipeIngredients.filter((_, i) => i !== index);
        setRecipeIngredients(newIngredients);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await updateRecipe(recipeId, recipeTitle, recipeCategory, recipeIngredients);  // prop으로 받은 recipeId 사용
            navigate('/recipe');  // 성공 후 리다이렉트
            console.log('Success:', response);
        } catch (error) {
            setError('Failed to update recipe. Please try again.');
            console.error('Error:', error);
        }
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='recipe_container'>
            <div className='recipe_title'>
                {/*<img*/}
                {/*    src={}*/}
                {/*    alt='레시피 이미지'*/}
                {/*    className='mypage_interaction_image'*/}
                {/*    onError={(e) => {*/}
                {/*        e.target.src = recipeImg;*/}
                {/*    }}*/}
                {/*/>*/}
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

                {recipeIngredients.length > 0 ? (
                    <>
                        {recipeIngredients.map((ingredient, index) => (
                            <>
                                <IngredientGroup
                                    key={index}
                                    name={item.ingredientInfo.name}
                                    quantity={item.quantity}
                                    calorie={item.ingredientInfo.cal}
                                    sugar={item.ingredientInfo.sugars}
                                    sodium={item.ingredientInfo.sodium}
                                    protein={item.ingredientInfo.protein}
                                    carbohydrate={item.ingredientInfo.carbohydrates}
                                    fat={item.ingredientInfo.fat}
                                />
                                <button type="button" onClick={() => removeIngredient(index)}>Remove</button>
                            </>
                        ))}

                    </>
                ) : (
                    <p>레시피에 재료가 없습니다.</p>
                )}
            </div>
        </div>
    );
}
const IngredientGroup = ({name, standard, calorie, sugar, sodium, protein, carbohydrate, fat}) => {

    const {totalIngredients, setTotalIngredients} = React.useContext(MainContext);
    const [currentStandard, setCurrentStandard] = useState(parseInt(standard));
    const [calorieAmount, setCalorieAmount] = useState(Math.round(calorie * parseInt(standard)));
    const [sugarAmount, setSugarAmount] = useState(Math.round(sugar * parseInt(standard)));
    const [sodiumAmount, setSodiumAmount] = useState(Math.round(sodium * parseInt(standard)));
    const [proteinAmount, setProteinAmount] = useState(Math.round(protein * parseInt(standard)));
    const [carbohydrateAmount, setCarbohydrateAmount] = useState(Math.round(carbohydrate * parseInt(standard)));
    const [fatAmount, setFatAmount] = useState(Math.round(fat * parseInt(standard)));

    const handleStandardChange = (e) => {
        setCurrentStandard(parseInt(e.target.value));
    };

    useEffect(() => {
        calculateTotalIngredient();
    }, [currentStandard]);

    const calculateTotalIngredient = () => {
        // Remove the previous ingredient entry for this ingredient
        setTotalIngredients(prevIngredients =>
            prevIngredients.filter(ingredient => ingredient.name !== name)
        );

        const newCalorieAmount = Math.round(calorie * (currentStandard/100));
        const newSugarAmount = Math.round(sugar * (currentStandard/100));
        const newSodiumAmount = Math.round(sodium * (currentStandard/100));
        const newProteinAmount = Math.round(protein * (currentStandard/100));
        const newCarbohydrateAmount = Math.round(carbohydrate * (currentStandard/100));
        const newFatAmount = Math.round(fat * (currentStandard/100));

        setCalorieAmount(newCalorieAmount);
        setSugarAmount(newSugarAmount);
        setSodiumAmount(newSodiumAmount);
        setProteinAmount(newProteinAmount);
        setCarbohydrateAmount(newCarbohydrateAmount);
        setFatAmount(newFatAmount);

        const ingredient = {
            name,
            calorie: newCalorieAmount,
            sugar: newSugarAmount,
            sodium: newSodiumAmount,
            protein: newProteinAmount,
            carbohydrate: newCarbohydrateAmount,
            fat: newFatAmount
        };

        // Add the new ingredient entry
        setTotalIngredients(prevIngredients => [...prevIngredients, ingredient]);
    };

    return (
        <div className='ingredient_group'>
            <div className='ingredient_title'>
                <div className='ingredient_title_text'>{name}</div>
                <input
                    type='number'
                    className='ingredient_standard_input'
                    value={currentStandard}
                    onChange={handleStandardChange}
                />
            </div>
            <div className='ingredient_info'>
                <div className='ingredient_info_detail'>
                    <div className='ingredient_info_detail_title'>칼로리</div>
                    <div className='ingredient_info_detail_content'>{calorieAmount}</div>
                </div>
                <div className='ingredient_info_detail'>
                    <div className='ingredient_info_detail_title'>당류</div>
                    <div className='ingredient_info_detail_content'>{sugarAmount}</div>
                </div>
                <div className='ingredient_info_detail'>
                    <div className='ingredient_info_detail_title'>나트륨</div>
                    <div className='ingredient_info_detail_content'>{sodiumAmount}</div>
                </div>
            </div>
            <div className='ingredient_info'>
                <div className='ingredient_info_detail'>
                    <div className='ingredient_info_detail_title'>단백질</div>
                    <div className='ingredient_info_detail_content'>{proteinAmount}</div>
                </div>
                <div className='ingredient_info_detail'>
                    <div className='ingredient_info_detail_title'>탄수화물</div>
                    <div className='ingredient_info_detail_content'>{carbohydrateAmount}</div>
                </div>
                <div className='ingredient_info_detail'>
                    <div className='ingredient_info_detail_title'>지방</div>
                    <div className='ingredient_info_detail_content'>{fatAmount}</div>
                </div>
            </div>
        </div>
    );
};

export default RecipeIngredientsUpdateBox;