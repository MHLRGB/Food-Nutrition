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

    // const handleLogout = async () => {
    //     try {
    //         const response = await fetch('/logout', {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // }

    const handleLogout = async () => {
        try {
            const response = await fetch('/logout', {
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
        <header>
            <div className="header_user_container">

                {auth !== "anonymousUser" ? (
                    <>
                        <Link type="button" to="/mypage" className="header_user_menu">마이페이지</Link>
{/*                        <form action="/logout" method="post">
                            <input type="submit" className="header_user_menu" value="로그아웃"/>
                        </form>*/}
                        <div className="header_user_menu" onClick={handleLogout}>로그아웃</div>
                        <div className="greeting_message">{auth}님 안녕하세요.</div>
                    </>
                ) : (
                    <>
                    <Link type="button" to="/login" className="header_user_menu">로그인</Link>
                    <Link type="button" to="/join" className="header_user_menu">회원가입</Link>
                    </>
                )}

                <br/>

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
