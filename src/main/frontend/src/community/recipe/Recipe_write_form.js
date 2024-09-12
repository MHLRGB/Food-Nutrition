// import React, { useContext, useState } from 'react';
// import '../css/Community_Board.css';
// import { useNavigate } from 'react-router-dom';
// import { createRecipe } from '../../apis/Recipe_api';
// import { RecipeContext } from '../RecipeContext';
//
// const Recipe_write_form = () => {
//     const navigate = useNavigate();
//     const {
//         recipeTitle,
//         setRecipeTitle,
//         recipeCategory,
//         setRecipeCategory,
//         recipeIngredients,
//         setRecipeIngredients
//     } = useContext(RecipeContext);
//
//     const [error, setError] = useState(null);
//
//     const handleIngredientChange = (index, event) => {
//         const newIngredients = [...recipeIngredients];
//         newIngredients[index][event.target.name] = event.target.value;
//         setRecipeIngredients(newIngredients);
//     };
//
//     const addIngredient = () => {
//         setRecipeIngredients([...recipeIngredients, { ingredientId: '', quantity: '' }]);
//     };
//
//     const removeIngredient = (index) => {
//         const newIngredients = recipeIngredients.filter((_, i) => i !== index);
//         setRecipeIngredients(newIngredients);
//     };
//
//     const handleSubmit = async (event) => {
//         event.preventDefault();
//
//         try {
//             const response = await createRecipe(recipeTitle, recipeCategory, recipeIngredients);
//             navigate('/recipe');
//             console.log('Success:', response);
//         } catch (error) {
//             setError('Failed to create recipe. Please try again.');
//             console.error('Error:', error);
//         }
//     };
//
//     return (
//         <div className='recipe_write_form'>
//             <h3>레시피 작성 폼입니다.</h3>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     placeholder="Title"
//                     value={recipeTitle}
//                     onChange={(e) => setRecipeTitle(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="text"
//                     placeholder="Category"
//                     value={recipeCategory}
//                     onChange={(e) => setRecipeCategory(e.target.value)}
//                     required
//                 />
//
//                 <div>
//                     <h3>Ingredients</h3>
//                     {recipeIngredients.map((ingredient, index) => (
//                         <div key={index} className="ingredient-item">
//                             <input
//                                 type="text"
//                                 name="ingredientId"
//                                 placeholder="Ingredient ID"
//                                 value={ingredient.ingredientId}
//                                 onChange={(event) => handleIngredientChange(index, event)}
//                                 required
//                             />
//                             <input
//                                 type="number"
//                                 name="quantity"
//                                 placeholder="Quantity"
//                                 value={ingredient.quantity}
//                                 onChange={(event) => handleIngredientChange(index, event)}
//                                 required
//                             />
//                             <button type="button" onClick={() => removeIngredient(index)}>Remove</button>
//                         </div>
//                     ))}
//                     <button type="button" onClick={addIngredient}>Add Ingredient</button>
//                 </div>
//
//                 <button type="submit">Create Recipe</button>
//                 {error && <p style={{ color: 'red' }}>{error}</p>}
//             </form>
//         </div>
//     );
// };
//
// export default Recipe_write_form;
