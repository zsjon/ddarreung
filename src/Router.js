import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Selected_park from "./selected_park";
import MainPage_park from "./mainPage_park";

const Router = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<MainPage_park />} /> {/* 첫 시작 페이지 */}
                <Route path="/park/:parkName" element={<Selected_park />} /> {/* MainPage의 리스트에서 공원 이름 클릭 시 */}
            </Routes>
        </HashRouter>
    );
};

export default Router;