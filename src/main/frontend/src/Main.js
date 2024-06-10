import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './css/Main.css';
import axios from "axios";
import './css/imageSlider.css';

import image1 from './image/img.png';
import image2 from './image/img_1.png';
import image3 from './image/img_2.png';
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


function ContentBox({ children }) {
    return (
        <div className="content">
            {children}
        </div>
    );
}

function Body() {
    const images = [
        { src: image1, recipes: ["스파게티 볼로네제", "치킨 카레", "감자 샐러드", "초콜릿 케이크"] },
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
        <div className="body-container">
            <div className='body_blank_left'></div>
            <div className='body_left'>
                <div className='body_left_top'>
                    {images[currentIndex].recipes.map((recipe, index) => (
                        <button className="body_left_top_button" key={index} onClick={() => handleRecipeClick(recipe)}>{recipe}</button>
                    ))}
                </div>
            </div>
            <div className="con2">
                <div className='con2-top'>
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
                <div className='con2-bottom'> {/* 이미지 상자 */}
                    <RecipeDetails recipeName={centralBottomContent} />
                </div>
            </div>
            <div className="con3"><StickyBanner /></div>
            <div className='con3-1'></div>
        </div>
    );
}

function RecipeDetails({ recipeName }) {
    // 각 레시피에 대한 상세 정보를 가져오는 로직을 구현할 수 있습니다.
    // 이 예시에서는 간단히 레시피 이름을 출력하는 것으로 대체합니다.
    return (
        <div>
            <div className="image-box">
                <img src="C:\Users\h0102\Desktop\img\kim.PNG" alt="이미지 설명" />
                <h3>{recipeName}</h3>
            </div>
            <div className="ellipse-container">
                <div className="ellipse1">Box 1</div>
                <div className="ellipse2">Box 2</div>
                <div className="ellipse3">Box 3</div>
            </div>

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


export default Main;