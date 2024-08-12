import React, { useState } from "react";
import './css/Join.css';

const Join = () => {
    const [username, setUsername1] = useState('');
    const [password, setPassword1] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // 아이디 중복 확인 상태
    const [isDuplicate, setIsDuplicate] = useState(null);
    // 아이디 오류 확인 상태
    const [usernameError, setUsernameError] = useState('');

    const checkDupId = async () => {
        if (username.trim() === '' || username.includes(' ') || username.length <= 3) {
            setUsernameError('사용 불가능한 아이디입니다.');
            setIsDuplicate(null);
            return;
        }

        try {
            const response = await fetch('/checkdupid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username }),
            });

            const responseData = await response.json();
            setIsDuplicate(responseData); // assuming responseData contains isDuplicate
            setUsernameError(responseData ? '중복된 아이디입니다.' : '사용 가능한 아이디입니다.');
        } catch (error) {
            console.error('Error:', error);
            setUsernameError('아이디 중복 확인 중 오류가 발생했습니다.');
        }
    };

    const handleSubmit = (e) => {
        if (isDuplicate === true || isDuplicate === null) {
            e.preventDefault();
            alert('아이디 중복확인을 해주세요.');
        }
    };

    return (
        <div className="Join">
            <nav>
                <ul>
                    <li><a href="#">HOME</a></li>
                </ul>
            </nav>
            <div className="join-box">
                <h2 className="join-title">회원가입</h2>
                <form className="join-input-box" action="/joinProc" method="get" name="joinForm" onSubmit={handleSubmit}>
                        <div className="join-input-group">
                        <input
                            className="join-input"
                            type="text"
                            name="username"
                            placeholder="아이디"
                            value={username}
                            onChange={(e) => setUsername1(e.target.value)}
                            readOnly={isDuplicate === false}
                        />
                        <button className="checkIdButton" type="button" onClick={checkDupId}>중복확인</button>
                        </div>
                        {usernameError && (
                            <p className="checkIdMessage"
                               style={{
                                   color: usernameError === '사용 가능한 아이디입니다.' ? 'green' : 'red',
                               }}
                            >
                                {usernameError}
                            </p>
                        )}

                        <input
                            className="join-input"
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword1(e.target.value)}
                        />
                        <input
                            className="join-input"
                            type="password"
                            placeholder="비밀번호 확인"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <input
                            className="join-input"
                            type="text"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="join-input"
                            type="text"
                            placeholder="전화번호"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    <div className="button-group">
                    <button className="form-button" type="submit">회원가입</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Join;
