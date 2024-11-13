import React, {useContext, useEffect, useRef, useState} from "react";
import {getIngredientById, getRecipeById, searchIngredients, updateRecipe} from "../apis/Recipe_api";
import {RecipeContext, RecipeProvider} from "../community/RecipeContext";
import {MainContext, MainProvider} from "./MainContext";
import {useNavigate} from "react-router-dom";

const RecipeIngredientsUpdateBox = ({ recipeId, showEditButton }) => {
    const navigate = useNavigate();
    const {
        recipe,
        setRecipe,
        recipeIngredients,
        setRecipeIngredients
    } = useContext(RecipeContext);  // recipeIngredients와 setRecipeIngredients 사용


    const { totalIngredients, setTotalIngredients } = React.useContext(MainContext);

    const [error, setError] = useState(null);
    const [getRecipe, setGetRecipe] = useState(null);
    const [newIngredientId, setNewIngredientId] = useState(""); // State for new ingredient ID
    const [loading, setLoading] = useState(true);

    const [renderedIngredients, setRenderedIngredients] = useState([]);


    // 섹션 추가 / 수정을 위한 섹션 temp
    const [newSection, setNewSection] = useState("");

    // 실질적인 섹션 저장 내용. 섹션 이름,
    const [sections, setSections] = useState([]);

    const debounceTimeoutRef = useRef(null); // 디바운스 타이머를 관리할 ref

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            [name]: value,
        }));
    };

    const handleAddSection = () => {
        if (newSection && !sections.some(section => section.name === newSection)) {
            setSections([...sections, { name: newSection, searchKeyword: "", searchResults: [] }]);
            setNewSection("");
        }
    };

    // 섹션 삭제 함수
    const handleRemoveSection = (sectionToRemove) => {
        const updatedSections = sections.filter(section => section.name !== sectionToRemove);
        setSections(updatedSections);

        // 해당 섹션의 재료도 삭제
        const ingredientsToRemove = recipeIngredients.filter(ingredient => ingredient.section === sectionToRemove);
        const updatedIngredients = recipeIngredients.filter(ingredient => ingredient.section !== sectionToRemove);
        setRecipeIngredients(updatedIngredients);

        // totalIngredients에서 삭제된 재료의 영양소 정보 제거
        setTotalIngredients(prevIngredients =>
            prevIngredients.filter(ingredient => !ingredientsToRemove.some(item => item.ingredientId === ingredient.id))
        );
    };

    // 섹션에서 재료를 검색할 때 해당하는 섹션의 검색창 하단에 검색 결과를 출력하기 위한 함수
    const handleSectionKeywordChange = async (index, keyword) => {
        // console.log("인덱스 : " + index + " 키워드 : " + keyword);
        const newSections = [...sections];
        newSections[index].searchKeyword = keyword;

        setSections(newSections);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current); // 이전 타이머를 클리어
        }

        debounceTimeoutRef.current = setTimeout(async () => {
            if (keyword.trim().length > 0) {
                try {
                    newSections[index].searchResults = await searchIngredients(keyword.trim());
                    setSections(newSections);

                    // 로깅
                    newSections[index].searchResults.forEach(ingredient => {
                        // console.log("sections : " + ingredient.foodName);
                    });
                } catch (error) {
                    console.error("Error fetching search results:", error);
                }
            }
        }, 300); // 300ms 후에 실행
    };

    // 재료 입력창에서 커서를 잃을 때 검색 결과 초기화
    const handleBlur = (index) => {
        const newSections = [...sections];
        newSections[index].searchResults = [];
        setSections(newSections);
    };


    useEffect(() => {
        if (recipeId !== null) {
            fetchData();
            // recipeIngredients.forEach((ingredient) => {
            //     console.log(ingredient);
            // });
        }

    }, [recipeId, setRecipeIngredients]);

    const fetchData = async () => {
        try {
            // Fetch recipe data
            const recipeData = await getRecipeById(recipeId);
            setGetRecipe(recipeData);
            setRecipe({
                recipeTitle: recipeData.recipeTitle,
                recipeInfo: recipeData.recipeInfo,  // 예시로 'info'로 가정, 실제 key 이름에 맞게 수정
                hashtag: recipeData.hashtag,
                byType: recipeData.byType,
                bySituation: recipeData.bySituation,
                byIngredient: recipeData.byIngredient,
                byMethod: recipeData.byMethod,
            });

            // Fetch ingredients data
            // setRecipeIngredients(recipeData.ingredientsInfo || []);  // recipeIngredients에 설정

            const ingredients = recipeData.ingredientsInfo || [];
            setRecipeIngredients(ingredients);  // recipeIngredients에 설정
            // sections 업데이트
            updateSections(ingredients);

            // // recipeIngredients.reduce((acc, ingredient) => {
            // //     setSections([...sections, { name: ingredient.section, searchKeyword: "", searchResults: [] }]);
            // // });
            //
            // recipeData.ingredientsInfo.forEach((ingredient) => {
            //     // sections에 ingredient의 section을 추가
            //     setSections((prevSections) => {
            //         const updatedSections = [...prevSections, { name: ingredient.section, searchKeyword: "", searchResults: [] }];
            //         console.log("Updated sections:", updatedSections); // 콘솔에 sections 출력
            //         return updatedSections;
            //     });
            // });

        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // const updateSections = (ingredients) => {
    //     const newSections = ingredients.reduce((acc, ingredient) => {
    //         // 중복된 섹션 추가 방지를 위해 이미 있는 섹션인지 체크
    //         if (!acc.some((section) => section.name === ingredient.section)) {
    //             acc.push({ name: ingredient.section, searchKeyword: "", searchResults: [] });
    //         }
    //         return acc;
    //     }, sections);
    //
    //     setSections(newSections);
    // };
    const updateSections = (ingredients) => {
        const newSections = ingredients.reduce((acc, ingredient) => {
            // 중복된 섹션 추가 방지를 위해 이미 있는 섹션인지 체크
            if (!acc.some((section) => section.name === ingredient.section)) {
                acc.push({ name: ingredient.section, searchKeyword: "", searchResults: [] });
            }
            return acc;
        }, sections);

        // "재료"와 "주재료" 섹션이 앞에 오도록 정렬
        const sortedSections = newSections.sort((a, b) => {
            if (a.name === "재료" || a.name === "주재료") return -1;
            if (b.name === "재료" || b.name === "주재료") return 1;
            return 0;
        });

        setSections(sortedSections);
    };


    useEffect(() => {
        console.log("recipeIngredients가 업데이트되었습니다:");
        // recipeIngredients.forEach((ingredient) => {
        //     console.log(ingredient);
        // });

        // recipeIngredients가 변경될 때 totalIngredients 업데이트
        const updatedTotalIngredients = totalIngredients.filter((ingredient) =>
            !recipeIngredients.some((item) =>
                item.ingredientId === ingredient.id && item.section === ingredient.section
            )
        );
        setTotalIngredients(updatedTotalIngredients);

        // recipeIngredients가 변경될 때마다 sections 업데이트
        // if (recipeIngredients.length > 0) {
        //     recipeIngredients.forEach((ingredient) => {
        //         // sections에 ingredient의 section을 추가
        //         setSections((prevSections) => {
        //             // 중복된 섹션 추가 방지를 위해 이미 있는 섹션인지 체크
        //             const sectionExists = prevSections.some((section) => section.name === ingredient.section);
        //
        //             if (!sectionExists) {
        //                 const updatedSections = [...prevSections, { name: ingredient.section, searchKeyword: "", searchResults: [] }];
        //                 console.log("Updated sections:", updatedSections); // 콘솔에 sections 출력
        //                 return updatedSections;
        //             }
        //
        //             return prevSections; // 중복된 섹션이 있을 경우 기존 섹션 반환
        //         });
        //     });
        // }
        // console.log("recipeIngredients 입니다: " + JSON.stringify(recipeIngredients, null, 2));

        const ingredientsBySection = {};

        sections.forEach((section) => {
            const sectionIngredients = recipeIngredients.filter(
                (ingredient) => ingredient.section === section.name
            );

            if (sectionIngredients.length > 0) {
                ingredientsBySection[section.name] = sectionIngredients.map((ingredient) => (
                    <>
                        {ingredient.ingredientId === 99999 && (
                            <div className="unknown-ingredient-message">해당 재료의 영양성분을 찾을 수 없습니다.</div>
                        )}
                        <IngredientGroup
                            key={ingredient.ingredientId}
                            ingredientId={ingredient.ingredientId}
                            standard={ingredient.quantity}
                            unit={ingredient.unit}
                            section={ingredient.section}
                            ingredientName={ingredient.ingredientName}
                            onRemove={() => handleRemoveIngredient(ingredient.ingredientId, ingredient.section)}
                            ParentRecipeIngredients={recipeIngredients}
                        />
                    </>
                ));
            } else {
                ingredientsBySection[section.name] = <p>레시피에 재료가 없습니다.</p>;
            }
        });

        setRenderedIngredients(ingredientsBySection);
    }, [recipeIngredients]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await updateRecipe(recipeId, recipe, recipeIngredients);  // prop으로 받은 recipeId 사용
            navigate('/recipe');  // 성공 후 리다이렉트
            console.log('Success:', response);
        } catch (error) {
            setError('Failed to update recipe. Please try again.');
            console.error('Error:', error);
        }
    };

    // 재료 추가 함수
    const handleAddIngredient = (ingredientId, section) => {
        // if (!recipeIngredients.some(ingredient => ingredient.ingredientId === ingredientId)) {
        //     setRecipeIngredients([...recipeIngredients, { ingredientId, quantity: 100, foodName, unit: "unittest", section }]);
        // }

        // 다른 재료 Section에 같은 재료가 있을 수 있으니 같은 재료 삽입 허용
        setRecipeIngredients([...recipeIngredients, { ingredientId, quantity: 100, unit: "unittest", section }]);

        const sectionIndex = sections.findIndex(sec => sec.name === section);
        if (sectionIndex !== -1) {
            const updatedSections = [...sections];
            updatedSections[sectionIndex].searchKeyword = "";
            updatedSections[sectionIndex].searchResults = [];
            setSections(updatedSections);
        }
    };

    // 10/01
    const handleRemoveIngredient = (ingredientIdToRemove, ingredientSectionToRemove) => {
        console.log("handleRemoveIngredient() 함수 호출");

        // recipeIngredients에서 해당 ingredientId를 제외한 새 배열을 생성
        //const updatedIngredients = recipeIngredients.filter(ingredient => ingredient.ingredientId !== ingredientIdToRemove);
        const updatedIngredients = recipeIngredients.filter(ingredient =>
            !(ingredient.ingredientId === ingredientIdToRemove && ingredient.section === ingredientSectionToRemove)
        );
        // 상태 업데이트 (recipeIngredients)
        setRecipeIngredients(updatedIngredients);

        // totalIngredients에서 해당 ingredientId를 가진 재료의 영양소 정보 제거
        // setTotalIngredients((prevIngredients) =>
        //     prevIngredients.filter(ingredient => ingredient.id !== ingredientIdToRemove)
        // );

        // totalIngredients에서 해당 ingredientId를 가진 재료의 영양소 정보 제거
        setTotalIngredients((prevIngredients) =>
            prevIngredients.filter(
                ingredient => !(ingredient.id === ingredientIdToRemove && ingredient.section === ingredientSectionToRemove)
            )
        );

    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!getRecipe) {
        return <div>레시피를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="recipe_container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="recipeTitle"
                    placeholder="Title"
                    className="recipeIngredients_form_input"
                    value={recipe.recipeTitle}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="recipeInfo"
                    placeholder="Recipe Info"
                    className="recipeIngredients_form_input"
                    value={recipe.recipeInfo}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="hashtag"
                    placeholder="Hashtag"
                    className="recipeIngredients_form_input"
                    value={recipe.hashtag}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="byType"
                    placeholder="Type"
                    className="recipeIngredients_form_input"
                    value={recipe.byType}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="bySituation"
                    placeholder="Situation"
                    className="recipeIngredients_form_input"
                    value={recipe.bySituation}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="byIngredient"
                    placeholder="Ingredient"
                    className="recipeIngredients_form_input"
                    value={recipe.byIngredient}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="byMethod"
                    placeholder="Method"
                    className="recipeIngredients_form_input"
                    value={recipe.byMethod}
                    onChange={handleInputChange}
                />

                <div className="section-add">
                    <input
                        type="text"
                        placeholder="New Section"
                        value={newSection}
                        onChange={(e) => setNewSection(e.target.value)}
                    />
                    <button type="button" onClick={handleAddSection}>섹션 추가</button>
                </div>

                {sections.map((section, index) => (
                    <div key={section.name}>
                        <div className="section">
                            <h3>
                                {section.name}
                                <button type="button" onClick={() => handleRemoveSection(section.name)}>삭제</button>
                            </h3>
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Search Ingredients..."
                                    value={section.searchKeyword}
                                    onChange={(e) => handleSectionKeywordChange(index, e.target.value)}
                                    onBlur={() => handleBlur(index)}
                                    className="search-input"
                                />
                                {section.searchKeyword.length > 0 && (
                                    <div className="results-box">
                                        <ul className="results-list">
                                            {section.searchResults.map(ingredient => (
                                                <li key={ingredient.ingredientId} className="results-item"
                                                    onMouseDown={() => handleAddIngredient(ingredient.ingredientId, section.name)}>
                                                    {ingredient.ingredientName}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                )}
                            </div>
                        </div>
                        {renderedIngredients[section.name]}
                    </div>
                ))}

                {/*{sections.map((section) => (*/}
                {/*    <div key={section.name}>*/}
                {/*        {renderedIngredients[section.name] || null} /!* 해당 section에 맞는 renderedIngredients 출력 *!/*/}
                {/*    </div>*/}
                {/*))}*/}
                {showEditButton && <button type="submit">Update Recipe</button>}
            </form>
        </div>
    );
};

const IngredientGroup = ({
                             ingredientId, standard, ingredientName, onRemove, unit, section, ParentRecipeIngredients
                         }) => {

    const [currentStandard, setCurrentStandard] = useState(standard || 0);  // 값이 없으면 0으로 설정
    const [ingredient, setIngredient] = useState(null);

    const {recipeIngredients, setRecipeIngredients} = useContext(RecipeContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ingredientData = await getIngredientById(ingredientId);
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
    const {totalIngredients, setTotalIngredients} = React.useContext(MainContext);

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

        // Update the quantity in recipeIngredients, checking both ingredientId and section
        const updatedIngredients = recipeIngredients.map((ing) =>
            ing.ingredientId === ingredientId && ing.section === section
                ? {...ing, quantity: newQuantity}
                : ing
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

        // console.log("ingredientGroup // ingredientId : " + ingredientId + "Section : " + section)
        //
        // totalIngredients.forEach((ingredient) => {
        //     console.log("totalIngredients // ingredientId : " + ingredient.id + " Section : " + ingredient.section);
        // });

        setTotalIngredients((prevIngredients) =>
            prevIngredients.filter((ing) =>
                !(ing.id === ingredientId && ing.section === section)
            )
        );

        const newIngredient = {
            // name: ingredient.name,
            section : section,
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
