import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BackendURL } from "./component/backendURL";

import { HomePage } from "./pages/homePage";
import { Favorites } from "./pages/favorites";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ForgotPassword } from "./pages/forgotPassword";
import { PasswordChange } from "./pages/passwordChange";

import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                    <Navbar />
                    <Routes>
                        <Route element={<Login />} path="/login" /> 
                        <Route element={<HomePage />} path="/homePage" />
                        <Route element={<Favorites />} path="/favorites" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<ForgotPassword />} path="/forgotPassword" />
                        <Route element={<PasswordChange />} path="/passwordChange" />
                        <Route element={<Navigate to="/login" replace />} path="*" />
                    </Routes>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
