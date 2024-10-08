import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // App.css 가져오기

const StartPage_admin = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div id="admin-container">
            {/* 로고 부분 */}
            <img src={`${process.env.PUBLIC_URL}/seoul.png`} alt="Logo" className="admin-logo" />

            {/* 관리자 페이지 타이틀 */}
            <h1 className="admin-title">관리자 페이지</h1>

            {/* 버튼 컨테이너 */}
            <div className="button-container">
                {/* 유실물 파악 버튼 */}
                <button
                    className="admin-btn-lost"
                    onClick={() => handleNavigate('/park-lost')}
                >
                    유실 따릉이 파악
                </button>

                {/* 혼잡도 파악 버튼 */}
                <button
                    className="admin-btn-congestion"
                    onClick={() => handleNavigate('/park-congestion')}
                >
                    혼잡도 파악
                </button>
            </div>

            {/* 저작권 하단 부분 */}
            <div id="admin-copyright">
                © 2024 C.L.U.E. Service. All rights reserved.
            </div>
        </div>
    );
};

export default StartPage_admin;
