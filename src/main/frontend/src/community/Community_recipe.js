import React, { useEffect, useState, createContext } from 'react';
import './css/Community_Board.css';
import axios from 'axios';
import Header from '../Header';
import CommunityRecipeTitleList from "./Community_recipe_title_list";
import {Link, useNavigate} from "react-router-dom";

const Community_recipe = () => {
    return (
        <div className='document'>
            <Header/>
            <Body/>
        </div>
    );
};

const Body = () => {
    const navigate = useNavigate();

    return (
        <div className='community_board_body_container'>
                <div className='community_board_body_center'>
                    <h2>커뮤니티 레시피 목록</h2>
                    <CommunityRecipeTitleList />
                    <div onClick={() => window.location.href = "community/write"}>글쓰기</div>
                </div>
            </div>
    );
};

export default Community_recipe;