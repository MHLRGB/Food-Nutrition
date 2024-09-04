import React, {useEffect, useState} from "react";
import {MainContext} from "./MainContext";
import recipeImg from "../image/recipe.png";
import {getRecipeById} from "../apis/Recipe_api";

const RecipeIngredientsBox = ({recipeId}) => {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recipe, setRecipe] = useState(null);


    useEffect(() => {

        const fetchData = async () => {
            try {
                // 레시피 데이터 가져오기
                const recipeData = await getRecipeById(recipeId);
                setRecipe(recipeData);

                // 재료 데이터 가져오기
                setIngredients(recipeData.ingredients || []); // `ingredients` 배열을 설정
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        // recipeId가 존재하는 경우에만 fetchData 호출
        if (recipeId !== null) {
            fetchData();
        }
    }, [recipeId]);  // recipeId가 변경될 때마다 실행

    if (recipeId == null) {
        return <div>등록된 레시피가 없습니다.</div>;
    }

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!recipe) {
        return <div>레시피를 찾을 수 없습니다.</div>;
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
                    {ingredients.length > 0 ? (
                        <>
                            <h3>{recipe.title}</h3>
                            <div>{recipe.category}</div>
                            {ingredients.map((item, index) => (
                                <IngredientGroup
                                    key={index}
                                    name={item.ingredientInfo.name}
                                    standard={item.quantity}
                                    calorie={item.ingredientInfo.cal}
                                    sugar={item.ingredientInfo.sugars}
                                    sodium={item.ingredientInfo.sodium}
                                    protein={item.ingredientInfo.protein}
                                    carbohydrate={item.ingredientInfo.carbohydrates}
                                    fat={item.ingredientInfo.fat}
                                />
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

export default RecipeIngredientsBox;