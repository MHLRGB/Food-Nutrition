import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import './css/Header.css';
import axios from "axios";

function Header() {
    const [auth, setAuth] = useState('');

    useEffect(() => {
        axios.post('/login')
            .then((res) => {
                setAuth(res.data);
            })
    }, []);

    return (
        <header>
            <span>{auth}님 안녕하세요.</span>
            <div className="header_user_container">
                {auth !== "anonymousUser" ? (
                    <>
                        <Link type="button" to="/mypage" className="header_user_menu">마이페이지</Link>
                        <form action="/logout" method="post">
                            <input type="submit" className="header_user_menu" value="로그아웃"/>
                        </form>
                    </>
                ) : (
                    <Link type="button" to="/login" className="header_user_menu">로그인</Link>
                )}
                <Link type="button" to="/join" className="header_user_menu">회원가입</Link>
            </div>

            <div className="header_main">
                <Link to="/pageA" className="header_main_circle">AI</Link>
                <Link to="/" className="header_main_circle">메인</Link>
                <Link to="/pageC" className="header_main_circle">검색</Link>
                <Link to="/community" className="header_main_circle">커뮤니티</Link>
            </div>
        </header>
    );
}

export default Header;
