import React, { useState, useContext } from 'react';
import { createContext } from 'react';
import { Route, Routes } from 'react-router-dom';
//import axiosInstance from "/axiosInstance";

const Test = () => {

    return (
        <div>
            <h1>Main Component</h1>
            <Body/>
        </div>

    )
        ;
};
const IngredientContext = createContext();

function Body() {
    const [ingredientCount, setIngredientCount] = useState(0);

    return (
        <IngredientContext.Provider value={{ ingredientCount, setIngredientCount }}>
            <div>
                <h2>Body Component</h2>
                <RecipeDetails />
                <StickyBanner />
            </div>
        </IngredientContext.Provider>
    );
}

function StickyBanner() {
    const { ingredientCount } = useContext(IngredientContext);

    return (
        <div>
            <h3>Sticky Banner</h3>
            <p>Ingredient Count: {ingredientCount}</p>
        </div>
    );
}

function RecipeDetails() {
    return (
        <div>
            <h2>Recipe Details Component</h2>
            <IngredientGroup />
        </div>
    );
}

function IngredientGroup() {
    const { setIngredientCount } = useContext(IngredientContext);

    const updateIngredientCount = () => {
        // 임의의 정수 값 예시
        const newCount = 3;
        setIngredientCount(newCount);
    };

    return (
        <div>
            <h3>Ingredient Group Component</h3>
            <button onClick={updateIngredientCount}>Update Ingredient Count</button>
        </div>
    );
}

export default Test;

