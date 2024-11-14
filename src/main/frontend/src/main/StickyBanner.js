import React, {createContext, useEffect, useState} from "react";
import CommunityRecipeTitleList from "../community/Title_list";
import {MainContext} from "./MainContext";

const StickyBanner = () => {
    const { totalIngredients } = React.useContext(MainContext);
    const totalCalorie = Math.floor(totalIngredients.reduce((acc, cur) => acc + cur.calorie, 0));
    const totalSugar = Math.floor(totalIngredients.reduce((acc, cur) => acc + cur.sugar, 0));
    const totalSodium = Math.floor(totalIngredients.reduce((acc, cur) => acc + cur.sodium, 0));
    const totalProtein = Math.floor(totalIngredients.reduce((acc, cur) => acc + cur.protein, 0));
    const totalCarbohydrate = Math.floor(totalIngredients.reduce((acc, cur) => acc + cur.carbohydrate, 0));
    const totalFat = Math.floor(totalIngredients.reduce((acc, cur) => acc + cur.fat, 0));

    return (
        <div className="total_nutri_stickey">
            <div className="total_text">총 영양성분</div>
            <div className="total_nutri_text_box">
                <div className="total_nutri_text_title">칼로리</div>
                <div className="total_nutri_text_value">{totalCalorie.toLocaleString()}kcal</div>
            </div>
            <div className="total_nutri_text_box">
                <div className="total_nutri_text_title">당류</div>
                <div className="total_nutri_text_value">{totalSugar.toLocaleString()}g</div>
            </div>
            <div className="total_nutri_text_box">
                <div className="total_nutri_text_title">나트륨</div>
                <div className="total_nutri_text_value">{totalSodium.toLocaleString()}mg</div>
            </div>
            <div className="total_nutri_text_box">
                <div className="total_nutri_text_title">단백질</div>
                <div className="total_nutri_text_value">{totalProtein.toLocaleString()}g</div>
            </div>
            <div className="total_nutri_text_box">
                <div className="total_nutri_text_title">탄수화물</div>
                <div className="total_nutri_text_value">{totalCarbohydrate.toLocaleString()}g</div>
            </div>
            <div className="total_nutri_text_box">
                <div className="total_nutri_text_title">지방</div>
                <div className="total_nutri_text_value">{totalFat.toLocaleString()}g</div>
            </div>
        </div>
    );
};

export default StickyBanner;