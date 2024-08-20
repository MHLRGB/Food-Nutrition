import React, {useEffect, useState, createContext, useContext} from 'react';
import { Link } from 'react-router-dom';
import '../css/Main.css';
import axios from 'axios';
import '../css/imageSlider.css';

import image1 from '../image/slide-1.png';
import image2 from '../image/slide-2.png';
import image3 from '../image/slide-3.png';
import recipeImg from '../image/recipe.png';

import Header from '../Header';
import {MainContext, MainProvider} from "./MainContext";
import IngredientGroup from "./IngredientGroup";
import StickyBanner from "./StickyBanner";


const Main = () => {
    return (
        <div className='document'>
            <MainProvider>
                <Header/>
                <Body/>
            </MainProvider>
        </div>
    );
};

const Body = () => {
    const images = [
        { src: image1, recipes: ['불고기','팬케이크', '김치찌개', '잡채', '된장찌개'] },
        { src: image2, recipes: ['마르게리타 피자', '미소 된장국', '타코', '불고기', '초밥', '티라미수'] },
        { src: image3, recipes: ['비빔밥', '시저 샐러드', '케이크', '갈릭 브레드', '스테이크'] }
    ];

    const [sliderIndex, setSliderIndex] = useState(0);
    const [recipeIndex, setRecipeIndex] = useState(images[0].recipes[0]);
    const {totalIngredients, setTotalIngredients} = useContext(MainContext);

    // setTotalIngredients(prevIngredients =>
    //     prevIngredients.filter(ingredient => ingredient.name !== name)
    // );

    const prevSlide = () => {
        const newIndex = sliderIndex === 0 ? images.length - 1 : sliderIndex - 1;
        setSliderIndex(newIndex);
        setRecipeIndex(images[newIndex].recipes[0]);
        setTotalIngredients([]);
    };

    const nextSlide = () => {
        const newIndex = sliderIndex === images.length - 1 ? 0 : sliderIndex + 1;
        setSliderIndex(newIndex);
        setRecipeIndex(images[newIndex].recipes[0]);
        setTotalIngredients([]);
    };

    const handleRecipeClick = (recipe) => {
        setRecipeIndex(recipe);
        setTotalIngredients([]);
    };

    return (
        <div className='main_body_container'>
            <div className='body_left'>
                <div className='body_left_top'>
                    {images[sliderIndex].recipes.map((recipe, index) => (
                        <button className='body_left_top_button' key={index} onClick={() => handleRecipeClick(recipe)}>
                            {recipe}
                        </button>
                    ))}
                </div>
            </div>
            <div className='main_body_center'>
                <div className='body_center_top'>
                    <div className='slider'>
                        <button onClick={prevSlide} className='left-arrow'>
                            ←
                        </button>
                        <div className='slider-image'>
                            <img src={images[sliderIndex].src} alt={`Slide ${sliderIndex}`}/>
                        </div>
                        <button onClick={nextSlide} className='right-arrow'>
                            →
                        </button>
                    </div>
                </div>
                <div className='body_center_bottom'>
                    <RecipeDetails recipeName={recipeIndex}/>
                </div>
            </div>
            <div className='body_right'>
                <StickyBanner/>
            </div>
        </div>
    );
};


function RecipeDetails({recipeName}) {
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
        </div>
    );
}





export default Main;