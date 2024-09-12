import React from 'react';
import '../css/Community_Board.css';
import Header from '../../Header';
import { RecipeProvider } from '../RecipeContext';
import Recipe_write_form from './Recipe_write_form';
import { useContext } from 'react';
import { RecipeContext } from '../RecipeContext';
import RecipeIngredientsCreateBox from "../../main/RecipeIngredientsCreateBox";
import {MainProvider} from "../../main/MainContext";

const Recipe_write = () => {
    return (
        <div className='document'>
            <RecipeProvider>
                <Header />
                <Body />
            </RecipeProvider>
        </div>
    );
};

const Body = () => {
    const { recipeTitle, recipeCategory, recipeIngredients } = useContext(RecipeContext);

    return (
        <MainProvider>
            <div className='community_board_body_container'>
                <div className='community_board_body_center'>
                    <div>
                        <RecipeIngredientsCreateBox showEditButton={true}/>
                    </div>

                </div>
            </div>
        </MainProvider>
    );
};

export default Recipe_write;
