import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import './css/Header.css';
import ai_icon from './image/header/ai_icon.png';
import community_icon from './image/header/community_icon.png';
import main_icon from './image/header/main_icon.png';
import search_icon from './image/header/search_icon.png';
import user_icon from './image/header/user_icon.png';
import { nowUserInfo } from "./apis/User_api";

function Header() {
    const [userdata, setUserdata] = useState('');
    const [fade, setFade] = useState('fade-in'); // 초기값: fade-in
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await nowUserInfo();
                setUserdata(response);
            } catch (error) {
                console.log("Error: " + error);
            }
        };
        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.redirected) {
                window.location.href = response.url;
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleClick = (path) => {
        setFade('fade-out'); // 페이드 아웃 시작
        setTimeout(() => {
            navigate(path); // 페이지 이동
            setFade('fade-in'); // 페이드 인으로 전환
        }, 500); // 페이드 아웃 시간 후 페이지 이동
    };

    return (
        <header className={`header_main ${fade}`}>
            <div className="header_left">
                {userdata.username !== "anonymousUser" ? (
                    <div className="header_user_info">
                        <img className="header_user_icon" src={user_icon} alt="user_icon"/>
                        <div className="header_user_name">{userdata.username}</div>
                    </div>
                ) : null}
            </div>
            <div className="header_nav">
                <div onClick={() => handleClick('/aisearch')} className={`header_nav_circle ${location.pathname === '/aisearch' ? 'active' : ''}`}>
                    <img src={ai_icon} alt="AI" className="header_icon" />
                </div>
                <div onClick={() => handleClick('/')} className={`header_nav_circle ${location.pathname === '/' ? 'active' : ''}`}>
                    <img src={main_icon} alt="Main" className="header_icon" />
                </div>
                <div onClick={() => handleClick('/Search')} className={`header_nav_circle ${location.pathname === '/Search' ? 'active' : ''}`}>
                    <img src={search_icon} alt="Search" className="header_icon" />
                </div>
                <div
                    onClick={() => handleClick('/recipe')}
                    className={`header_nav_circle ${(location.pathname.startsWith('/recipe') || location.pathname.startsWith('/recipe')) ? 'active' : ''}`}
                >
                    <img src={community_icon} alt="Community" className="header_icon" />
                </div>
            </div>
            <div className="header_user_container">
                {userdata.username !== "anonymousUser" ? (
                    <>
                        <div className="header_user_menu" onClick={handleLogout}>Logout</div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="header_user_menu">Login</Link>
                        <Link to="/join" className="header_user_menu">Sign up</Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;
