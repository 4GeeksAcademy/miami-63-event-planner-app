import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { BackendURL } from "./component/backendURL";

import { HomePage } from "./pages/homePage";
import { Favorites } from "./pages/favorites";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ForgotPassword } from "./pages/forgotPassword";
import { PasswordChange } from "./pages/passwordChange";

import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";

const Layout = () => {
    // The basename is used when your project is published in a subdirectory
    const basename = process.env.BASENAME || "";

    // Uncomment if you need to ensure BACKEND_URL is set
    // if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/homePage" element={<HomePage />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgotPassword" element={<ForgotPassword />} />
                    <Route path="/passwordChange" element={<PasswordChange />} />
                    <Route path="*" element={<Navigate to="/homePage" replace />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);