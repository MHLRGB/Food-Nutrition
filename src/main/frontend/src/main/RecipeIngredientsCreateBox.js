import React, { useContext, useEffect, useRef, useState } from "react";
import { createRecipe, getIngredientById, searchIngredients } from "../apis/Recipe_api";
import { RecipeContext } from "../community/RecipeContext";
import { MainContext } from "./MainContext";
import { useNavigate } from "react-router-dom";

const RecipeIngredientsCreateBox = ({ showEditButton }) => {
    const navigate = useNavigate();
    const {
        recipe,
        setRecipe,
        recipeIngredients,
        setRecipeIngredients
    } = useContext(RecipeContext);  // recipeIngredients와 setRecipeIngredients 사용

    const { totalIngredients, setTotalIngredients } = React.useContext(MainContext);

    const [error, setError] = useState(null);

    const [renderedIngredients, setRenderedIngredients] = useState([]);

    // 섹션 추가 / 수정을 위한 섹션 temp
    const [newSection, setNewSection] = useState("");

    // 실질적인 섹션 저장 내용. 섹션 이름,
    const [sections, setSections] = useState([{ name: "재료", searchKeyword: "", searchResults: [] }]);

    const debounceTimeoutRef = useRef(null); // 디바운스 타이머를 관리할 ref

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            [name]: value,
        }));
    };

    // 섹션 추가 함수
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

        console.log("인덱스 : " + index + " 키워드 : " + keyword);
        const newSections = [...sections];
        newSections[index].searchKeyword = keyword;

        setSections(newSections);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current); // 이전 타이머를 클리어
        }

            if (keyword.trim().length > 0) {
                try {
                    newSections[index].searchResults = await searchIngredients(keyword.trim());
                    setSections(newSections);

                    // 로깅
                    newSections[index].searchResults.forEach(ingredient => {
                        console.log("sections : " + ingredient.ingredientName);
                    });
                } catch (error) {
                    console.error("Error fetching search results:", error);
                }
            }
    };

    // 재료 입력창에서 커서를 잃을 때 검색 결과 초기화
    const handleBlur = (index) => {

        const updatedSections = [...sections];
        updatedSections[index].searchKeyword = "";
        updatedSections[index].searchResults = [];
        setSections(updatedSections);


        // const newSections = [...sections];
        // newSections[index].searchResults = [];
        // setSections(newSections);
    };

    useEffect(() => {
        setRecipeIngredients([]);
    }, [setRecipeIngredients]);

    useEffect(() => {
        console.log("recipeIngredients가 업데이트되었습니다:");
        recipeIngredients.forEach((ingredient) => {
            console.log(ingredient);
        });

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
                    <IngredientGroup
                        key={ingredient.ingredientId}
                        ingredientId={ingredient.ingredientId}
                        ingredientName={ingredient.ingredientName}
                        standard={ingredient.quantity}
                        unit={ingredient.unit}
                        section={ingredient.section}
                        onRemove={() => handleRemoveIngredient(ingredient.ingredientId, ingredient.section)}
                        ParentRecipeIngredients={recipeIngredients}
                    />
                ));
            } else {
                ingredientsBySection[section.name] = <p>레시피에 재료가 없습니다.</p>;
            }
        });

        setRenderedIngredients(ingredientsBySection);
    }, [recipeIngredients]); // sections 의존성 추가

    // 레시피 저장 함수
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await createRecipe(recipe, recipeIngredients);  // prop으로 받은 recipeId 사용
            navigate('/recipe');  // 성공 후 리다이렉트
            console.log('Success:', response);
        } catch (error) {
            setError('Failed to update recipe. Please try again.');
            console.error('Error:', error);
        }
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
        setTotalIngredients((prevIngredients) =>
            prevIngredients.filter(
                ingredient => !(ingredient.id === ingredientIdToRemove && ingredient.section === ingredientSectionToRemove)
            )
        );
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="recipe_container">
                <div className="recipeIngredients_form_detail_box">
                    <div className="recipeIngredients_form_title_value_group">
                        <div className="recipeIngredients_form_title">레시피 제목</div>
                        <input
                            type="text"
                            name="recipeTitle"
                            placeholder="Title"
                            className="recipeIngredients_form_title_input"
                            value={recipe.recipeTitle}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="recipeIngredients_form_title_value_group">
                        <div className="recipeIngredients_form_title">레시피 소개</div>
                        <input
                            type="text"
                            name="recipeInfo"
                            placeholder="Recipe Info"
                            className="recipeIngredients_form_info_input"
                            value={recipe.recipeInfo}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
                <div className="byGroup_input">
                    <select
                        name="byType"
                        className="recipeIngredients_select"
                        value={recipe.byType || "전체"}  // 기본 값 설정
                        onChange={handleInputChange}
                    >
                        <option value="전체">전체</option>
                        // "전체" 옵션 추가
                        <option value="밑반찬">밑반찬</option>
                        <option value="메인반찬">메인반찬</option>
                        <option value="국/탕">국/탕</option>
                        <option value="찌개">찌개</option>
                        <option value="디저트">디저트</option>
                        <option value="면/만두">면/만두</option>
                        <option value="밥/죽/떡">밥/죽/떡</option>
                        <option value="퓨전">퓨전</option>
                        <option value="김치/젓갈/장류">김치/젓갈/장류</option>
                        <option value="양념/소스/잼">양념/소스/잼</option>
                        <option value="양식">양식</option>
                        <option value="샐러드">샐러드</option>
                        <option value="스프">스프</option>
                        <option value="빵">빵</option>
                        <option value="과자">과자</option>
                        <option value="차/음료/술">차/음료/술</option>
                        <option value="기타">기타</option>
                    </select>

                    <select
                        name="bySituation"
                        className="recipeIngredients_select"
                        value={recipe.bySituation || "전체"}
                        onChange={handleInputChange}
                    >
                        <option value="전체">전체</option>
                        <option value="일상">일상</option>
                        <option value="초스피드">초스피드</option>
                        <option value="손님접대">손님접대</option>
                        <option value="술안주">술안주</option>
                        <option value="다이어트">다이어트</option>
                        <option value="도시락">도시락</option>
                        <option value="영양식간식">영양식간식</option>
                        <option value="야식">야식</option>
                        <option value="푸드스타일링">푸드스타일링</option>
                        <option value="해장">해장</option>
                        <option value="명절">명절</option>
                        <option value="이유식">이유식</option>
                        <option value="기타">기타</option>
                    </select>

                    <select
                        name="byIngredient"
                        className="recipeIngredients_select"
                        value={recipe.byIngredient || "전체"}
                        onChange={handleInputChange}
                    >
                        <option value="전체">전체</option>
                        <option value="소고기">소고기</option>
                        <option value="돼지고기">돼지고기</option>
                        <option value="닭고기">닭고기</option>
                        <option value="육류">육류</option>
                        <option value="채소류">채소류</option>
                        <option value="해물류">해물류</option>
                        <option value="달걀/유제품">달걀/유제품</option>
                        <option value="가공식품류">가공식품류</option>
                        <option value="쌀">쌀</option>
                        <option value="밀가루">밀가루</option>
                        <option value="건어물류">건어물류</option>
                        <option value="버섯류">버섯류</option>
                        <option value="과일류">과일류</option>
                        <option value="콩/견과류">콩/견과류</option>
                        <option value="곡류">곡류</option>
                        <option value="기타">기타</option>
                    </select>

                    <select
                        name="byMethod"
                        className="recipeIngredients_select"
                        value={recipe.byMethod || "전체"}
                        onChange={handleInputChange}
                    >
                        <option value="전체">전체</option>
                        <option value="볶음">볶음</option>
                        <option value="끓이기">끓이기</option>
                        <option value="부침">부침</option>
                        <option value="조림">조림</option>
                        <option value="무침">무침</option>
                        <option value="비빔">비빔</option>
                        <option value="찜">찜</option>
                        <option value="절임">절임</option>
                        <option value="튀김">튀김</option>
                        <option value="삶기">삶기</option>
                        <option value="굽기">굽기</option>
                        <option value="데치기">데치기</option>
                        <option value="회">회</option>
                        <option value="기타">기타</option>
                    </select>

                </div>

                <div className="section_add_box">
                    <div className="section_info_message">* 섹션별로 재료를 저장할 수 있습니다.</div>
                    <div className="section_add_group">
                        <input
                            className="section_add_input"
                            type="text"
                            placeholder="Section을 추가하세요."
                            value={newSection}
                            onChange={(e) => setNewSection(e.target.value)}
                        />
                        <button className="section_add_button" type="button" onClick={handleAddSection}>섹션 추가</button>
                    </div>
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
                {showEditButton && <button type="submit">Create Recipe</button>}
            </div>
        </form>
    )
        ;
                };

