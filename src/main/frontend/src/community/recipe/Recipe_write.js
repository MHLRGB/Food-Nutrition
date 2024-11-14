import React from 'react';
import '../css/Community_Board.css';
import Header from '../../Header';
import { RecipeProvider } from '../RecipeContext';
import { useContext } from 'react';
import { RecipeContext } from '../RecipeContext';
import RecipeIngredientsCreateBox from "../../main/RecipeIngredientsCreateBox";
import {MainProvider} from "../../main/MainContext";
import StickyBanner from "../../main/StickyBanner";

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
    return (
        <MainProvider>
            <div className='community_board_body_container'>
                <div className='community_board_body_left'>

                </div>
                <div className='community_board_body_center'>
                    <div>
                        <RecipeIngredientsCreateBox showEditButton={true}/>
                    </div>

                </div>
                <div className='community_board_body_right'>
                    <StickyBanner />
                </div>
            </div>
        </MainProvider>
    );
};

export default Recipe_write;
