import React, {useState, useEffect, useContext} from "react";
import './css/AI_Search.css';
import Header from "./Header";
import ai_icon from "./image/ai_search_button.png";
import axios from "axios";
import RecipeIngredientsBox from "./main/RecipeIngredientsBox";
import StickyBanner from "./main/StickyBanner";
import {MainContext, MainProvider} from "./main/MainContext";
import eggImage from './image/egg.png';
import burgerImage from './image/buger.png';
import knifeImage from './image/knife.png';
import soraImage from './image/sora.png';
import {RecipeContext, RecipeProvider} from "./community/RecipeContext";

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
            <MainProvider>
                <RecipeProvider>
                    <Header />
                    <Body />
                </RecipeProvider>
            </MainProvider>
        </div>
    );
};

const Body = () => {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const [elapsedTime, setElapsedTime] = useState(0); // 경과 시간 상태 추가
    const {
        recipe,
        setRecipe,
        recipeIngredients,
        setRecipeIngredients
    } = useContext(RecipeContext);

    const [animateResults, setAnimateResults] = useState(false); // 결과 애니메이션 상태 추가

    const { totalIngredients, setTotalIngredients } = React.useContext(MainContext);

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
            setLoading(true);
            setAnimateResults(false);// API 호출 시작 시 로딩 상태 설정
            const fetchedRecipes = await getAIRecipes(inputValue);
            setRecipes(fetchedRecipes);
            setAnimateResults(true);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setLoading(false); // API 호출 완료 후 로딩 상태 해제
        }
    };

    const handleRecipeClick = (recipeId) => {
        setTotalIngredients([]);
        setRecipe([]);
        setRecipeIngredients([]);
        setSelectedRecipeId(recipeId);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const selectedRecipe = recipes.find(recipe => recipe.recipe_number === selectedRecipeId);

    const floatingImages = [
        eggImage,
        burgerImage,
        knifeImage,
        soraImage,
    ];


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

            <div className='ai_search_result_container'>
                {/* 배경에 떠다니는 이미지들 */}
                {floatingImages.map((img, index) => (
                    <img
                        key={index}
                        className="floating-image"
                        src={img}
                        alt={`floating-${index}`}
                    />
                ))}

                <div className='ai_search_result_side'/>

                {/* Loading message and recipe title group moved outside of ai_search_result_box */}
                {loading && (
                    <div className='loading'>
                        로딩 중... {elapsedTime}초
                    </div>
                )}

                <div className="ai_recipe_title_after">
                    {!loading && (
                        <>
                        <div className="ai_recipe_title_group">
                            {recipes.map((recipe) => (
                                <div
                                    key={recipe.recipe_number}
                                    className="recipe_item_box"
                                    onClick={() => handleRecipeClick(recipe.recipe_number)}
                                >
                                    <div className='recipe_item_name'>{recipe.recipe_title}</div>
                                </div>
                            ))}
                        </div>

                        {selectedRecipe && (
                        <div className='ai_search_result_box'>
                            <>
                                <div className='ai_search_result_detail'>
                                    {/*아이디: {selectedRecipe.recipe_number}*/}
                                     <RecipeIngredientsBox key={selectedRecipe.recipe_number} recipeId={selectedRecipe.recipe_number} />
                                </div>
                            </>
                        </div>
                        )}
                    </>
                    )}
                </div>


                <div className='ai_search_result_side'>
                    {selectedRecipe && !loading && <StickyBanner />}
                </div>
            </div>
        </div>
    );
}

export default AI_Search;
