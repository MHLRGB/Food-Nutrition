import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../Header';
import { MainProvider } from "../../main/MainContext";
import RecipeIngredientsBox from "../../main/RecipeIngredientsBox";
import { deleteCommunityById, getBoardById } from "../../apis/Community_api";
import StickyBanner from "../../main/StickyBanner";

const Community_board_detail = () => {
    return (
        <div className='document'>
            <Header />
            <Body />
        </div>
    );
};

const Body = () => {
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 레시피 데이터 가져오기
                const boardData = await getBoardById(id);
                setBoard(boardData);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const deleteRecipe = async (id) => {
        try {
            await deleteCommunityById(id);
            navigate(-1);
        } catch (error) {
            console.log("error:", error);
        }
    };

    const handleNavUpdate = (id) => {
        window.location.href = `/community/board/update/${id}`;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <MainProvider>
            <div className='community_board_body_container'>
                <div className='community_board_body_left'>

                </div>
                <div className='community_board_body_center'>
                    <h1>{board.title}</h1>
                    <p><strong>Author:</strong> {board.author}</p>
                    <p><strong>Category:</strong> {board.category}</p>
                    <p><strong>Created Date:</strong> {board.createdDate}</p>
                    <p>{board.content}</p>
                    <button
                        type='button'
                        onClick={() => deleteCommunityById(board.id, board.author)}
                    >
                        글 삭제하기
                    </button>

                    <div onClick={() => handleNavUpdate(board.id)}>수정</div>

                    {board.recipeId && <RecipeIngredientsBox recipeId={board.recipeId}/>}
                </div>
                <div className='community_board_body_right'>
                    {board.recipeId && <StickyBanner/>}
                </div>
            </div>
        </MainProvider>
    );
};

export default Community_board_detail;
