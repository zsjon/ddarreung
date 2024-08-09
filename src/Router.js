import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from "./MainPage";

const Router = () => {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route path='/' element={<MainPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;