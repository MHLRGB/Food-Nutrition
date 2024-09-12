import React, {useEffect, useState, createContext, useContext} from 'react';
import { Link } from 'react-router-dom';
import '../css/Main.css';
import axios from 'axios';
import '../css/imageSlider.css';

import image1 from '../image/slide-1.png';
import image2 from '../image/slide-2.png';
import image3 from '../image/slide-3.png';
import recipeImg from '../image/recipe.png';

import Header from '../Header';
import {MainContext, MainProvider} from "./MainContext";
import StickyBanner from "./StickyBanner";
import RecipeIngredientsBox from "./RecipeIngredientsBox";


const Main = () => {
    return (
        <div className='document'>
            <MainProvider>
                <Header/>
                <Body/>
            </MainProvider>
        </div>
    );
};
const Body = () => {
    const recommendedRecipe = [
        { src: image1, recipeId: [1, 2, 3, 4, 5] },   // 1~5
        { src: image2, recipeId: [6, 7, 8, 9, 10] },  // 6~10
        { src: image3, recipeId: [11, 12, 13, 14, 15] } // 11~15
    ];

    const [sliderIndex, setSliderIndex] = useState(0);
    const [recipeIndex, setRecipeIndex] = useState(recommendedRecipe[0].recipeId[0]);
    const { totalIngredients, setTotalIngredients } = useContext(MainContext);

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

    return (
        <div className='main_body_container'>
            <div className='body_left'>
                <div className='body_left_top'>
                    {/* 현재 슬라이더에 표시된 레시피 버튼 생성 */}
                    {recommendedRecipe[sliderIndex].recipeId.map((recipe, index) => (
                        <button
                            className='body_left_top_button'
                            key={index}
                            onClick={() => handleRecipeClick(recipe)}
                        >
                            {recipe}
                        </button>
                    ))}
                </div>
            </div>
            <div className='main_body_center'>
                <div className='body_center_top'>
                    <div className='slider'>
                        <button onClick={prevSlide} className='left-arrow'>
                            ←
                        </button>
                        <div className='slider-image'>
                            <img src={recommendedRecipe[sliderIndex].src} alt={`Slide ${sliderIndex}`} />
                        </div>
                        <button onClick={nextSlide} className='right-arrow'>
                            →
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