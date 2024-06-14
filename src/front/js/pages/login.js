import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import PinITLogo from "../../img/PinIT-logo low-res.png";
import "../../styles/login.css";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
	const { store, actions } = useContext(Context);

	const navigate = useNavigate();
	const [problem, setProblem] = useState(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await actions.login(email, password);
		if (result.ok) {
			console.log('From login.js: login successful');
			setProblem(null);
			navigate('/homePage');
		} else {
			console.log(`From login.js: Error: ${result.msg}`);
			setProblem(`${result.msg}`);
		}
	};

	return (
		<div className="frame">
			<div className="login-container">
				<header>
					<img src={PinITLogo} alt="PinIT Logo" />
					<div className="main-text">
						<h1>Discover unforgettable experiences near you</h1>
						<p> Tailored just for you!</p>
					</div>
				</header>
				<div className="card">
					<div className="form-box">
						<h2>Log in</h2>
						<form onSubmit={handleSubmit}>
							<div className="input-box">
								<span className="icon"><i className="bi bi-envelope"></i></span>
								<input type="text" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
								<label>Email</label>
							</div>
							<div className="input-box">
								<span className="icon"><i className="bi bi-lock"></i></span>
								<input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
								<label>Password</label>
							</div>
							<button type="submit" className="btn">Log in</button>
							<div className="login-register" style={{ display: "flex" }}>
								<p>Don't have an account?</p>
								<Link to="/register" className="register-link">Register</Link>
							</div>
							<div className="login-register" style={{ display: "flex" }}>
								<p>Forgot password?</p>
								<Link to="/forgotPassword" className="register-link">Reset Password</Link>
							</div>
						</form>
					</div>
					{problem && <p className="problem">{problem}</p>}
				</div>
			</div>
		</div>
	);
};