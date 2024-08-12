import React, { useState, useEffect } from "react";
import axios from "axios";
import './css/Login.css';
import {Link} from "react-router-dom";
// import axiosInstance from "/axiosInstance";

const Login = () => {
    const [loginInput, setLoginInput] = useState({
        userId: "",
        password: "",
    });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleInputChange = (e) => {
        setLoginInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };


    // useEffect(() => {
    //     axios.post('/login')
    //         .then((res) => {
    //             setHello(res.data);
    //         })
    // }, []);

    // const onLogin = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const res = await axiosInstance.post(`/com/login`, {
    //             userId: loginInput.userId,
    //             password: loginInput.password,
    //         });
    //         if (res.status === 200) {
    //             console.log(res.data);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // handleSubmit = (event) => {
    //     event.preventDefault()
    //     if(!this.state.errcount) {
    //         const data = new FormData(this.form)
    //         fetch(this.form.action, {
    //           method: this.form.method,
    //           body: new URLSearchParams(data)
              
    //         })
    //         .then(v => {
    //             if(v.redirected) window.location = v.url
    //         })
    //         .catch(e => console.warn(e))
    //     }
    // }

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await axios.post("/loginProc", loginInput);
    //         console.log(response.data); // You can handle the response as needed
    //     } catch (error) {
    //         console.error("Error:", error);
    //     }
    // };

    return (
        <div className="Login">
        <nav>
          <ul>
            <li><a href="#">HOME</a></li>
          </ul>
        </nav>
        <div className="content">
            <div className="login-box">
                <h2 className="login-title">로그인</h2>
                <form className="login-input-box" action="/loginProc" method="post" name="loginForm">
                    <input
                        className="login-input"
                        type="text"
                        name="username"
                        placeholder="아이디"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="login-input"
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/*<input type="submit" className="form-button" value="로그인"/>*/}
                    <button type="submit" className="form-button">로그인</button>

                </form>
                <div className="login-bottom-button-group">
                    <Link type="button" className="form-button" to="/join">회원가입</Link>
                    <Link type="button" className="form-button" to="/join">아이디 찾기</Link>
                    <Link type="button" className="form-button" to="/join">비밀번호 찾기</Link>
                </div>

            </div>
        </div>
        </div>

    );
};

// <span>id : </span><input type="text" name="username" required />
// <span>password : </span><input type="password" name="password" required/>
export default Login;