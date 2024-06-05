import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom"
import { Context } from "../store/appContext";
import PinITLogo from "../../img/PinIT-logo low-res.png";
import "../../styles/passwordChange.css";

export const PasswordChange = () => {
	const { store, actions } = useContext(Context);

	
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [token, setToken] = useState("");
	const location = useLocation();
};
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const tokenParam = params.get("token");
		setToken(tokenParam);
	}, [location]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (newPassword === confirmPassword) {
		  actions.changePassword(newPassword, token);
		} else {
		  alert("Passwords do not match");
		}
	  };

	// async function handleSubmit(e) {
	// 	e.preventDefault();
	// 	const response = await fetch("https://your-backend-endpoint.com/submit", {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify({ token, password }),
	// 	});

	// 	if (response.ok) {
	// 		console.log("Password reset successfully");
	// 	} else {
	// 		console.error("Error reseting password");
	// 	}
	// }


	const ChangePassword = () => {
		return (
		  <body>
			<header>
			  <a href="/login.html">
				<img src="logo.png" alt="Logo" />
			  </a>
			</header>
			<div className="wrapper">
			  <div className="form-box login">
				<h2>Change Password</h2>
				<form onSubmit={handleSubmit}>
				  <div className="input-box">
					<span className="icon"><IonIcon name="mail-outline" /></span>
					<input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
					<label>New Password</label>
				  </div>
				  <div className="input-box">
					<span className="icon"><IonIcon name="lock-closed-outline" /></span>
					<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
					<label>Confirm New Password </label>
				  </div>
				  <button type="submit" className="btn">Change Password</button>
				</form>
			  </div>
			</div>
		  </body>
		);
	  };
	