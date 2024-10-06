import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {getRecipeById, updateRecipe} from "../../apis/Recipe_api";
import Header from "../../Header";
import {RecipeProvider} from "../RecipeContext"
import StickyBanner from "../../main/StickyBanner";
import {MainProvider} from "../../main/MainContext";
import RecipeIngredientsUpdateBox from "../../main/RecipeIngredientsUpdateBox";

const Recipe_update = () => {
    return (
        <div className='document'>
            <RecipeProvider>
                <Header />
                <Body />  {/* recipeId를 Body로 전달 */}
            </RecipeProvider>
        </div>
    );
};

const Body = ({ recipeId }) => {
    const { id } = useParams();// recipeId를 prop으로 받음
    return (
        <MainProvider>
            <RecipeProvider>
                <div className='community_board_body_container'>
                    <div className='community_board_body_left'>

                    </div>
                    <div className='community_board_body_center'>
                        <div>
                            <RecipeIngredientsUpdateBox recipeId={id} showEditButton={true}/>
                        </div>
                    </div>
                    <div className='community_board_body_right'>
                            <StickyBanner/>
                    </div>
                </div>
            </RecipeProvider>
        </MainProvider>
    );
};

export default Recipe_update;
