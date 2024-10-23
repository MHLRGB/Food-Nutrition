import React, { useState, useEffect } from "react";
import './css/AI_Search.css';
import Header from "./Header";
import ai_icon from "./image/ai_search_button.png";
import axios from "axios";

const getAIRecipes = async (input) => {
    const response = await axios.post('/api/recommend-recipes',
        JSON.stringify({ input }),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data;
};

const AI_Search = () => {
    return (
        <div className='document'>
            <Header />
            <Body />
        </div>
    );
};

const Body = () => {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const [elapsedTime, setElapsedTime] = useState(0); // 경과 시간 상태 추가

    useEffect(() => {
        let timer;
        if (loading) {
            // 로딩 중일 때 경과 시간을 업데이트하는 타이머 설정
            timer = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000); // 1초마다 업데이트
        } else {
            // 로딩이 끝나면 타이머 정리
            setElapsedTime(0);
        }

        return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, [loading]);

    const handleButtonClick = async () => {
        try {
            setLoading(true); // API 호출 시작 시 로딩 상태 설정
            const fetchedRecipes = await getAIRecipes(inputValue);
            setRecipes(fetchedRecipes);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setLoading(false); // API 호출 완료 후 로딩 상태 해제
        }
    };

    const handleRecipeClick = (recipeId) => {
        setSelectedRecipeId(recipeId);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const selectedRecipe = recipes.find(recipe => recipe.레시피_번호 === selectedRecipeId);

    return (
        <div className='ai_search_body'>
            <div className='ai_search_group'>
                <div className="ai_search_input_box">
                    <input
                        className="ai_search_input"
                        type="text"
                        placeholder="Question Here!"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="ai_search_button" onClick={handleButtonClick}>
                    <img className="ai_search-button_img" src={ai_icon} alt="AI" />
                </div>
            </div>
            <div className='ai_search_result_box'>
                {loading ? ( // 로딩 상태에 따라 메시지 또는 스피너 표시
                    <div className='loading'>
                        로딩 중... {elapsedTime}초
                    </div>
                ) : (
                    <>
                        {recipes.map((recipe) => (
                            <div
                                key={recipe.레시피_번호}
                                className="recipe_item_box"
                                onClick={() => handleRecipeClick(recipe.레시피_번호)}
                            >
                                <div className='recipe_item_name'>{recipe.레시피_제목}</div>
                            </div>
                        ))}
                        {selectedRecipe ? (
                            <div className='ai_search_result_detail'>
                                <div className='ai_search_result_detail_category'>제목: {selectedRecipe.레시피_제목}</div>
                                <div className='ai_search_result_detail_category'>소개: {selectedRecipe.조리_소개}</div>
                                <div className='ai_search_result_detail_category'>재료: {selectedRecipe.조리_재료_내용}</div>
                            </div>
                        ) : null}
                    </>
                )}
            </div>
        </div>
    );
}

export default AI_Search;
