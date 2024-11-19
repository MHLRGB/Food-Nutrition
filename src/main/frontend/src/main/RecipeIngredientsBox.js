import React, {useContext, useEffect, useRef, useState} from "react";
import {MainContext} from "./MainContext";
import recipeImg from "../image/recipe.png";
import {bringRecipe, getIngredientById, getRecipeById, searchIngredients, updateRecipe} from "../apis/Recipe_api";
import {nowUserInfo} from "../apis/User_api";
import {RecipeContext} from "../community/RecipeContext";

const RecipeIngredientsBox = ({recipeId}) => {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [getRecipe, setGetRecipe] = useState(null);

    const [newSection, setNewSection] = useState("");

    // 실질적인 섹션 저장 내용. 섹션 이름,
    const [sections, setSections] = useState([]);
    const [error, setError] = useState(null);
    const [userdata, setUserdata] = useState('');
    const {
        recipe,
        setRecipe,
        recipeIngredients,
        setRecipeIngredients,
    } = useContext(RecipeContext);

    const { totalIngredients, setTotalIngredients } = React.useContext(MainContext);

    const [renderedIngredients, setRenderedIngredients] = useState([]);

    const [showDetails, setShowDetails] = useState(false);

    const debounceTimeoutRef = useRef(null); // 디바운스 타이머를 관리할 ref

    const toggleDetails = () => {
        setShowDetails(prevShowDetails => !prevShowDetails);
    };

    const handleNavRecipe = (id) => {
        window.location.href = `/recipe/update/${id}`;
    };

    const handleBringRecipe = async (event) => {
        event.preventDefault();

        try {
            const response = await bringRecipe(recipe, recipeIngredients);  // prop으로 받은 recipeId 사용
            console.log('Success:', response);
        } catch (error) {
            setError('Failed to update recipe. Please try again.');
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (recipeId !== null) {
            fetchData();
            // recipeIngredients.forEach((ingredient) => {
            //     console.log(ingredient);
            // });
        }

    }, [recipeId, setRecipeIngredients]);  // recipeId가 변경될 때마다 실행


    const fetchData = async () => {
        try {
            // Fetch recipe data
            const recipeData = await getRecipeById(recipeId);
            setGetRecipe(recipeData);
            setRecipe({
                recipeTitle: recipeData.recipeTitle,
                recipeInfo: recipeData.recipeInfo,
                cookingTime: recipeData.cookingTime,
                chef : recipeData.chef,
                difficulty: recipeData.difficulty,
                serving : recipeData.serving,
                hashtag: recipeData.hashtag,
                byType: recipeData.byType,
                bySituation: recipeData.bySituation,
                byIngredient: recipeData.byIngredient,
                byMethod: recipeData.byMethod,
            });

            setRecipeIngredients([]);

            const ingredients = recipeData.ingredientsInfo || [];
            // setRecipeIngredients(ingredients);  // recipeIngredients에 설정
            let ingredientOrder = 1;
            const updatedIngredients = ingredients.map((ingredient, index) => ({
                ...ingredient,  // 기존 ingredient 데이터를 그대로 복사
                defaultUnit : ingredient.unit,
                ingredientOrder: index + 1  // 1부터 시작하는 순차적 증가
            }));

            setRecipeIngredients(updatedIngredients)
            let order = 1;  // ingredientOrder 초기값 설정


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


    // 접속죽인 유저 정보 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await nowUserInfo();
                setUserdata(response)
            } catch (error) {
                console.log("Error : "+error);
            }
        };

        fetchData();
    }, []);

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
        const ingredientsBySection = {};

        sections.forEach((section) => {
            const sectionIngredients = recipeIngredients.filter(
                (ingredient) => ingredient.section === section.name
            );

            if (sectionIngredients.length > 0) {
                ingredientsBySection[section.name] = sectionIngredients.map((ingredient) => (
                    <>
                        <IngredientGroup
                            key={ingredient.ingredientId}
                            ingredientId={ingredient.ingredientId}
                            standard={ingredient.quantity}
                            unit={ingredient.unit}
                            defaultUnit={ingredient.defaultUnit}
                            section={ingredient.section}
                            ingredientName={ingredient.ingredientName}
                            onRemove={() => handleRemoveIngredient(ingredient.ingredientId, ingredient.section, ingredient.ingredientOrder)}
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

    // 재료 추가 함수
    const handleAddIngredient = (ingredientId, ingredientName, sectionName) => {
        // if (!recipeIngredients.some(ingredient => ingredient.ingredientId === ingredientId)) {
        //     setRecipeIngredients([...recipeIngredients, { ingredientId, quantity: 100, foodName, unit: "unittest", section }]);
        // }

        // 다른 재료 Section에 같은 재료가 있을 수 있으니 같은 재료 삽입 허용
        setRecipeIngredients([...recipeIngredients, { ingredientId, ingredientName:ingredientName, quantity: 100, unit: "g", section: sectionName}]);

        const sectionIndex = sections.findIndex(sec => sec.name === sectionName);
        if (sectionIndex !== -1) {
            const updatedSections = [...sections];
            updatedSections[sectionIndex].searchKeyword = "";
            updatedSections[sectionIndex].searchResults = [];
            setSections(updatedSections);
        }
    };

    // 10/01
    const handleRemoveIngredient = (ingredientIdToRemove, ingredientSectionToRemove, ingredientOrderToRemove) => {
        console.log("handleRemoveIngredient() 함수 호출");

        // recipeIngredients에서 해당 ingredientId를 제외한 새 배열을 생성
        //const updatedIngredients = recipeIngredients.filter(ingredient => ingredient.ingredientId !== ingredientIdToRemove);
        const updatedIngredients = recipeIngredients.filter(ingredient =>
            !(ingredient.ingredientId === ingredientIdToRemove && ingredient.section === ingredientSectionToRemove && ingredient.ingredientOrder === ingredientOrderToRemove)
        );
        // 상태 업데이트 (recipeIngredients)
        setRecipeIngredients(updatedIngredients);

        // totalIngredients에서 해당 ingredientId를 가진 재료의 영양소 정보 제거
        setTotalIngredients((prevIngredients) =>
            prevIngredients.filter(
                ingredient => !(ingredient.id === ingredientIdToRemove && ingredient.section === ingredientSectionToRemove && ingredient.ingredientOrder === ingredientOrderToRemove)
            )
        );

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

    if (recipeId == null) {
        return <div>등록된 레시피가 없습니다.</div>;
    }

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!getRecipe) {
        return <div>레시피를 찾을 수 없습니다.</div>;
    }

    return (
        <div className='recipe_container'>
            <div className="recipe_top_edit_group">
                {(userdata.username === recipe.chef || userdata.username === "admin") && (
                    <div className="recipe_top_edit_button" onClick={() => handleNavRecipe(getRecipe.recipeId)}>수정</div>
                )}
                {userdata.username !== recipe.chef && (
                    <div className="recipe_top_bring_button" onClick={(e) => handleBringRecipe(e)}>
                        내 레시피에 저장
                    </div>
                )}
            </div>

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
                                    <td className="recipe_detail_content_tr">{recipe.serving}</td>
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
                                <br/>
                                <p className="recipe_detail_content">
                                    {recipe.hashtag.replace(/[\[\]'"]/g, '').split(',').map(tag => `#${tag.trim()}`).join(', ')}
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>


            {sections.map((section, index) => (
                <div key={section.name}>
                    <div className="section_group">
                        <div className="section_title">
                            {section.name}
                            <button className="delete_section_button" type="button"
                                    onClick={() => handleRemoveSection(section.name)}>삭제
                            </button>
                        </div>
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
                                                onMouseDown={() => handleAddIngredient(ingredient.ingredientId, ingredient.ingredientName, section.name)}>
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
            <div className="recipe_bottom"/>
        </div>
    );
}
const IngredientGroup = ({
                             ingredientId, standard, ingredientName, onRemove, unit, defaultUnit, section, ParentRecipeIngredients
                         }) => {
    const [currentStandard, setCurrentStandard] = useState(standard || 0); // 기본값 0 설정
    const [ingredient, setIngredient] = useState(null);
    const [currentUnit, setCurrentUnit] = useState(unit);
    const [ingredientUnitGroup, setIngredientUnitGroup] = useState("기본");

    const {recipeIngredients, setRecipeIngredients} = useContext(RecipeContext);

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
    const {totalIngredients, setTotalIngredients} = React.useContext(MainContext);

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
            calculateTotalIngredient()
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

        }
    }, [ingredient, ParentRecipeIngredients]);

    useEffect(() => {
        if(ingredient) {
            calculateTotalIngredient();
        }
    },[currentStandard, ingredient, currentUnit]);

    const handleStandardChange = (e) => {
        console.log("handleStandardChange 호출됨..................")
        const inputValue = e.target.value;

        // 숫자와 소수점만 허용하는 정규식을 이용해 입력값 검증
        if (/^\d*\.?\d*$/.test(inputValue)) {
            setCurrentStandard(inputValue);

            const updatedIngredients = recipeIngredients.map((ing) =>
                ing.ingredientId === ingredientId && ing.section === section
                    ? {...ing, quantity: inputValue}
                    : ing
            );

            setRecipeIngredients(updatedIngredients);
        }
    };

    const handleUnitChange = (e) => {
        e.preventDefault(e);
        const selectedUnit = e.target.value;
        setCurrentUnit(selectedUnit);
        const updatedIngredients = recipeIngredients.map((ing) =>
            ing.ingredientId === ingredientId && ing.section === section && ing.unit !== selectedUnit
                ? { ...ing, unit: selectedUnit }
                : ing
        );

        setRecipeIngredients(updatedIngredients);
        // 드롭다운에서 선택된 값을 currentUnit 상태에 반영
    };

    const handleIncrement = (e) => {
        e.preventDefault();

        const incrementValue = 1.0; // 증가할 값

        setCurrentStandard((prev) => {
            const newValue = parseFloat(prev) + incrementValue;
            const roundedValue = parseFloat(newValue.toFixed(1)); // 소수점 한 자릿수로 반올림

            const updatedIngredients = recipeIngredients.map((ing) =>
                ing.ingredientId === ingredientId ? { ...ing, quantity: roundedValue} : ing
            );
            setRecipeIngredients(updatedIngredients);

            return roundedValue;
        });
    };

    const handleDecrement = (e) => {
        e.preventDefault();

        const decrementAmount = 1.0; // 감소할 값

        setCurrentStandard((prev) => {
            const newValue = Math.max(0, parseFloat(prev) - decrementAmount); // 감소 계산
            const roundedValue = parseFloat(newValue.toFixed(1)); // 소수점 한 자릿수로 반올림

            const updatedIngredients = recipeIngredients.map((ing) =>
                ing.ingredientId === ingredientId ? { ...ing, quantity: roundedValue} : ing
            );
            setRecipeIngredients(updatedIngredients);
            return roundedValue;
        });
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
            unit: currentUnit,
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
                        <div className="ingredient_title_button_group">
                            <div className="ingredient_title_text_input">
                                {ingredient.ingredientName === "Unknown Ingredient" ? ingredientName : ingredient.ingredientName}
                            </div>
                            <button className="ingredient_delete_buton" type="button" onClick={() => {
                                onRemove();
                            }}>삭제
                            </button>
                        </div>
                        <div className="ingredient_standard_input_group">
                            {/*{Object.keys(unitConversions).includes(currentUnit) && (*/}
                            {((currentStandard > 0 || Object.keys(unitConversions).includes(currentUnit)) &&
                                <>
                                    <div className="quantity_control">
                                        <button className="quantity_control_button" onClick={handleIncrement}>+</button>
                                        <button className="quantity_control_button" onClick={handleDecrement}>-</button>
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
                                    {/*<option className="ingredient_unit_dropdown_option"*/}
                                    {/*        value={currentUnit}>{currentUnit}</option>*/}

                                    {(currentUnit !== defaultUnit) && (defaultUnit !== "" ) && (
                                        <option className="ingredient_unit_dropdown_option" value={defaultUnit}>
                                            {defaultUnit}
                                        </option>
                                    )}

                                    {/*/!* currentUnit과 동일하지 않은 unit이 있을 경우 드롭다운에 추가 *!/*/}
                                    {/*{currentUnit !== unit && unit !== 'g' &&*/}
                                    {/*    <option className="ingredient_unit_dropdown_option"*/}
                                    {/*            value={unit}>{unit}</option>}*/}

                                    {/* 'g'가 currentUnit으로 선택되어 있을 때는 g 외의 다른 단위를 추가 */}
                                    {currentUnit !== 'g' &&
                                        <option className="ingredient_unit_dropdown_option" value="g">g</option>}
                                    {ingredientUnitGroup === "액체 및 조미료류" ? (
                                        <>
                                            {currentUnit !== 'l' &&
                                                <option className="ingredient_unit_dropdown_option"
                                                        value="l">l</option>}
                                            {currentUnit !== 'ml' &&
                                                <option className="ingredient_unit_dropdown_option"
                                                        value="ml">ml</option>}
                                            {currentUnit !== '숟가락' &&
                                                <option className="ingredient_unit_dropdown_option"
                                                        value="숟가락">숟가락</option>}
                                            {currentUnit !== 'tsp' &&
                                                <option className="ingredient_unit_dropdown_option"
                                                        value="tsp">tsp</option>}
                                            {currentUnit !== 'tbsp' &&
                                                <option className="ingredient_unit_dropdown_option"
                                                        value="tbsp">tbsp</option>}
                                            {currentUnit !== '컵' &&
                                                <option className="ingredient_unit_dropdown_option"
                                                        value="컵">컵</option>}
                                        </>
                                    ) : ingredientUnitGroup === "고기류" ? (
                                        <>
                                            {currentUnit !== '근' &&
                                                <option className="ingredient_unit_dropdown_option"
                                                        value="근">근</option>}
                                            {currentUnit !== 'kg' &&
                                                <option className="ingredient_unit_dropdown_option"
                                                        value="kg">kg</option>}
                                        </>
                                    ) : ingredientUnitGroup === "견과류" ? (
                                        <>
                                            {currentUnit !== '줌' &&
                                                <option className="ingredient_unit_dropdown_option"
                                                        value="줌">줌</option>}
                                        </>
                                    ) : (
                                        <>
                                            {currentUnit !== 'kg' &&
                                                <option className="ingredient_unit_dropdown_option"
                                                        value="kg">kg</option>}
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
                    ) : currentStandard > 0 && Object.keys(unitConversions).includes(currentUnit)? (  // standard가 0보다 클 경우 영양성분을 보여줌
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