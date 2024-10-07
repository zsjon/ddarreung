import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Selected_park_Lost from "./Page/selected_park_Lost";
import MainPage_lost from "./Page/mainPage_lost";
import StartPage_admin from "./Page/startPage_admin";
import MainPage_congestion from "./Page/mainPage_congestion";
import Selected_park_Congestion from "./Page/selected_park_Congestion";

const Router = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<StartPage_admin />} /> {/* 첫 시작 페이지 */}
                <Route path='/park-congestion' element={<MainPage_congestion />} /> {/* 혼잡도 분석 페이지 */}
                <Route path="/park-congestion/:parkName" element={<Selected_park_Congestion />} /> {/* MainPage의 리스트에서 공원 이름 클릭 시 */}
                <Route path='/park-lost' element={<MainPage_lost />} /> {/* 유실물 탐지 페이지 */}
                <Route path="/park-lost/:parkName" element={<Selected_park_Lost />} /> {/* MainPage의 리스트에서 공원 이름 클릭 시 */}
            </Routes>
        </HashRouter>
    );
};

export default Router;