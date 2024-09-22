import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Selected_park from "./selected_park";
import MainPage_park from "./mainPage_park";

const Router = () => {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route path='/' element={<MainPage_park />} /> {/* 첫 시작 페이지 */}
                <Route path="/park/:parkName" element={<Selected_park />} /> {/* MainPage의 리스트에서 공원 이름 클릭 시 */}
            </Routes>
        </BrowserRouter>
    );
};

export default Router;