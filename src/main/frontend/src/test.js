import React, { useState, useContext } from 'react';
import { createContext } from 'react';
import { Route, Routes } from 'react-router-dom';
//import axiosInstance from "/axiosInstance";
import './css/Test.css';
import Header from "./Header";

const Test = () => {
    return (
        <div className='document'>
            <Header/>
            <Body/>
        </div>
    );
};
function Body() {
    return (
        <div className='test_body_container'>
            <div className='body_left'>
                <div className='body_left_top'>
                </div>
            </div>
            <div className='main_body_center'>
                <div className='body_center_top'>
                    <div className='slider'>

                    </div>
                </div>
                <div className='body_center_bottom'>

                </div>
            </div>
            <div className='body_right'>
            </div>
        </div>
    );
}


export default Test;