const IngredientGroup = ({
                ingredientId, standard, unit, section, ingredientName, onRemove, ParentRecipeIngredients
            }) => {

    const [currentStandard, setCurrentStandard] = useState(standard || 0);  // 값이 없으면 0으로 설정
    const [ingredient, setIngredient] = useState(null);

    const {recipeIngredients, setRecipeIngredients} = useContext(RecipeContext);

    const [currentUnit, setCurrentUnit] = useState(unit);
    const [ingredientUnitGroup, setIngredientUnitGroup] = useState("기본");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ingredientData = await getIngredientById(ingredientId);
                setIngredient({
                    ingredientName: ingredientData.ingredientName,
                    ingredientGroup : ingredientData.ingredientGroup,
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


            updateTotalIngredient();
        }
    }, [currentStandard, ingredient, ParentRecipeIngredients, currentUnit]);

    useEffect(() => {
        const updatedIngredients = recipeIngredients.map((ing) =>
            ing.ingredientId === ingredientId ? { ...ing, unit:currentUnit } : ing
        );
        setRecipeIngredients(updatedIngredients);

    },[currentUnit]);

    const handleStandardChange = (e) => {

        const inputValue = e.target.value;

        // 숫자와 소수점만 허용하는 정규식을 이용해 입력값 검증
        if (/^\d*\.?\d*$/.test(inputValue)) {
            setCurrentStandard(inputValue);

            // `inputValue`가 비어있을 때는 0으로 초기화하거나 `parseFloat`로 처리하여 소수점 값으로 변환
            const newQuantity = parseFloat(inputValue) || 0;

            // // totalIngredients 업데이트 로직
            // setTotalIngredients((prevIngredients) => {
            //     return prevIngredients.map((ing) =>
            //         ing.id === ingredientId && ing.section === section
            //             ? { ...ing, quantity: newQuantity }
            //             : ing
            //     );
            // });
            const updatedIngredients = recipeIngredients.map((ing) =>
                ing.ingredientId === ingredientId ? { ...ing, quantity: newQuantity, unit:currentUnit } : ing
            );
            setRecipeIngredients(updatedIngredients);

        }
    };

    const handleIncrement = (e) => {
        e.preventDefault();
        setCurrentStandard((prev) => {
            const newValue = parseFloat(prev) + 1.0;
            return parseFloat(newValue.toFixed(1)); // 소수점 한 자릿수로 반올림
        });
    };

    const handleDecrement = (e) => {
        e.preventDefault();
        setCurrentStandard((prev) => {
            const newValue = Math.max(0, parseFloat(prev) - 1.0);
            return parseFloat(newValue.toFixed(1)); // 소수점 한 자릿수로 반올림
        });
    };

    const handleUnitChange = (e) => {
        e.preventDefault(e);
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

    const updateTotalIngredient = () => {
        console.log("updateNumberTotalIngredient() 호출됨");

        const validStandard = currentStandard || 0;  // 값이 없으면 0으로 설정

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

        setTotalIngredients((prevIngredients) =>
            prevIngredients.filter((ing) =>
                !(ing.id === ingredientId && ing.section === section) // 조건 변경
            )
        );

        const newIngredient = {
            // name: ingredient.name,
            section: section,
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

export default RecipeIngredientsCreateBox;
