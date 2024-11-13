import React, { useState } from "react";
import './css/Search.css'; // 스타일 파일을 임포트
import ai_icon from "./image/header/search_page_icon.png"; // 검색 버튼 아이콘
import leftArrow from "./image/main/arrow_back_icon.png"; // 왼쪽 버튼 이미지
import rightArrow from "./image/main/arrow_forward_icon.png"; // 오른쪽 버튼 이미지
import Header from "./Header"; // Header 컴포넌트 추가
import axios from 'axios'; // 서버와의 통신을 위한 axios

const Search = () => {
    return (
        <div className="document">
            <Header />
            <Body />
        </div>
    );
};

const Body = () => {
    const [inputValue, setInputValue] = useState(''); // 검색어 상태
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태

    const ITEMS_PER_PAGE = 5; // 한 페이지에 표시할 레시피 수

    // 검색어 입력 시 상태 관리
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // 검색 버튼 클릭 시 서버로 검색 요청
    const handleSearch = async () => {
        if (inputValue.trim() === "") return; // 빈 검색어 입력 방지

        try {
            // 여기에서 axios 요청을 기다립니다.
            const response = await axios.get("http://localhost:8080/api/search/recipes", {
                params: { title: inputValue }
            });
            setSearchResults(response.data); // 서버에서 받은 데이터를 검색 결과로 설정
            setCurrentPage(0); // 검색 후 첫 페이지로 리셋
        } catch (error) {
            console.error("검색 중 오류 발생:", error);
        }
    };

    // 페이지 전환 핸들러
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

    // 현재 페이지의 레시피만 표시
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

            {/* 구분선 */}
            <div className="separator"></div>

            {/* 레시피 결과 표시 */}
            <div className="recipe_container_wrapper">
                {searchResults.length > 0 ? (
                    <>
                        {/* 레시피 목록 */}
                        <div className="recipe_container">
                            {currentRecipes.map(recipe => (
                                <div key={recipe.recipeNumber} className="recipe_item">
                                    <span>{recipe.title}</span>
                                </div>
                            ))}
                        </div>

                        {/* 페이지 전환 버튼 */}
                        <div className="pagination_buttons">
                            <button className="left_button" onClick={() => changePage("prev")}>
                                <img src={leftArrow} alt="Previous"/>
                            </button>

                            <button className="right_button" onClick={() => changePage("next")}>
                                <img src={rightArrow} alt="Next"/>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="no_results">검색 결과가 없습니다.</div>
                )}
            </div>
        </div>
    );
};

export default Search;
