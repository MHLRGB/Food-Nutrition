import React, { useState } from 'react';
import './css/Community_Board.css';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../apis/Community_api';

const Recipe_write = () => {
    return (
        <div className='document'>
            <Header />
            <Body />
        </div>
    );
};

const Body = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [ingredients, setIngredients] = useState([{ ingredientId: '', quantity: '' }]);
    const [error, setError] = useState(null);

    const handleIngredientChange = (index, event) => {
        const newIngredients = [...ingredients];
        newIngredients[index][event.target.name] = event.target.value;
        setIngredients(newIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { ingredientId: '', quantity: '' }]);
    };

    const removeIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Adjust this as per your API requirements
            const response = await createRecipe(title, content, category, ingredients);
            navigate('/community');
            console.log('Success:', response);
            // Form reset or additional actions if needed
        } catch (error) {
            setError('Failed to create community. Please try again.');
            console.error('Error:', error);
            // Error handling
        }
    };

    return (
        <div className='community_board_body_container'>
            <div className='community_board_body_center'>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />

                    <div>
                        <h3>Ingredients</h3>
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="ingredient-item">
                                <input
                                    type="text"
                                    name="ingredientId"
                                    placeholder="Ingredient ID"
                                    value={ingredient.ingredientId}
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

                    <button type="submit">Create Recipe</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Recipe_write;
