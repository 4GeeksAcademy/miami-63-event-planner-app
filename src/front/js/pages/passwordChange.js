import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom"
import { Context } from "../store/appContext";
import PinITLogo from "../../img/PinIT-logo low-res.png";
import "../../styles/passwordChange.css";

export const PasswordChange = () => {
//	const { store, actions } = useContext(Context);

	
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [token, setToken] = useState("");
	const [problem, setProblem] = useState(null);
	const location = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const tokenParam = params.get("token");
		setToken(tokenParam);
	}, [location]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (newPassword === confirmPassword) {
			const result = await fetch("https://your-backend-endpoint.com/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ new_password =  }),
			});
			if (result.ok) {
				console.log('From passwordChange.js: user created successfully');
				setProblem(null);
				navigate('/login');
			} else {
				console.log(`From passwordChange.js: Error: ${result.msg}`);
				setProblem(`Error: ${result.msg}`);
			}
		} else {
			console.log("From passwordChange.js: Passwords do not match");
			setProblem(`Error: Passwords do not match`);
		}
	  };

		return (
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
			  {problem && <p className="problem">{problem}</p>}
			</div>
		);
	  };
	