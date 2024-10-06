import React, {useContext, useEffect, useState} from "react";
import {getIngredientById, getRecipeById, updateRecipe} from "../apis/Recipe_api";
import {RecipeContext, RecipeProvider} from "../community/RecipeContext";
import {MainContext, MainProvider} from "./MainContext";
import {useNavigate} from "react-router-dom";

const RecipeIngredientsUpdateBox = ({ recipeId, showEditButton }) => {
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


    const { totalIngredients, setTotalIngredients } = React.useContext(MainContext);

    const [error, setError] = useState(null);
    const [recipe, setRecipe] = useState(null);
    const [newIngredientId, setNewIngredientId] = useState(""); // State for new ingredient ID
    const [loading, setLoading] = useState(true);

    const [renderedIngredients, setRenderedIngredients] = useState([]);

    useEffect(() => {
        if (recipeId !== null) {
            fetchData();
            recipeIngredients.forEach((ingredient) => {
                console.log(ingredient);
            });
        }

    }, [recipeId, setRecipeIngredients]);

    useEffect(() => {
        console.log("recipeIngredients가 업데이트되었습니다:");
        recipeIngredients.forEach((ingredient) => {
            console.log(ingredient);
        });

        // recipeIngredients가 변경될 때 totalIngredients 업데이트
        const updatedTotalIngredients = totalIngredients.filter(
            (ingredient) => !recipeIngredients.some((item) => item.ingredientId === ingredient.id)
        );

        setTotalIngredients(updatedTotalIngredients);

        if (recipeIngredients.length > 0) {
            const ingredientsToRender = recipeIngredients.map((ingredient) => (
                <IngredientGroup
                    key={ingredient.ingredientId}
                    ingredientId={ingredient.ingredientId}
                    standard={ingredient.quantity}
                    onRemove={() => handleRemoveIngredient(ingredient.ingredientId)}
                    ParentRecipeIngredients={recipeIngredients} // 추가된 부분
                />
            ));
            setRenderedIngredients(ingredientsToRender);
        } else {
            setRenderedIngredients(<p>레시피에 재료가 없습니다.</p>);
        }

    }, [recipeIngredients]); // recipeIngredients가 변경될 때마다 실행


    const fetchData = async () => {
        try {
            // Fetch recipe data
            const recipeData = await getRecipeById(recipeId);
            setRecipe(recipeData);
            setRecipeTitle(recipeData.title);
            setRecipeContent(recipeData.content);
            setRecipeCategory(recipeData.category);
            // Fetch ingredients data
            setRecipeIngredients(recipeData.ingredientsInfo || []);  // recipeIngredients에 설정
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await updateRecipe(recipeId, recipeTitle, recipeContent, recipeCategory, recipeIngredients);  // prop으로 받은 recipeId 사용
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


    // 10/01
    // const handleRemoveIngredient = (ingredientIdToRemove) => {
    //     console.log("handleRemoveIngredient() 함수 호출");
    //
    //     // recipeIngredients에서 해당 ingredientId를 제외한 새 배열을 생성
    //     const updatedIngredients = recipeIngredients.filter(ingredient => ingredient.ingredientId !== ingredientIdToRemove);
    //
    //     // 각 ingredient의 ingredientId 값을 콘솔에 출력
    //     updatedIngredients.forEach(ingredient => {
    //         console.log(ingredient.ingredientId);
    //     });
    //
    //     // 상태 업데이트
    //     setRecipeIngredients([...updatedIngredients]);
    // };

    // 10/01
    const handleRemoveIngredient = (ingredientIdToRemove) => {
        console.log("handleRemoveIngredient() 함수 호출");

        // recipeIngredients에서 해당 ingredientId를 제외한 새 배열을 생성
        const updatedIngredients = recipeIngredients.filter(ingredient => ingredient.ingredientId !== ingredientIdToRemove);

        // 상태 업데이트 (recipeIngredients)
        setRecipeIngredients(updatedIngredients);

        // totalIngredients에서 해당 ingredientId를 가진 재료의 영양소 정보 제거
        setTotalIngredients((prevIngredients) =>
            prevIngredients.filter(ingredient => ingredient.id !== ingredientIdToRemove)
        );

        // totalIngredients.forEach((ingredient) => {
        //     console.log(ingredient);
        // });
    };

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
        <div className="recipe_container">
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

                {/* 렌더링된 재료 출력 */}
                {renderedIngredients}

                {showEditButton && <button type="submit">Update Recipe</button>}
            </form>
        </div>
    );
};

const IngredientGroup = ({
                                   ingredientId, standard, onRemove, ParentRecipeIngredients
                               }) => {

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

    useEffect(() => {
        if (ingredient) {
            updateTotalIngredient();
        }
    }, [ingredient, ParentRecipeIngredients]);


    const handleStandardChange = (e) => {
        const newQuantity = parseInt(e.target.value) || 0;  // 값이 없으면 0으로 설정
        setCurrentStandard(newQuantity);

        // Update the quantity in recipeIngredients
        const updatedIngredients = recipeIngredients.map((ing) =>
            ing.ingredientId === ingredientId ? { ...ing, quantity: newQuantity } : ing
        );
        setRecipeIngredients(updatedIngredients);
    };

    const updateTotalIngredient = () => {
        console.log("updateNumberTotalIngredient() 호출됨");

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

        setTotalIngredients((prevIngredients) =>
            prevIngredients.filter((ing) => ing.id !== ingredientId)
        );

        const newIngredient = {
            name: ingredient.name,
            id: ingredientId,
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
                        {/*<div className="ingredient_title_text">{ingredient.name}</div>*/}
                        <div className="ingredient_title_text">{ingredientId}</div>
                        <div className="ingredient_standard_input_group">
                            <input
                                type="number"
                                className="ingredient_standard_input"
                                value={currentStandard}
                                onChange={handleStandardChange}
                            />
                            <div className="ingredient_unit">g</div>
                            <button type="button" onClick={() => {
                                onRemove();
                            }}>Remove
                            </button>
                        </div>

                    </div>

                    <div className="ingredient_info_group">
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
                    </div>
                </>
            )}
        </div>
    );
};

export default RecipeIngredientsUpdateBox;
