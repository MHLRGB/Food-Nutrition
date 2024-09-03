import React from 'react';
import '../css/Community_Board.css';
import Header from '../../Header';
import { RecipeProvider } from '../RecipeContext';
import Recipe_write_form from './Recipe_write_form';
import { useContext } from 'react';
import { RecipeContext } from '../RecipeContext';

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
    const { recipeTitle, recipeCategory, recipeIngredients } = useContext(RecipeContext);

    return (
        <div className='community_board_body_container'>
            <div className='community_board_body_center'>
                <div>
                    <h2>Current Recipe Information</h2>
                    <p>Title: {recipeTitle}</p>
                    <p>Category: {recipeCategory}</p>
                    <h3>Ingredients:</h3>
                    <ul>
                        {recipeIngredients.map((ingredient, index) => (
                            <li key={index}>
                                ID: {ingredient.ingredientId}, Quantity: {ingredient.quantity}
                            </li>
                        ))}
                    </ul>
                </div>
                <Recipe_write_form />
            </div>
        </div>
    );
};

export default Recipe_write;
