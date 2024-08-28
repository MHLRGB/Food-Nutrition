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
    const images = [
        { src: image1, recipes: ['불고기','팬케이크', '김치찌개', '잡채', '된장찌개'] },
        { src: image2, recipes: ['마르게리타 피자', '미소 된장국', '타코', '불고기', '초밥', '티라미수'] },
        { src: image3, recipes: ['비빔밥', '시저 샐러드', '케이크', '갈릭 브레드', '스테이크'] }
    ];

    const [sliderIndex, setSliderIndex] = useState(0);
    const [recipeIndex, setRecipeIndex] = useState(images[0].recipes[0]);
    const {totalIngredients, setTotalIngredients} = useContext(MainContext);

    // setTotalIngredients(prevIngredients =>
    //     prevIngredients.filter(ingredient => ingredient.name !== name)
    // );

    const prevSlide = () => {
        const newIndex = sliderIndex === 0 ? images.length - 1 : sliderIndex - 1;
        setSliderIndex(newIndex);
        setRecipeIndex(images[newIndex].recipes[0]);
        setTotalIngredients([]);
    };

    const nextSlide = () => {
        const newIndex = sliderIndex === images.length - 1 ? 0 : sliderIndex + 1;
        setSliderIndex(newIndex);
        setRecipeIndex(images[newIndex].recipes[0]);
        setTotalIngredients([]);
    };

    const handleRecipeClick = (recipe) => {
        setRecipeIndex(recipe);
        setTotalIngredients([]);
    };

    return (
        <div className='main_body_container'>
            <div className='body_left'>
                <div className='body_left_top'>
                    {images[sliderIndex].recipes.map((recipe, index) => (
                        <button className='body_left_top_button' key={index} onClick={() => handleRecipeClick(recipe)}>
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
                            <img src={images[sliderIndex].src} alt={`Slide ${sliderIndex}`}/>
                        </div>
                        <button onClick={nextSlide} className='right-arrow'>
                            →
                        </button>
                    </div>
                </div>
                <div className='body_center_bottom'>
                    <RecipeIngredientsBox recipeId={10}/>
                </div>
            </div>
            <div className='body_right'>
                <StickyBanner/>
            </div>
        </div>
    );
};




export default Main;