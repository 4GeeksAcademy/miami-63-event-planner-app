import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import PinITLogo from "../../img/PinIT-logo low-res.png";
import "../../styles/login.css";
import { Link } from "react-router-dom";

export const Login = () => {
	const { store, actions } = useContext(Context);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		actions.login(email, password);
	};

	return (
		<div>
			<div className="login-container">
				<header>
					<img src={PinITLogo} alt="PinIT Logo" />
					<div className="main-text">
						<h1>Discover unforgettable experiences near you</h1>
						<p> Tailored just for you!</p>
					</div>
				</header>
				<div className="wrapper">
					<div className="form-box login">
						<h2>Log in</h2>
						<form onSubmit={handleSubmit}>
							<div className="input-box">
								<span className="icon"><ion-icon name="mail-outline"></ion-icon></span>
								<input type="text" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
								<label>Email</label>
							</div>
							<div className="input-box">
								<span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
								<input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
								<label>Password</label>
							</div>
							<button type="submit" className="btn">Log in</button>
							<div className="login-register" style={{ display: "flex" }}>
								<p>Don't have an account?</p>
								<Link to="/register" className="register-link">Register</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};