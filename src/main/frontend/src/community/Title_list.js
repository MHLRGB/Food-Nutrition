import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMyRecipes, getAllRecipes } from "../apis/Recipe_api";

const TitleList = ({ category, myrecipe }) => {
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);  // 현재 페이지 상태 추가
    const [hasMore, setHasMore] = useState(true); // 다음 페이지 존재 여부
    const navigate = useNavigate();

    const fetchRecipes = async (currentPage) => {
        try {
            let data;
            if (myrecipe === "1") {
                data = await getAllMyRecipes(currentPage);
            } else {
                data = await getAllRecipes(currentPage);
            }
            if (data.length < 10) {
                setHasMore(false); // 10개 미만이면 더 이상 페이지 없음
            }
            setTitles(prevTitles => [...prevTitles, ...data]); // 기존 데이터 유지하며 추가
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes(page);
    }, [page]); // page 변경 시 데이터 로드

    if (loading && page === 1) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleNavRecipe = (id) => {
        if (category === "recipe") {
            window.location.href = `/recipe/${id}`;
        } else {
            window.location.href = `/community/board/${id}`;
        }
    };

    return (
        <div className='community_board_title_list'>
            {titles.map((title, index) => (
                <div
                    className='community_board_title'
                    key={index}
                    onClick={() => handleNavRecipe(title.recipeId)}
                >
                    {title.recipeTitle}
                </div>
            ))}
            {hasMore && (
                <button onClick={() => setPage(prev => prev + 1)}>더보기</button>
            )}
        </div>
    );
};

export default TitleList;
