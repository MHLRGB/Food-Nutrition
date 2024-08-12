import React, {useEffect, useState} from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Login.js';
import Join from './Join.js';
import Test from './test.js';
import Admin from './Adimn.js';
import Main from './Main.js';
import Common from './common.js';
import Community from "./community/Community.js";
import MyPage from "./MyPage";
import Community_recipe from "./community/Community_recipe";
import Community_info_tips from "./community/Community_info_tips";


const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
                <Route path="/test" element={<Test />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/common" element={<Common />} />
                <Route path="/mypage" element={<MyPage />}/>
                <Route path="/community" element={<Community />}/>
                <Route path="/community/recipe" element={<Community_recipe />}/>
                <Route path="/community/info_tips" element={<Community_info_tips />}/>
                <Route path="/" element={<Main />}/>
            </Routes>
        </div>
    );
};

export default App;
