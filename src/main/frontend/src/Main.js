import React, { useEffect, useState, createContext } from 'react';
import { Link } from 'react-router-dom';
import './css/Main.css';
import axios from 'axios';
import './css/imageSlider.css';

import image1 from './image/slide-1.png';
import image2 from './image/slide-2.png';
import image3 from './image/slide-3.png';
import foodImg from './image/food.png';
import recipeImg from './image/recipe.png';

import Header from './Header';


const IngredientContext = createContext();

const Main = () => {

    const [auth, setAuth] = useState('');

    useEffect(() => {
        axios.post('/login')
            .then((res) => {
                setAuth(res.data);
            })
    }, []);

    return (
        <div>
            <div>{auth}님 안녕하세요.</div>
            <Header/>
            <Body/>
        </div>
    );
};

const Body = () => {
    const images = [
        { src: image1, recipes: ['불고기','팬케이크', '김치찌개', '잡채', '된장찌개'] },
        { src: image2, recipes: ['마르게리타 피자', '미소 된장국', '타코', '불고기', '초밥', '티라미수'] },
        { src: image3, recipes: ['비빔밥', '시저 샐러드', '김치찌개', '갈릭 브레드', '스테이크'] }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [centralBottomContent, setCentralBottomContent] = useState(images[0].recipes[0]);
    const [totalIngredients, setTotalIngredients] = useState([]);

    const prevSlide = () => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        // Clear previous ingredients when changing slide
        setTotalIngredients([]);
        setCentralBottomContent(images[newIndex].recipes[0]);
    };

    const nextSlide = () => {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        // Clear previous ingredients when changing slide
        setTotalIngredients([]);
        setCentralBottomContent(images[newIndex].recipes[0]);
    };

    const handleRecipeClick = (recipe) => {
        setCentralBottomContent(recipe);
        // Clear previous ingredients when changing recipe
        setTotalIngredients([]);
    };

    return (
        <IngredientContext.Provider value={{ totalIngredients, setTotalIngredients }}>
            <div className='main_body_container'>
                <div className='body_blank_left' />
                <div className='body_left'>
                    <div className='body_left_top'>
                        {images[currentIndex].recipes.map((recipe, index) => (
                            <button className='body_left_top_button' key={index} onClick={() => handleRecipeClick(recipe)}>
                                {recipe}
                            </button>
                        ))}
                    </div>
                </div>
                <div className='body_center'>
                    <div className='body_center_top'>
                        <div className='slider'>
                            <button onClick={prevSlide} className='left-arrow'>
                                ←
                            </button>
                            <div className='slider-image'>
                                <img src={images[currentIndex].src} alt={`Slide ${currentIndex}`} />
                            </div>
                            <button onClick={nextSlide} className='right-arrow'>
                                →
                            </button>
                        </div>
                    </div>
                    <div className='body_center_bottom'>
                        <RecipeDetails recipeName={centralBottomContent} />
                    </div>
                </div>
                <div className='body_right'>
                    <StickyBanner />
                </div>
                <div className='body_blank_right' />
            </div>
        </IngredientContext.Provider>
    );
};


