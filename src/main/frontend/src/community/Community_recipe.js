import React, { useEffect, useState, createContext } from 'react';
import '../css/Community_Board.css';
import axios from 'axios';
import Header from '../Header';
import CommunityRecipeTitleList from "./Community_recipe_title_list";

const Community_recipe = () => {
    return (
        <div>
            <Header/>
            <Body/>
        </div>
    );
};

const Body = () => {
    return (
            <div className='community_board_body_container'>
                <div className='body_blank_left' />
                <div className='community_board_body_center'>
                    레시피
                    <CommunityRecipeTitleList />
                </div>
                <div className='body_blank_right'/>
            </div>
    );
};

export default Community_recipe;