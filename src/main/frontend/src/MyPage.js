import React, { useState } from "react";
import './css/MyPage.css';

const MyPage = () => {
    return (
        <div className="my-page-container">
            <div className="my-page-title">마이페이지</div>
            <div className="profile-container">
                <div className="profile-image"></div>
                <div className="username">ooo님</div>
            </div>
            <div className="mp-id">
                <div className="mp-id-1">아이디 :</div>  <div className="mp-id-2"> my id</div>
            </div>
            <div className="mp-ps">
                <div className="mp-ps-1">비밀번호 : </div> <div className="mp-ps-2">내비밀번호</div>
                <button className="ps-bt">비밀번호 변경</button>
            </div>
            <div className="mp-em">
                <div>이메일 :</div><div> 내 이메일</div>
                <button>이메일 변경</button>
            </div>
            <div>
                전화번호: 내 전화번호
                <button>전화번호 변경</button>
            </div>
        </div>
    );
}

export default MyPage;
