import React, { useContext, useEffect, useState } from 'react';
import '../css/Community_Board.css';
import { useNavigate } from 'react-router-dom';
import { getRecipeById, updateRecipe } from '../../apis/Recipe_api';
import { RecipeContext } from '../RecipeContext';

const Recipe_update_form = ({ recipeId }) => {  // recipeId를 prop으로 받음
    const navigate = useNavigate();
    const {
        recipeTitle,
        setRecipeTitle,
        recipeCategory,
        setRecipeCategory,
        recipeIngredients,
        setRecipeIngredients
    } = useContext(RecipeContext);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const recipeData = await getRecipeById(recipeId);
                setRecipeTitle(recipeData.title);
                setRecipeCategory(recipeData.category);
                setRecipeIngredients(recipeData.ingredients || []);  // 재료 목록 설정
                setLoading(false);
            } catch (error) {
                setError('Failed to load recipe. Please try again.');
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [recipeId, setRecipeTitle, setRecipeCategory, setRecipeIngredients]);

    const handleIngredientChange = (index, event) => {
        const newIngredients = [...recipeIngredients];
        newIngredients[index][event.target.name] = event.target.value;
        setRecipeIngredients(newIngredients);
    };

    const addIngredient = () => {
        setRecipeIngredients([...recipeIngredients, { ingredientId: '', quantity: '' }]);
    };

    const removeIngredient = (index) => {
        const newIngredients = recipeIngredients.filter((_, i) => i !== index);
        setRecipeIngredients(newIngredients);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await updateRecipe(recipeId, recipeTitle, recipeCategory, recipeIngredients);  // prop으로 받은 recipeId 사용
            navigate('/recipe');  // 성공 후 리다이렉트
            console.log('Success:', response);
        } catch (error) {
            setError('Failed to update recipe. Please try again.');
            console.error('Error:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='recipe_update_form'>
            <h3>레시피 수정 폼입니다.</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={recipeTitle}
                    onChange={(e) => setRecipeTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={recipeCategory}
                    onChange={(e) => setRecipeCategory(e.target.value)}
                    required
                />

                <div>
                    <h3>Ingredients</h3>
                    {recipeIngredients.map((ingredient, index) => (
                        <div key={index} className="ingredient-item">
                            <input
                                type="text"
                                name="ingredientId"
                                placeholder="Ingredient ID"
                                value={ingredient.ingredientInfo.ingredientsID}
                                onChange={(event) => handleIngredientChange(index, event)}
                                required
                            />
                            <input
                                type="number"
                                name="quantity"
                                placeholder="Quantity"
                                value={ingredient.quantity}
                                onChange={(event) => handleIngredientChange(index, event)}
                                required
                            />
                            <button type="button" onClick={() => removeIngredient(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addIngredient}>Add Ingredient</button>
                </div>

                <button type="submit">Update Recipe</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default Recipe_update_form;
