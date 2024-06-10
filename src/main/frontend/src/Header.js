import {Link} from "react-router-dom";
import React from "react";
import './css/Header.css'; // 위에서 작성한 CSS 파일 import

function Header() {
    return (
        <header>
            <div className="userheader">
                <div>마이페이지</div>
                <div>로그인</div>
                <div>로그아웃</div>
            </div>

            <div className="main-container">
                <Link to="/pageA" className="circle">AI</Link>
                <Link to="/" className="circle">메인</Link>
                <Link to="/pageC" className="circle">검색</Link>
                <Link to="/pageD" className="circle">커뮤</Link>
            </div>

        </header>
    );
}

export default Header;