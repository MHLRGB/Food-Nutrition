import React, {useEffect, useState} from "react";
import {MainContext} from "./MainContext";

const IngredientGroup = ({name, standard, calorie, sugar, sodium, protein, carbohydrate, fat}) => {

    const {totalIngredients, setTotalIngredients} = React.useContext(MainContext);
    const [currentStandard, setCurrentStandard] = useState(parseInt(standard));
    const [calorieAmount, setCalorieAmount] = useState(Math.round(calorie * parseInt(standard)));
    const [sugarAmount, setSugarAmount] = useState(Math.round(sugar * parseInt(standard)));
    const [sodiumAmount, setSodiumAmount] = useState(Math.round(sodium * parseInt(standard)));
    const [proteinAmount, setProteinAmount] = useState(Math.round(protein * parseInt(standard)));
    const [carbohydrateAmount, setCarbohydrateAmount] = useState(Math.round(carbohydrate * parseInt(standard)));
    const [fatAmount, setFatAmount] = useState(Math.round(fat * parseInt(standard)));

    const handleStandardChange = (e) => {
        setCurrentStandard(parseInt(e.target.value));
    };

    useEffect(() => {
        calculateTotalIngredient();
    }, [currentStandard]);

    const calculateTotalIngredient = () => {
        // Remove the previous ingredient entry for this ingredient
        setTotalIngredients(prevIngredients =>
            prevIngredients.filter(ingredient => ingredient.name !== name)
        );

        const newCalorieAmount = Math.round(calorie * (currentStandard/100));
        const newSugarAmount = Math.round(sugar * (currentStandard/100));
        const newSodiumAmount = Math.round(sodium * (currentStandard/100));
        const newProteinAmount = Math.round(protein * (currentStandard/100));
        const newCarbohydrateAmount = Math.round(carbohydrate * (currentStandard/100));
        const newFatAmount = Math.round(fat * (currentStandard/100));

        setCalorieAmount(newCalorieAmount);
        setSugarAmount(newSugarAmount);
        setSodiumAmount(newSodiumAmount);
        setProteinAmount(newProteinAmount);
        setCarbohydrateAmount(newCarbohydrateAmount);
        setFatAmount(newFatAmount);

        const ingredient = {
            name,
            calorie: newCalorieAmount,
            sugar: newSugarAmount,
            sodium: newSodiumAmount,
            protein: newProteinAmount,
            carbohydrate: newCarbohydrateAmount,
            fat: newFatAmount
        };

        // Add the new ingredient entry
        setTotalIngredients(prevIngredients => [...prevIngredients, ingredient]);
    };

    return (
        <div className='ingredient_group'>
            <div className='ingredient_title'>
                <div className='ingredient_title_text'>{name}</div>
                <input
                    type='number'
                    className='ingredient_standard_input'
                    value={currentStandard}
                    onChange={handleStandardChange}
                />
            </div>
            <div className='ingredient_info'>
                <div className='ingredient_info_detail'>
                    <div className='ingredient_info_detail_title'>칼로리</div>
                    <div className='ingredient_info_detail_content'>{calorieAmount}</div>
                </div>
                <div className='ingredient_info_detail'>
                    <div className='ingredient_info_detail_title'>당류</div>
                    <div className='ingredient_info_detail_content'>{sugarAmount}</div>
                </div>
                <div className='ingredient_info_detail'>
                    <div className='ingredient_info_detail_title'>나트륨</div>
                    <div className='ingredient_info_detail_content'>{sodiumAmount}</div>
                </div>
            </div>
            <div className='ingredient_info'>
                <div className='ingredient_info_detail'>
                    <div className='ingredient_info_detail_title'>단백질</div>
                    <div className='ingredient_info_detail_content'>{proteinAmount}</div>
                </div>
                <div className='ingredient_info_detail'>
                    <div className='ingredient_info_detail_title'>탄수화물</div>
                    <div className='ingredient_info_detail_content'>{carbohydrateAmount}</div>
                </div>
                <div className='ingredient_info_detail'>
                    <div className='ingredient_info_detail_title'>지방</div>
                    <div className='ingredient_info_detail_content'>{fatAmount}</div>
                </div>
            </div>
        </div>
    );
};

export default IngredientGroup;