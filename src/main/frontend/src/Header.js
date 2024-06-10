import {Link} from "react-router-dom";
import React from "react";
import './css/Header.css';

function Header() {
    return (
        <header>
            <div className="header_user_container">
                <Link to="/mypage" className="header_user_menu">마이페이지</Link>
                <Link to="/" className="header_user_menu">로그인</Link>
                <Link to="/" className="header_user_menu">로그아웃</Link>
            </div>

            <div className="header_main">
                <Link to="/pageA" className="header_main_circle">AI</Link>
                <Link to="/" className="header_main_circle">메인</Link>
                <Link to="/pageC" className="header_main_circle">검색</Link>
                <Link to="/pageD" className="header_main_circle">커뮤니티</Link>
            </div>

        </header>
    );
}

export default Header;