import React, { useState } from "react";
import './css/MyPage.css';
import './css/Main.css';
import Header from "./Header";

import heartImg from './image/mypage-heart.png';
import scrapImg from './image/mypage-scrap.png';
import documentImg from './image/mypage-document.png';
import commentImg from './image/mypage-comment.png';
import profileImg from "./image/profile.png";
import {MainProvider} from "./main/MainContext";



const MyPage = () => {
    return (
        <div className='document'>
                <Header/>
                <Body/>
        </div>
    );
};

const Body = () => {
    return (
        <div>
            <div className="mypage_body">
                <div className="mypage_body_container">
                    <div className="my_page_title">마이페이지</div>

                    <div className="mypage_profile-container">
                        <img src={profileImg} alt="profile"/>
                        <div className="username">이문환님</div>
                    </div>

                    <div className="mypage_info_container">
                        <div className="mypage_info_group">
                            <div className="info_title">아이디</div>
                            <div className="info_contents">dongyang123</div>
                        </div>
                        <div className="mypage_info_group">
                            <div className="info_title">비밀번호</div>
                            <div className="info_contents">⦁⦁⦁⦁⦁⦁⦁⦁⦁⦁</div>
                            <button className="info_button">비밀번호 변경</button>
                        </div>
                        <div className="mypage_info_group">
                            <div className="info_title">닉네임</div>
                            <div className="info_contents">동양이</div>
                            <button className="info_button">닉네임 변경</button>
                        </div>
                        <div className="mypage_info_group">
                            <div className="info_title">이메일</div>
                            <div className="info_contents">dongyang123@m365.dongyang.ac.kr</div>
                            <button className="info_button">이메일 변경</button>
                        </div>
                        <div className="mypage_info_group">
                            <div className="info_title">전화번호</div>
                            <div className="info_contents">010-1234-5678</div>
                            <button className="info_button">전화번호 변경</button>
                        </div>
                    </div>
                    <div className="mypage_interaction_box">
                        <div className="mypage_interaction_group">
                            <img src={heartImg} alt="Heart" className="mypage_interaction_image"/>
                            <div>좋아요</div>
                        </div>
                        <div className="mypage_interaction_group">
                            <img src={scrapImg} alt="scrap" className="mypage_interaction_image"/>
                            <div>스크랩</div>
                        </div>
                        <div className="mypage_interaction_group">
                            <img src={documentImg} alt="document" className="mypage_interaction_image"/>
                            <div>내 글</div>
                        </div>
                        <div className="mypage_interaction_group">
                            <img src={commentImg} alt="comment" className="mypage_interaction_image"/>
                            <div>내 댓글</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MyPage;
