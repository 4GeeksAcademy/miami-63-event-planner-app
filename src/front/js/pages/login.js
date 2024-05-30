import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import PinITLogo from "../../img/PinIT-logo low-res.png;"
import "../../styles/login.css";

export const Login = () => {
	const { store, actions } = useContext(Context);

	return (
		<div>
			<div className="login-container">
				<header>
					<img src="logo.png" />
					<div className="main-text">
						<h1>Discover unforgettable experiences near you</h1>
						<p> Tailored just for you!</p>
					</div>
				</header>
				<div className="wrapper">
					<div className="form-box login">
						<h2>Log in</h2>
						<form action="#">
							<div className="input-box">
								<span className="icon"><i className="bi bi-envelope"></i></span>
								<input type="email" required />
								<label>Email</label>
							</div>
							<div className="input-box">
								<span className="icon"><i className="bi bi-lock"></i></span>
								<input type="password" required />
								<label>Password</label>
							</div>
							<div className="remember-forgot">
								<label>
									<input type="checkbox" /> Remember me</label>
								<a href="#">Forgot Password?</a>
							</div>
							<button type="submit" className="btn">Log in</button>
							<div className="login-register">
								<p>Don't have an account? <a href="/register.html" className="register-link">Register</a></p>
							</div>
						</form>
					</div>
				</div>
			</div>
   		</div>

	);
};
