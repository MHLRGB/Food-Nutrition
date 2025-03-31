import React, {useEffect, useState, createContext, useContext} from 'react';
import { Link } from 'react-router-dom';
import '../css/Main.css';
import '../css/App.css';
import axios from 'axios';
import '../css/imageSlider.css';

import image1 from '../image/main/slide-1.png';
import image2 from '../image/main/slide-2.png';
import image3 from '../image/main/slide-3.png';
import arrow_back_icon from '../image/main/arrow_back_icon.png';
import arrow_forward_icon from '../image/main/arrow_forward_icon.png';
import recipe_title_icon from '../image/main/recipe_title_icon.png';

import Header from '../Header';
import {MainContext, MainProvider} from "./MainContext";
import StickyBanner from "./StickyBanner";
import RecipeIngredientsBox from "./RecipeIngredientsBox";
import search_icon from "../image/header/search_icon.png";
import {getAllCommunities} from "../apis/Community_api";
import {getAllRecipes} from "../apis/Recipe_api";
import {RecipeProvider} from "../community/RecipeContext";
import TitleList from "../community/Title_list";


const MyRecipe = () => {
    return (
        <div className='document'>
            <Header/>
            <Body/>
        </div>
    );
};

const Body = () => {

    return (
        <div className='community_board_body_container'>
            <div className='community_board_body_center'>
                <h2>내 레시피 목록</h2>
                <TitleList category="recipe" myrecipe='1'/>
                <div onClick={() => window.location.href = "recipe/write"}>레시피 글쓰기</div>
            </div>
        </div>
    );
};


export default MyRecipe;