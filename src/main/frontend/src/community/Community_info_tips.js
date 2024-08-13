import React, { useEffect, useState, createContext } from 'react';
import './css/Community_Board.css';
import axios from 'axios';
import Header from '../Header';

const Community_info_tips = () => {
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
                    정보 및 팁
                </div>
                <div className='body_blank_right'/>
            </div>
    );
};

export default Community_info_tips;