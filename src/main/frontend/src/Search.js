import React, { useState, useEffect } from "react";
import './css/Search.css';
import ai_icon from "./image/header/search_page_icon.png";
import leftArrow from "./image/main/arrow_back_icon.png";
import rightArrow from "./image/main/arrow_forward_icon.png";
import Header from "./Header";
import axios from 'axios';
import buger from "./image/recipe_image/recipe_title_icon.png";
import {useNavigate} from "react-router-dom";

const Search = () => {
    return (
        <div className="document">
            <Header />
            <Body />
        </div>
    );
};

const Body = () => {
    const [inputValue, setInputValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchAttempted, setSearchAttempted] = useState(false);

    const ITEMS_PER_PAGE = 3; // 한 페이지에 3개씩

    const navigate = useNavigate();

    const handleImageClick = (id) => {
        navigate(`/recipe/${id}`);
    };

    useEffect(() => {
        setSearchResults([]);
        setSearchAttempted(false);
    }, []);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSearch = async () => {
        if (inputValue.trim() === "") return;

        setLoading(true);
        setSearchAttempted(true);

        try {
            const response = await axios.get("http://localhost:3000/api/search/recipes", {
                params: { title: inputValue }
            });
            setSearchResults(response.data);
            setCurrentPage(0);
        } catch (error) {
            console.error("검색 중 오류 발생:", error);
        } finally {
            setLoading(false);
        }
    };

    const changePage = (direction) => {
        setCurrentPage(prevPage => {
            const maxPage = Math.ceil(searchResults.length / ITEMS_PER_PAGE) - 1;
            if (direction === "next" && prevPage < maxPage) {
                return prevPage + 1;
            } else if (direction === "prev" && prevPage > 0) {
                return prevPage - 1;
            }
            return prevPage;
        });
    };

    const currentRecipes = searchResults.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    return (
        <div className="search_body">
            <div className="search_group">
                <div className="search_input_box">
                    <input
                        className="search_input"
                        type="text"
                        placeholder="검색어 입력"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <div className="search_button" onClick={handleSearch}>
                        <img className="search-button_img" src={ai_icon} alt="Search"/>
                    </div>
                </div>
            </div>

            <div className="recipe_container_wrapper">
                {searchResults.length > 0 ? (
                    <>
                        <div className="search_recipe_container">
                            {currentRecipes.map((recipe, index) => (
                                <div
                                    key={recipe.recipeNumber}
                                    className="recipe_card"
                                    style={{animationDelay: `${index * 0.3}s`}} // 애니메이션 딜레이
                                >
                                    <img
                                        className="recipe_image"
                                        src={buger}  // 테스트용 이미지 경로
                                        alt={recipe.title}
                                        onClick={handleImageClick(recipe.recipeNumber)}
                                    />
                                    <h2 className="recipe_title">{recipe.title}</h2>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    searchAttempted && !loading && (
                        <div className="no_results">검색 결과가 없습니다.</div>
                    )
                )}
            </div>

            {/* 페이지 네비게이션 버튼을 recipe_container_wrapper 바깥으로 빼서 가로로 배치 */}
            <div className="pagination_buttons">
                <button className="left_button" onClick={() => changePage("prev")}>
                    <img src={leftArrow} alt="Previous"/>
                </button>
                <button className="right_button" onClick={() => changePage("next")}>
                    <img src={rightArrow} alt="Next"/>
                </button>
            </div>
        </div>
    );
};

export default Search;