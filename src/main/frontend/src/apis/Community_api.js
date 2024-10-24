import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {nowUserInfo} from "./User_api";


export const createCommunity = async (title, content, category, recipeTitle, recipeContent, recipeCategory, recipeIngredients) => {
    // recipeTitle, recipeCategory, recipeIngredients 중 하나라도 없으면 recipeRequestDTO를 null로 설정
    const hasRecipeDetails = recipeTitle && recipeCategory && recipeIngredients && recipeIngredients.length > 0;

    const recipeRequestDTO = hasRecipeDetails ? {
        title: recipeTitle,
        content: recipeContent,
        category: recipeCategory,
        ingredients: recipeIngredients.map(ingredient => ({
            ingredientId: ingredient.ingredientId || null,
            quantity: ingredient.quantity || 0
        }))
    } : null;

    const requestDTO = {
        title: title,
        content: content,
        category: category,
        recipeRequestDTO // 조건에 따라 recipeRequestDTO가 null일 수 있음
    };

    try {
        const response = await axios.post('/api/community', requestDTO, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 서버로부터 받은 데이터를 반환
    } catch (error) {
        console.error('Error creating recipe:', error);
        throw error; // 에러를 상위 호출자에게 전달
    }
};


export const updateCommunity = async (id, title, content, category, recipeTitle, recipeContent, recipeCategory, recipeIngredients) => {

    // const userdata = await nowUserInfo();
    //
    // console.log("userdata.auth : " + userdata.role);
    // if (userdata.role !== "ROLE_ADMIN" && userdata.username !== username) {
    //     alert("수정 권한이 없습니다.");
    //     return;  // 함수 종료
    // }

    console.log("레시피 타이틀 : " , recipeTitle);
    console.log("레시피 카테고리 : " , recipeCategory);
    console.log("레시피 재료 : " , recipeIngredients);

    const hasRecipeDetails = recipeTitle && recipeCategory && recipeIngredients && recipeIngredients.length > 0;

    const recipeRequestDTO = hasRecipeDetails ? {
        title: recipeTitle,
        content: recipeContent,
        category: recipeCategory,
        ingredients: recipeIngredients.map(ingredient => ({
            ingredientId: ingredient.ingredientId || null,
            quantity: ingredient.quantity || 0
        }))
    } : null;

    const requestDTO = {
        title: title,
        content: content,
        category: category,
        recipeRequestDTO
    };

    try {
        const response = await axios.put(`/api/community/${id}`, requestDTO, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating community recipe with id ${id}:`, error);
        throw error; // 에러를 상위 호출자에게 전달
    }
};


export const getAllCommunities = async () => {
    const response = await axios.get('/api/community');
    return response.data;
};

export const getBoardById = async (id) => {

    const response = await axios.get(`/api/community/${id}`);
    console.log("보드 아이디 데이터 : "+response.data);
    return response.data;
};



export const deleteCommunityById = async (id, username) => {
    const userdata = await nowUserInfo();

    console.log("userdata.auth : " + userdata.role);
    if (userdata.role !== "ROLE_ADMIN" && userdata.username !== username) {
        alert("삭제 권한이 없습니다.");
        return;  // 함수 종료
    }

    // 권한이 있는 경우 삭제 확인 창 띄우기
    if (window.confirm("해당 글을 삭제하시겠습니까?")) {
        try {
            const response = await axios.delete(`/api/community/${id}`);

            // 삭제 성공 후 알림창 띄우기
            alert("삭제 되었습니다");

            // 이전 페이지로 돌아가기
            window.history.back();

            return response.data; // 삭제 성공 시 서버로부터의 응답 데이터 반환
        } catch (error) {
            console.error('Error deleting community:', error); // 오류 발생 시 로그 출력
            throw error; // 상위 호출자에게 오류 전달
        }
    } else {
        // 사용자가 "아니오"를 선택한 경우 작업 취소
        console.log('삭제 작업이 취소되었습니다.');
    }
};
