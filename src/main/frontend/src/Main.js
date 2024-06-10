import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './css/Main.css';
import axios from "axios";
import './css/imageSlider.css';

import image1 from './image/img.png';
import image2 from './image/img_1.png';
import image3 from './image/img_2.png';
import foodImg from './image/food.png';
import recipeImg from './image/recipe.png';

import Header from "./Header";

const Main = () => {
    const [auth, setAuth] = useState('');

    // useEffect(() => {
    //     axios.post('/login')
    //         .then((res) => {
    //             setAuth(res.data);
    //         })
    // }, []);

    return (
        <div>
            {/*<div>{auth}님 안녕하세요.</div>*/}
            <Header />
            <Body />
        </div>
    );
}

function Body() {
    const images = [
        { src: image1, recipes: ["불고기", "비빔밥", "김치찌개", "잡채", "된장찌개"] },
        { src: image2, recipes: ["마르게리타 피자", "미소 된장국", "타코", "불고기", "초밥", "티라미수"] },
        { src: image3, recipes: ["팬케이크", "시저 샐러드", "김치찌개", "갈릭 브레드", "스테이크"] }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [centralBottomContent, setCentralBottomContent] = useState(images[0].recipes[0]);

    const prevSlide = () => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
        setCentralBottomContent(images[newIndex].recipes[0]);
    };

    const nextSlide = () => {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        setCentralBottomContent(images[newIndex].recipes[0]);
    };
    const handleRecipeClick = (recipe) => {
        setCentralBottomContent(recipe);
    }
    return (
        <div className="main_body_container">
            <div className='body_blank_left' />
            <div className='body_left'>
                <div className='body_left_top'>
                    {images[currentIndex].recipes.map((recipe, index) => (
                        <button className="body_left_top_button" key={index} onClick={() => handleRecipeClick(recipe)}>{recipe}</button>
                    ))}
                </div>
            </div>
            <div className="body_center">
                <div className='body_center_top'>
                    {/* 링크 추가
            <Link to="https://sports.news.naver.com/index" className="news-link">기사</Link> */}
                    <div className="slider">
                        <button onClick={prevSlide} className="left-arrow">←</button>
                        <div className="slider-image">
                            <img src={images[currentIndex].src} alt={`Slide ${currentIndex}`} />
                        </div>
                        <button onClick={nextSlide} className="right-arrow">→</button>
                    </div>

                </div>
                <div className='body_center_bottom'>
                    <RecipeDetails recipeName={centralBottomContent} />
                </div>
            </div>
            <div className="body_right"><StickyBanner /></div>
            <div className='body_blank_right' />
        </div>
    );
}

function RecipeDetails({ recipeName }) {
    return (
        <div className="recipe_container">
            <div className="recipe_title">
                <img
                    src={recipeName}
                    alt="레시피 이미지"
                    className="mypage_interaction_image"
                    onError={(e) => {
                        e.target.src = recipeImg;
                    }}
                />
                <h3>{recipeName}</h3>
            </div>
            {recipeName === "불고기" && (
                <div className="ingredient_container">
                    <IngredientGroup
                        name="소고기"
                        standard="100g"
                        calorie={250}
                        sugar={0}
                        sodium={58}
                        protein={26}
                        carbohydrate={0}
                        fat={15}
                    />
                    <IngredientGroup
                        name="양파"
                        standard="1 개"
                        calorie={40}
                        sugar={4.2}
                        sodium={4}
                        protein={1.1}
                        carbohydrate={9.3}
                        fat={0.1}
                    />
                    <IngredientGroup
                        name="당근"
                        standard="1/2 개"
                        calorie={41}
                        sugar={4.7}
                        sodium={69}
                        protein={0.9}
                        carbohydrate={9.6}
                        fat={0.2}
                    />
                    <IngredientGroup
                        name="대파"
                        standard="1 단"
                        calorie={31}
                        sugar={2.4}
                        sodium={17}
                        protein={1.3}
                        carbohydrate={7.3}
                        fat={0.2}
                    />
                    <IngredientGroup
                        name="표고버섯"
                        standard="3 개"
                        calorie={34}
                        sugar={2.4}
                        sodium={9}
                        protein={2.2}
                        carbohydrate={6.8}
                        fat={0.5}
                    />
                </div>
            )}

            {/* 레시피에 대한 상세 정보를 여기에 추가할 수 있습니다. */}
        </div>
    );
}


const StickyBanner = () => {
    return (
        <div className="sticky-banner">
            여기에 Sticky 배너 컨텐츠를 넣어주세요.
        </div>
    );
};

const IngredientGroup = ({ name, standard, calorie, sugar, sodium, protein, carbohydrate, fat }) => {

    return (
        <div className="ingredient_group">
            <div className="ingredient_title">
                <div className="ingredient_title_text">{name}</div>
                <div className="ingredient_standard">{standard}</div>
            </div>
            <div className="ingredient_info">
                <div className="ingredient_info_detail">
                    <div className="ingredient_info_detail_title">칼로리</div>
                    <div className="ingredient_info_detail_content">{calorie}kcal</div>
                </div>
                <div className="ingredient_info_detail">
                    <div className="ingredient_info_detail_title">당류</div>
                    <div className="ingredient_info_detail_content">{sugar}g</div>
                </div>
                <div className="ingredient_info_detail">
                    <div className="ingredient_info_detail_title">나트륨</div>
                    <div className="ingredient_info_detail_content">{sodium}mg</div>
                </div>
            </div>
            <div className="ingredient_info">
                <div className="ingredient_info_detail">
                    <div className="ingredient_info_detail_title">단백질</div>
                    <div className="ingredient_info_detail_content">{protein}g</div>
                </div>
                <div className="ingredient_info_detail">
                    <div className="ingredient_info_detail_title">탄수화물</div>
                    <div className="ingredient_info_detail_content">{carbohydrate}g</div>
                </div>
                <div className="ingredient_info_detail">
                    <div className="ingredient_info_detail_title">지방</div>
                    <div className="ingredient_info_detail_content">{fat}g</div>
                </div>
            </div>
        </div>
    );
};


export default Main;