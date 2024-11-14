import React, {useEffect, useState} from "react";
import {MainContext} from "./MainContext";
import recipeImg from "../image/recipe.png";
import {getIngredientById, getRecipeById} from "../apis/Recipe_api";

const RecipeIngredientsBox = ({recipeId}) => {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState(null);

    const [renderedIngredients, setRenderedIngredients] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 레시피 데이터 가져오기
                const recipeData = await getRecipeById(recipeId);
                setRecipe(recipeData);

                // 재료 데이터 가져오기
                setIngredients(recipeData.ingredientsInfo || []);
            } catch (error) {
                console.log("Error : "+error.message);
            } finally {
                setLoading(false);
            }
        };

        // recipeId가 존재하는 경우에만 fetchData 호출
        if (recipeId !== null) {
            fetchData();
        }
    }, [recipeId]);  // recipeId가 변경될 때마다 실행

    // 섹션별로 재료를 그룹화하는 함수
    // const groupIngredientsBySection = (ingredients) => {
    //     return ingredients.reduce((acc, ingredient) => {
    //         const section = ingredient.section;
    //         if (!acc[section]) {
    //             acc[section] = [];
    //         }
    //         acc[section].push(ingredient);
    //         return acc;
    //     }, {});
    // };
    const groupIngredientsBySection = (ingredients) => {
        const grouped = ingredients.reduce((acc, ingredient) => {
            const section = ingredient.section;
            if (!acc[section]) {
                acc[section] = [];
            }
            acc[section].push(ingredient);
            return acc;
        }, {});

        // 특정 섹션을 첫 번째로 정렬하여 배열로 변환
        const sortedSections = Object.keys(grouped).sort((a, b) => {
            if (a === "재료" || a === "주재료") return -1;
            if (b === "재료" || b === "주재료") return 1;
            return 0;
        });

        // 정렬된 섹션 순서로 새 객체 생성
        return sortedSections.reduce((acc, section) => {
            acc[section] = grouped[section];
            return acc;
        }, {});
    };

    const groupedIngredients = groupIngredientsBySection(ingredients);

    if (recipeId == null) {
        return <div>등록된 레시피가 없습니다.</div>;
    }

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!recipe) {
        return <div>레시피를 찾을 수 없습니다.</div>;
    }

    return (
        <div className='recipe_container'>
            <div className="recipe_info">
                <div className="recipe_title">{recipe.recipeTitle}</div>
            </div>
            <div>
                <p><strong>Recipe Info:</strong> {recipe.recipeInfo}</p>
                <p><strong>Views:</strong> {recipe.views}</p>
                <p><strong>Chef:</strong> {recipe.chef}</p>
                <p><strong>Serving:</strong> {recipe.serving}</p>
                <p><strong>Cooking Time:</strong> {recipe.cookingTime}</p>
                <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
                <p><strong>Hashtag:</strong> {recipe.hashtag}</p>
                <p><strong>By Type:</strong> {recipe.byType}</p>
                <p><strong>By Situation:</strong> {recipe.bySituation}</p>
                <p><strong>By Ingredient:</strong> {recipe.byIngredient}</p>
                <p><strong>By Method:</strong> {recipe.byMethod}</p>
            </div>

            {Object.keys(groupedIngredients).map((section) => (
                <div key={section}>
                    <h3>{section}</h3>
                    <ul>
                        {groupedIngredients[section].map((ingredient) => (
                            <>
                            {ingredient.ingredientId === 99999 && (
                                    <div className="unknown-ingredient-message">해당 재료의 영양성분을 찾을 수 없습니다.</div>
                                )}
                            <IngredientGroup
                                key={ingredient.ingredientId}
                                ingredientId={ingredient.ingredientId}
                                unit={ingredient.unit}
                                ingredientName={ingredient.ingredientName}
                                section={ingredient.section}
                                standard={ingredient.quantity}
                            />
                            </>
                        ))}
                    </ul>
                </div>
            ))}
            <div className="recipe_bottom"/>
        </div>
    );
}
const IngredientGroup = ({ingredientId, unit, ingredientName, section, standard}) => {
    const [currentStandard, setCurrentStandard] = useState(standard || 0); // 기본값 0 설정
    const [ingredient, setIngredient] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 재료 데이터 가져오기
                const ingredientData = await getIngredientById(ingredientId);

                // ingredientData로부터 필요한 데이터 설정
                setIngredient({
                    ingredientName: ingredientData.ingredientName,
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

        // setCurrentStandard(parseInt(e.target.value) || 0);  // 값이 없으면 0으로 설정

        const newQuantity = parseInt(e.target.value) || 0;  // 값이 없으면 0으로 설정
        setCurrentStandard(newQuantity);

        // console.log("Section 정보:", section);

        // Update the quantity in totalIngredients, checking both ingredientId and section
        setTotalIngredients((prevIngredients) => {
            console.log("Total Ingredients before update:", prevIngredients);  // 이전 totalIngredients 값 로깅
            return prevIngredients.map((ing) =>
                ing.id === ingredientId && ing.section === section
                    ? { ...ing, quantity: newQuantity }
                    : ing
            );
        });
    };

    const calculateTotalIngredient = () => {
        // currentStandard가 유효하지 않으면 0을 기본값으로 사용
        const validStandard = currentStandard || 0;

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
            prevIngredients.filter((ing) =>
                !(ing.id === ingredientId && ing.section === section)
            )
        );

        // 기존 재료 정보를 삭제하고 새로운 재료 정보를 추가
        // setTotalIngredients((prevIngredients) =>
        //     prevIngredients.filter((ing) => ing.name !== ingredient.name)
        // );

        const newIngredient = {
            id : ingredientId,
            // name: ingredient.name,
            section: section,
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
                        <div className="ingredient_title_text">
                            {ingredient.ingredientName === "Unknown Ingredient" ? ingredientName : ingredient.ingredientName}
                        </div>
                        <div className="ingredient_standard_input_group">
                            <input
                                type="number"
                                className="ingredient_standard_input"
                                value={currentStandard}
                                onChange={handleStandardChange}
                            />
                            <div className="ingredient_unit">{unit}</div>
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

export default RecipeIngredientsBox;