import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import './css/Header.css';
import ai_icon from './image/header/ai_icon.png';
import community_icon from './image/header/community_icon.png';
import main_icon from './image/header/main_icon.png';
import search_icon from './image/header/search_icon.png';
import user_icon from './image/header/user_icon.png';


import axios from "axios";
import {nowUserInfo} from "./apis/User_api";
import {getBoardById} from "./apis/Community_api";
import heartImg from "./image/mypage-heart.png";

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

            <div className="header_left">
                {userdata.username !== "anonymousUser" ? (
                <div className="header_user_info">
                    <img className="header_user_icon" src={user_icon} alt="user_icon"/>
                    <div className="header_user_name">{userdata.username}</div>
                </div>
                    ) : (
                        <>
                        </>
                    )}
            </div>
            <div className="header_nav">
                <Link to="/pageA" className="header_nav_circle">
                    <img src={ai_icon} alt="AI" className="header_icon"/>
                </Link>
                <Link to="/" className="header_nav_circle">
                <img src={main_icon} alt="AI" className="header_icon"/>
                    </Link>
                    <Link to="/pageC" className="header_nav_circle">
                        <img src={search_icon} alt="AI" className="header_icon"/>
                    </Link>
                    <Link to="/community" className="header_nav_circle">
                        <img src={community_icon} alt="AI" className="header_icon"/>
                    </Link>
                </div>

                <div className="header_user_container">
                    {userdata.username !== "anonymousUser" ? (
                        <>
                            <Link type="button" to="/mypage" className="header_user_menu">My Page</Link>
                            <div className="header_user_menu" onClick={handleLogout}>Logout</div>
                        </>
                    ) : (
                        <>
                            <Link type="button" to="/login" className="header_user_menu">Login</Link>
                            <Link type="button" to="/join" className="header_user_menu">Sign up</Link>
                        </>
                    )}
                </div>
        </header>
);
}

export default Header;
