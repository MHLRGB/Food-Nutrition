import React, { useEffect, useState, createContext } from 'react';
import '../css/Community_Board.css';
import axios from 'axios';
import Header from '../../Header';
import {Link, useNavigate} from "react-router-dom";
import RecipeTitleList from "../Title_list";
import TitleList from "../Title_list";

const Community_list = ({category}) => {
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
                <h2 className="recipe_list_title">사용자 레시피 목록</h2>
                <div className="recipe_go_write_button" onClick={() => window.location.href = "recipe/write"}>레시피 글쓰기
                </div>
                <TitleList category="recipe"/>

            </div>
        </div>
    );
};

export default Community_list;