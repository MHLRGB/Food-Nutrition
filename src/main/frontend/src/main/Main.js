import React, {useEffect, useState, createContext, useContext} from 'react';
import {Link, useLocation} from 'react-router-dom';
import '../css/Main.css';
import '../css/App.css';
import axios from 'axios';
import '../css/imageSlider.css';

import image1 from '../image/main/slide-1.png';
import image2 from '../image/main/slide-2.png';
import image3 from '../image/main/slide-3.png';
import image4 from '../image/main/slide-4.png';
import image5 from '../image/main/slide-5.png';

import arrow_back_icon from '../image/main/arrow_back_icon.png';
import arrow_forward_icon from '../image/main/arrow_forward_icon.png';
import recipe_title_icon from '../image/main/recipe_title_icon.png';

import Header from '../Header';
import {MainContext, MainProvider} from "./MainContext";
import StickyBanner from "./StickyBanner";
import RecipeIngredientsBox from "./RecipeIngredientsBox";
import search_icon from "../image/header/search_icon.png";
import {getAllCommunities} from "../apis/Community_api";
import {getAllMyRecipes, getAllRecipes} from "../apis/Recipe_api";
import {RecipeProvider} from "../community/RecipeContext";
import {nowUserInfo} from "../apis/User_api";


const Main = () => {
    return (
        <div className='document'>
            <MainProvider>
                <RecipeProvider>
                    <Header/>
                    <Body/>
                </RecipeProvider>
            </MainProvider>
        </div>
    );
};

const Body = () => {
    const recommendedRecipe = [
        { src: image1, recipeId: [6938162, 690962, 941793, 1548704, 1598204] },
        { src: image4, recipeId: [6952124, 997034, 1000318, 1010009, 1059789] },
        { src: image5, recipeId: [6902936, 821115, 853209, 903120, 1023712] }
    ];

    const [sliderIndex, setSliderIndex] = useState(0);
    const [recipeIndex, setRecipeIndex] = useState(recommendedRecipe[0].recipeId[0]);
    const [recipeTitle, setRecipeTitle] = useState([]);

    const [titles, setTitles] = useState([]);

    const { totalIngredients, setTotalIngredients } = useContext(MainContext);
    const [userdata, setUserdata] = useState('');


    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const recipe = await getAllRecipes();
                setRecipeTitle(recipe);

                console.log("recipeTitle:"+recipeTitle);
            } catch (error) {
                console.log("Error:"+error.message);
            }
        };
        fetchRecipes();
    }, [sliderIndex]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                let data = await getAllMyRecipes();
                setTitles(data);

            } catch (error) {
                console.log("Error : " + error);
            }
        };

        fetchRecipes();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // 레시피 데이터 가져오기
                const response = await nowUserInfo();
                setUserdata(response);

                // response에서 바로 isSetCat을 확인하여 이동
                if (response.isSetCat === 0) {
                    // 다른 페이지로 이동 (예: "/selectcategory")
                    window.location.href = '/selectcategory';
                }
            } catch (error) {
                console.log("Error : " + error);
            }
        };

        fetchData();
    }, []);

    // 이전 슬라이드로 이동
    const prevSlide = () => {
        const newIndex = sliderIndex === 0 ? recommendedRecipe.length - 1 : sliderIndex - 1;
        setSliderIndex(newIndex);
        setRecipeIndex(recommendedRecipe[newIndex].recipeId[0]);
        setTotalIngredients([]); // 재료 초기화
    };

    // 다음 슬라이드로 이동
    const nextSlide = () => {
        const newIndex = sliderIndex === recommendedRecipe.length - 1 ? 0 : sliderIndex + 1;
        setSliderIndex(newIndex);
        setRecipeIndex(recommendedRecipe[newIndex].recipeId[0]);
        setTotalIngredients([]); // 재료 초기화
    };

    // 레시피 클릭 시 해당 레시피로 이동
    const handleRecipeClick = (recipeId) => {
        setRecipeIndex(recipeId);
        setTotalIngredients([]); // 재료 초기화
    };

    const getTitleById = (id) => {
        const recipe = recipeTitle.find(recipe => recipe.id === id);
        return recipe ? recipe.recipe_title : 'Unknown Recipe';
    };

    return (
        <div className='main_body_container'>
            <div className='body_left'>
                <div className='body_left_top'>
                    {/* 현재 슬라이더에 표시된 레시피 버튼 생성 */}
                    {recommendedRecipe[sliderIndex].recipeId.map((recipe, index) => (
                        <div className="recipe_title_group"
                             key={index}
                             onClick={() => handleRecipeClick(recipe)}
                        >
                            <img className="recipe_title_icon" src={recipe_title_icon} alt="recipe_title_icon" />
                            <div className='body_left_top_button'>
                                {getTitleById(recipe)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='body_left_bottom'>
                    <Link className="body_left_MyRecipe" to="/myrecipe">
                        내 레시피
                    </Link>
                    {titles.slice(0, 5).map((title, index) => (
                        <div className="recipe_title_group"
                             key={index}
                        >
                            <img className="recipe_title_icon" src={recipe_title_icon} alt="recipe_title_icon"/>
                            <div className='body_left_top_button' key={index}
                                 onClick={() => handleRecipeClick(title.recipeId)}>
                                {title.recipeTitle}
                            </div>
                        </div>))}


                            {/*<div className="recipe_title_group"*/}
                            {/*     key={index}*/}
                            {/*     onClick={() => handleRecipeClick(recipe)}*/}
                            {/*>*/}
                            {/*    <img className="recipe_title_icon" src={recipe_title_icon} alt="recipe_title_icon"/>*/}
                            {/*    <div className='body_left_top_button'>*/}
                            {/*        {getTitleById(recipe)}*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                        </div>
                        </div>
                        <div className='main_body_center'>
                        <div className='body_center_top'>
                        <div className='slider'>
                        <button onClick={prevSlide} className='left-arrow'>
                            <img src={arrow_back_icon} alt="arrow_back" className="arrow_icon"/>
                        </button>
                        <img className='slider-image' src={recommendedRecipe[sliderIndex].src}
                             alt={`Slide ${sliderIndex}`}/>
                        <button onClick={nextSlide} className='right-arrow'>
                            <img src={arrow_forward_icon} alt="arrow_forward" className="arrow_icon"/>
                        </button>
                    </div>
                </div>
                <div className='body_center_bottom'>
                    {/* RecipeIngredientsBox에 선택된 recipeIndex 전달 */}
                    <RecipeIngredientsBox key={recipeIndex} recipeId={recipeIndex} />
                </div>
            </div>
            <div className='body_right'>
                <StickyBanner />
            </div>
        </div>
    );
};





export default Main;