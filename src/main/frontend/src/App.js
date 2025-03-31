import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './Login.js';
import Join from './Join.js';
import Test from './test.js';
import Admin from './Adimn.js';
import Main from './main/Main.js';
import Common from './common.js';
import Community from "./community/Community.js";
import MyPage from "./MyPage";
import Community_board_list from "./community/board/Community_board_list";
import Community_info_tips from "./community/Community_info_tips";
import Community_recipe_detail from "./community/recipe/Recipe_detail";
import Recipe_write from "./community/recipe/Recipe_write";
import Recipe_update from "./community/recipe/Recipe_update";
import Community_board_write from "./community/board/Community_board_write";
import Recipe_detail from "./community/recipe/Recipe_detail";
import Recipe_list from "./community/recipe/Recipe_list";
import Community_board_detail from "./community/board/Community_board_detail";
import Community_update from "./community/board/Community_board_update";
import AI_Search from "./AI_Search";
import Search from "./Search";
import MyRecipe from "./main/MyRecipe";
import SelectCategory from "./main/SelectCategory"; // Search 컴포넌트 임포트 추가

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
                <Route path="/test" element={<Test />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/common" element={<Common />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/myrecipe" element={<MyRecipe />} />
                <Route path="/selectcategory" element={<SelectCategory />} />
                <Route path="/aisearch" element={<AI_Search />} />
                <Route path="/search" element={<Search />} /> {/* 여기에 /search 경로 추가 */}

                <Route path="/community" element={<Community />} />

                <Route path="/recipe/write" element={<Recipe_write />} />
                <Route path="/recipe" element={<Recipe_list />} />
                <Route path="/recipe/:id" element={<Recipe_detail />} />
                <Route path="/recipe/update/:id" element={<Recipe_update />} />

                <Route path="/community/board" element={<Community_board_list />} />
                <Route path="/community/board/:id" element={<Community_board_detail />} />
                <Route path="/community/board/write" element={<Community_board_write />} />
                <Route path="/community/board/update/:id" element={<Community_update />} />

                <Route path="/community/info_tips" element={<Community_info_tips />} />
                <Route path="/" element={<Main />} />
            </Routes>
        </div>
    );
};

export default App;
