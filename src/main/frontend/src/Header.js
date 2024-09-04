import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import './css/Header.css';
import axios from "axios";
import {nowUserInfo} from "./apis/User_api";
import {getBoardById} from "./apis/Community_api";

function Header() {

    const [userdata, setUserdata] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 레시피 데이터 가져오기
                const response = await nowUserInfo();
                setUserdata(response)
            } catch (error) {
                console.log("Error : "+error);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'GET',
                credentials: 'include' // 쿠키가 필요하다면 포함
            });

            if (response.redirected) {
                // 서버에서 리다이렉트된 URL로 리다이렉트
                window.location.href = response.url;
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <header className="header_main">
            <div className="header_user_container">
                {userdata.username !== "anonymousUser" ? (
                    <>
                        <div className="greeting_message">{userdata.username}님 안녕하세요.</div>
                        <Link type="button" to="/mypage" className="header_user_menu">마이페이지</Link>
                        <div className="header_user_menu" onClick={handleLogout}>로그아웃</div>
                    </>
                ) : (
                    <>
                    <Link type="button" to="/login" className="header_user_menu">로그인</Link>
                    <Link type="button" to="/join" className="header_user_menu">회원가입</Link>
                    </>
                )}

                <br/>

            </div>

            <div className="header_nav">
                <Link to="/pageA" className="header_nav_circle">AI</Link>
                <Link to="/" className="header_nav_circle">메인</Link>
                <Link to="/pageC" className="header_nav_circle">검색</Link>
                <Link to="/community" className="header_nav_circle">커뮤니티</Link>
            </div>
        </header>
    );
}

export default Header;
