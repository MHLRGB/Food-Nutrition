import React, {useEffect, useState} from "react";
import {MainContext} from "./MainContext";
import recipeImg from "../image/recipe.png";
import {getIngredientById, getRecipeById} from "../apis/Recipe_api";

const RecipeIngredientsBox = ({recipeId}) => {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState(null);

    const [renderedIngredients, setRenderedIngredients] = useState([]);

    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(prevShowDetails => !prevShowDetails);
    };



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
                <div className="byGroup">
                    <p className="byGroup_text">{recipe.byType}</p>
                    <p className="byGroup_text">{recipe.bySituation}</p>
                    <p className="byGroup_text">{recipe.byIngredient}</p>
                    <p className="byGroup_text">{recipe.byMethod}</p>
                </div>

                <button className="showDetails" onClick={toggleDetails}>
                    {showDetails ? '숨기기' : '자세히 보기'}
                </button>

                {showDetails && (
                    <div className="recipe_detail">
                        <div className="recipe_detail_table_box">
                            <table border='1' className="recipe_detail_table">
                                <tbody>
                                <tr>
                                    <td className="recipe_detail_title_td">작성자</td>
                                    <td className="recipe_detail_title_td">인원 수</td>
                                </tr>
                                <tr>
                                    <td className="recipe_detail_content_tr">{recipe.chef}</td>
                                    <td className="recipe_detail_content_tr">{recipe.serving}인분</td>
                                </tr>
                                <tr>
                                    <td className="recipe_detail_title_td">조리시간</td>
                                    <td className="recipe_detail_title_td">난이도</td>
                                </tr>
                                <tr>
                                    <td className="recipe_detail_content_tr">{recipe.cookingTime}</td>
                                    <td className="recipe_detail_content_tr">{recipe.difficulty}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        {recipe.recipeInfo !== "None" && recipe.recipeInfo !== "" && (
                            <>
                                <p className="recipe_detail_title">레시피 소개</p>
                                <p className="recipe_detail_content">{recipe.recipeInfo}</p>
                            </>
                        )}

                        {recipe.hashtag !== "None" && recipe.hashtag !== "" && (
                            <>
                                <br />
                                <p className="recipe_detail_content">
                                    {recipe.hashtag.replace(/[\[\]'"]/g, '').split(',').map(tag => `#${tag.trim()}`).join(', ')}
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>


            {
                Object.keys(groupedIngredients).map((section) => (
                    <div key={section}>
                        <h3>{section}</h3>
                        <ul>
                            {groupedIngredients[section].map((ingredient) => (
                                <>
                                {/*{ingredient.ingredientId === 99999 && (*/}
                                    {/*    <div className="unknown-ingredient-message">해당 재료의 영양성분을 찾을 수 없습니다.</div>*/}
                                    {/*)}*/}
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
    const [currentUnit, setCurrentUnit] = useState(unit);
    const [ingredientUnitGroup, setIngredientUnitGroup] = useState("기본");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 재료 데이터 가져오기
                const ingredientData = await getIngredientById(ingredientId);

                // ingredientData로부터 필요한 데이터 설정
                setIngredient({
                    ingredientName: ingredientData.ingredientName,
                    ingredientGroup: ingredientData.ingredientGroup,
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
            const fetchIngredientUnitGroup = ingredient && (
                [
                    "당류",
                    "우유 및 그 제품",
                    "음료류",
                    "주류",
                    "차류",
                    "유지류",
                    "조미료류",
                    "소스"
                ].includes(ingredient.ingredientGroup) ? "액체 및 조미료류" :
                    [
                        "두류",
                        "견과류",
                        "종실류"
                    ].includes(ingredient.ingredientGroup) ? "견과류" :
                        [
                            "육류 및 그 제품",
                            "어패류 및 그 제품"
                        ].includes(ingredient.ingredientGroup) ? "고기류" : "기본"
            );
            setIngredientUnitGroup(fetchIngredientUnitGroup);
            calculateTotalIngredient();
        }
    }, [currentStandard, ingredient, currentUnit]);

    const handleStandardChange = (e) => {

        const inputValue = e.target.value;

        // 숫자와 소수점만 허용하는 정규식을 이용해 입력값 검증
        if (/^\d*\.?\d*$/.test(inputValue)) {
            setCurrentStandard(inputValue);

            // `inputValue`가 비어있을 때는 0으로 초기화하거나 `parseFloat`로 처리하여 소수점 값으로 변환
            const newQuantity = parseFloat(inputValue) || 0;

            // totalIngredients 업데이트 로직
            setTotalIngredients((prevIngredients) => {
                return prevIngredients.map((ing) =>
                    ing.id === ingredientId && ing.section === section
                        ? { ...ing, quantity: newQuantity }
                        : ing
                );
            });
        }
    };


    const handleIncrement = () => {
        setCurrentStandard((prev) => {
            const newValue = parseFloat(prev) + 1.0;
            return parseFloat(newValue.toFixed(1)); // 소수점 한 자릿수로 반올림
        });
    };

    const handleDecrement = () => {
        setCurrentStandard((prev) => {
            const newValue = Math.max(0, parseFloat(prev) - 1.0);
            return parseFloat(newValue.toFixed(1)); // 소수점 한 자릿수로 반올림
        });
    };

    const handleUnitChange = (e) => {
        const selectedUnit = e.target.value;
        setCurrentUnit(selectedUnit); // 드롭다운에서 선택된 값을 currentUnit 상태에 반영
    };

    const unitConversions = {
        "컵" : 240,
        "공기" : 200,
        "줌" : 25,
        "근" : 600,
        "알" : 55,
        "tsp" : 5,
        "숟가락": 10,
        "tbsp": 15,
        "kg": 1000,
        "ml": 1,
        "l" : 1000,
        "g": 1,
    };

    const calculateTotalIngredient = () => {
        // currentStandard가 유효하지 않으면 0을 기본값으로 사용
        const validStandard = currentStandard || 0;

        let multiplier = (unitConversions[currentUnit] || 1) * validStandard;

        const newCalorieAmount = Math.round(ingredient.calorie * (multiplier / 100));
        const newSugarAmount = Math.round(ingredient.sugar * (multiplier / 100));
        const newSodiumAmount = Math.round(ingredient.sodium * (multiplier / 100));
        const newProteinAmount = Math.round(ingredient.protein * (multiplier / 100));
        const newCarbohydrateAmount = Math.round(ingredient.carbohydrates * (multiplier / 100));
        const newFatAmount = Math.round(ingredient.fat * (multiplier / 100));

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
                            {Object.keys(unitConversions).includes(currentUnit) && (
                            <>
                                <div className="quantity_control">
                                    <button className="quantity_control_button" onClick={handleDecrement}>-</button>
                                    <button className="quantity_control_button" onClick={handleIncrement}>+</button>
                                </div>
                                <input
                                    className="ingredient_standard_input"
                                    value={currentStandard}
                                    onChange={handleStandardChange}
                                />
                            </>
                            )}
                            <div className="ingredient_unit_dropdown">
                                <select className="ingredient_unit_dropdown_select" value={currentUnit}
                                        onChange={handleUnitChange}>
                                    {/* 항상 currentUnit이 포함된 드롭다운 메뉴 */}
                                    <option className="ingredient_unit_dropdown_option"
                                            value={currentUnit}>{currentUnit}</option>

                                    {/* currentUnit과 동일하지 않은 unit이 있을 경우 드롭다운에 추가 */}
                                    {currentUnit !== unit && unit !== 'g' &&
                                        <option className="ingredient_unit_dropdown_option"
                                                value={unit}>{unit}</option>}

                                    {/* 'g'가 currentUnit으로 선택되어 있을 때는 g 외의 다른 단위를 추가 */}
                                    {currentUnit !== 'g' &&
                                        <option className="ingredient_unit_dropdown_option" value="g">g</option>}
                                    {ingredientUnitGroup === "액체 및 조미료류" ? (
                                        <>
                                            {currentUnit !== 'l' &&
                                                <option className="ingredient_unit_dropdown_option" value="l">l</option>}
                                            {currentUnit !== 'ml' &&
                                                <option className="ingredient_unit_dropdown_option" value="ml">ml</option>}
                                            {currentUnit !== '숟가락' &&
                                                <option className="ingredient_unit_dropdown_option" value="숟가락">숟가락</option>}
                                            {currentUnit !== 'tsp' &&
                                                <option className="ingredient_unit_dropdown_option" value="tsp">tsp</option>}
                                            {currentUnit !== 'tbsp' &&
                                                <option className="ingredient_unit_dropdown_option" value="tbsp">tbsp</option>}
                                            {currentUnit !== '컵' &&
                                                <option className="ingredient_unit_dropdown_option" value="컵">컵</option>}
                                        </>
                                    ) : ingredientUnitGroup === "고기류" ? (
                                        <>
                                            {currentUnit !== '근' &&
                                                <option className="ingredient_unit_dropdown_option" value="근">근</option>}
                                            {currentUnit !== 'kg' &&
                                                <option className="ingredient_unit_dropdown_option" value="kg">kg</option>}
                                        </>
                                    ) : ingredientUnitGroup === "견과류" ? (
                                        <>
                                            {currentUnit !== '줌' &&
                                                <option className="ingredient_unit_dropdown_option" value="줌">줌</option>}
                                        </>
                                    ) : (
                                        <>
                                            {currentUnit !== 'kg' &&
                                                <option className="ingredient_unit_dropdown_option" value="kg">kg</option>}
                                        </>
                                    )}
                                </select>
                            </div>

                        </div>
                    </div>
                    {ingredient.ingredientName === "Unknown Ingredient" ? (
                        <div className="unknown-ingredient-message">
                            해당 재료의 영양성분을 찾을 수 없습니다.
                            <br/>
                            다른 재료로 바꿔보세요.
                        </div>
                    ) : currentStandard > 0 ? (  // standard가 0보다 클 경우 영양성분을 보여줌
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
                            </div>
                            <div className="ingredient_info">
                                <div className="ingredient_info_detail">
                                    <div className="ingredient_info_detail_title">나트륨</div>
                                    <div className="ingredient_info_detail_content">{sodiumAmount} mg</div>
                                </div>
                                <div className="ingredient_info_detail">
                                    <div className="ingredient_info_detail_title">단백질</div>
                                    <div className="ingredient_info_detail_content">{proteinAmount} g</div>
                                </div>
                            </div>
                            <div className="ingredient_info">
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
                    ) : (
                        <div className="unknown-ingredient-message">
                            해당 단위로 영양성분을 계산할 수 없습니다.
                            <br/>
                            다른 단위로 바꿔보세요.
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RecipeIngredientsBox;