function RecipeDetails({ recipeName }) {
    return (
        <div className='recipe_container'>
            <div className='recipe_title'>
                <img
                    src={recipeName}
                    alt='레시피 이미지'
                    className='mypage_interaction_image'
                    onError={(e) => {
                        e.target.src = recipeImg;
                    }}
                />
                <h3>{recipeName}</h3>
            </div>
            {recipeName === '불고기' && (
                <div className='ingredient_container'>
                    <IngredientGroup
                        name='소고기'
                        standard='100g'
                        calorie={250}
                        sugar={0}
                        sodium={58}
                        protein={26}
                        carbohydrate={0}
                        fat={15}
                    />
                    <IngredientGroup
                        name='양파'
                        standard={100}
                        calorie={40}
                        sugar={4.2}
                        sodium={4}
                        protein={1.1}
                        carbohydrate={9.3}
                        fat={0.1}
                    />
                    <IngredientGroup
                        name='당근'
                        standard={100}
                        calorie={41}
                        sugar={4.7}
                        sodium={69}
                        protein={0.9}
                        carbohydrate={9.6}
                        fat={0.2}
                    />
                    <IngredientGroup
                        name='대파'
                        standard={100}
                        calorie={31}
                        sugar={2.4}
                        sodium={17}
                        protein={1.3}
                        carbohydrate={7.3}
                        fat={0.2}
                    />
                    <IngredientGroup
                        name='표고버섯'
                        standard={100}
                        calorie={34}
                        sugar={2.4}
                        sodium={9}
                        protein={2.2}
                        carbohydrate={6.8}
                        fat={0.5}
                    />
                </div>
            )}

            {recipeName === '비빔밥' && (
                <div className='ingredient_container'>
                    <IngredientGroup
                        name='밥'
                        standard='100g'
                        calorie={130}
                        sugar={0.2}
                        sodium={1}
                        protein={2.5}
                        carbohydrate={28.7}
                        fat={0.3}
                    />
                    <IngredientGroup
                        name='고추장'
                        standard='100g'
                        calorie={205}
                        sugar={15.1}
                        sodium={4015}
                        protein={9.5}
                        carbohydrate={17.8}
                        fat={12.3}
                    />
                    <IngredientGroup
                        name='계란'
                        standard='1개'
                        calorie={72}
                        sugar={0.2}
                        sodium={71}
                        protein={6.3}
                        carbohydrate={0.4}
                        fat={4.8}
                    />
                    <IngredientGroup
                        name='시금치'
                        standard='100g'
                        calorie={23}
                        sugar={0.4}
                        sodium={39}
                        protein={2.9}
                        carbohydrate={2.2}
                        fat={0.4}
                    />
                    <IngredientGroup
                        name='당근'
                        standard='100g'
                        calorie={41}
                        sugar={4.7}
                        sodium={69}
                        protein={0.9}
                        carbohydrate={9.6}
                        fat={0.2}
                    />
                    <IngredientGroup
                        name='소고기'
                        standard='100g'
                        calorie={250}
                        sugar={0}
                        sodium={58}
                        protein={26}
                        carbohydrate={0}
                        fat={15}
                    />
                    <IngredientGroup
                        name='양파'
                        standard='100g'
                        calorie={40}
                        sugar={4.2}
                        sodium={4}
                        protein={1.1}
                        carbohydrate={9.3}
                        fat={0.1}
                    />
                    <IngredientGroup
                        name='대파'
                        standard='100g'
                        calorie={31}
                        sugar={2.4}
                        sodium={17}
                        protein={1.3}
                        carbohydrate={7.3}
                        fat={0.2}
                    />
                    <IngredientGroup
                        name='시금치'
                        standard='100g'
                        calorie={23}
                        sugar={0.4}
                        sodium={39}
                        protein={2.9}
                        carbohydrate={2.2}
                        fat={0.4}
                    />
                    <IngredientGroup
                        name='호박'
                        standard='100g'
                        calorie={25}
                        sugar={2.7}
                        sodium={1}
                        protein={1.2}
                        carbohydrate={4.9}
                        fat={0.1}
                    />
                    <IngredientGroup
                        name='표고버섯'
                        standard='100g'
                        calorie={34}
                        sugar={2.4}
                        sodium={9}
                        protein={2.2}
                        carbohydrate={6.8}
                        fat={0.5}
                    />
                    <IngredientGroup
                        name='멸치'
                        standard='10마리'
                        calorie={10}
                        sugar={0}
                        sodium={0}
                        protein={1}
                        carbohydrate={0}
                        fat={0}
                    />
                    <IngredientGroup
                        name='김'
                        standard='1장'
                        calorie={5}
                        sugar={0}
                        sodium={5}
                        protein={0.5}
                        carbohydrate={1}
                        fat={0}
                    />
                    <IngredientGroup
                        name='참기름'
                        standard='10g'
                        calorie={90}
                        sugar={0}
                        sodium={0}
                        protein={0}
                        carbohydrate={0}
                        fat={10}
                    />
                </div>
            )}

            {recipeName === '마르게리타 피자' && (
                <div className='ingredient_container'>
                    <IngredientGroup
                        name='밀가루'
                        standard='100g'
                        calorie={265}
                        sugar={0.6}
                        sodium={2}
                        protein={9}
                        carbohydrate={56}
                        fat={1}
                    />
                    <IngredientGroup
                        name='토마토 소스'
                        standard='100g'
                        calorie={32}
                        sugar={4.9}
                        sodium={213}
                        protein={1.4}
                        carbohydrate={6.8}
                        fat={0.2}
                    />
                    <IngredientGroup
                        name='모짜렐라 치즈'
                        standard='100g'
                        calorie={250}
                        sugar={2.2}
                        sodium={528}
                        protein={18.5}
                        carbohydrate={2.2}
                        fat={18.6}
                    />
                    <IngredientGroup
                        name='바질 잎'
                        standard='100g'
                        calorie={23}
                        sugar={0}
                        sodium={4}
                        protein={3}
                        carbohydrate={2.7}
                        fat={0.6}
                    />
                    <IngredientGroup
                        name='올리브 오일'
                        standard='100g'
                        calorie={884}
                        sugar={0}
                        sodium={2}
                        protein={0}
                        carbohydrate={0}
                        fat={100}
                    />
                </div>
            )}

            {recipeName === '팬케이크' && (
                <div className='ingredient_container'>
                    <IngredientGroup
                        name='밀가루'
                        standard='100g'
                        calorie={364}
                        sugar={1.7}
                        sodium={2}
                        protein={10}
                        carbohydrate={76}
                        fat={1}
                    />
                    <IngredientGroup
                        name='우유'
                        standard='100g'
                        calorie={61}
                        sugar={4.8}
                        sodium={44}
                        protein={3.3}
                        carbohydrate={4.7}
                        fat={3.3}
                    />
                    <IngredientGroup
                        name='계란'
                        standard='1개'
                        calorie={68}
                        sugar={0.2}
                        sodium={63}
                        protein={6}
                        carbohydrate={0.4}
                        fat={4.8}
                    />
                    <IngredientGroup
                        name='설탕'
                        standard='100g'
                        calorie={387}
                        sugar={99.8}
                        sodium={1}
                        protein={0}
                        carbohydrate={99.8}
                        fat={0}
                    />
                    <IngredientGroup
                        name='베이킹 파우더'
                        standard='100g'
                        calorie={5}
                        sugar={0}
                        sodium={543}
                        protein={0.3}
                        carbohydrate={1.3}
                        fat={0}
                    />
                </div>
            )}

        </div>
    );
}

