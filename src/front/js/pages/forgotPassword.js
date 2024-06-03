import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import PinITLogo from "../../img/PinIT-logo low-res.png;"
import "../../styles/forgotPassword.css";

const ForgotPassword = () => {
    const { store, actions } = useContext(Context);
    return (
        <div>
            <header>
                <a href="/login.html">
                    <img src="logo.png" alt="Logo" />
                </a>
            </header>
            <div className="wrapper">
                <div className="form-box login">
                    <h2>Forgot password?</h2>
                    <h3>Enter your email and we will send you a link to get back into your account.</h3>
                    <form action="#">
                        <div className="input-box">
                            <span className="icon"><i className="bi bi-envelope"></i></span>
                            <input type="email" required />
                            <label>Email</label>
                        </div>
                        <button type="submit" className="btn">Send email</button>
                        <div className="login-register">
                            <p>Don't have an account? <a href="/register.html" className="register-link">Register</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;