const StickyBanner = () => {
    const { totalIngredients } = React.useContext(IngredientContext);
    const totalCalorie = Math.floor(totalIngredients.reduce((acc, cur) => acc + cur.calorie, 0));
    const totalSugar = Math.floor(totalIngredients.reduce((acc, cur) => acc + cur.sugar, 0));
    const totalSodium = Math.floor(totalIngredients.reduce((acc, cur) => acc + cur.sodium, 0));
    const totalProtein = Math.floor(totalIngredients.reduce((acc, cur) => acc + cur.protein, 0));
    const totalCarbohydrate = Math.floor(totalIngredients.reduce((acc, cur) => acc + cur.carbohydrate, 0));
    const totalFat = Math.floor(totalIngredients.reduce((acc, cur) => acc + cur.fat, 0));

    return (
        <div className="total_nutri_stickey">
            <h3 className="total_text">총 영양성분</h3>
            <div className="total_nutri_text_box">
                <div className="total_nutri_text_title">총 칼로리</div>
                <div className="total_nutri_text_value">{totalCalorie.toLocaleString()}kcal</div>
            </div>
            <div className="total_nutri_text_box">
                <div className="total_nutri_text_title">총 당류</div>
                <div className="total_nutri_text_value">{totalSugar.toLocaleString()}g</div>
            </div>
            <div className="total_nutri_text_box">
                <div className="total_nutri_text_title">총 나트륨</div>
                <div className="total_nutri_text_value">{totalSodium.toLocaleString()}mg</div>
            </div>
            <div className="total_nutri_text_box">
                <div className="total_nutri_text_title">총 단백질</div>
                <div className="total_nutri_text_value">{totalProtein.toLocaleString()}g</div>
            </div>
            <div className="total_nutri_text_box">
                <div className="total_nutri_text_title">총 탄수화물</div>
                <div className="total_nutri_text_value">{totalCarbohydrate.toLocaleString()}g</div>
            </div>
            <div className="total_nutri_text_box">
                <div className="total_nutri_text_title">총 지방</div>
                <div className="total_nutri_text_value">{totalFat.toLocaleString()}g</div>
            </div>
        </div>
    );
};


const IngredientGroup = ({name, standard, calorie, sugar, sodium, protein, carbohydrate, fat}) => {
    const {totalIngredients, setTotalIngredients} = React.useContext(IngredientContext);
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


export default Main;