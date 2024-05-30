import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import PinITLogo from "../../img/PinIT-logo low-res.png;"
import "../../styles/register.css";

export const Register = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="wrapper">
			<div className="form-box register">
				<h2>Register</h2>
				<form action="#">
					<div className="input-box">
						<span className="icon"><ion-icon name="mail-outline"></ion-icon></span>
						<input type="text" required />
						<label>Email</label>
					</div>
					<div className="input-box">
						<span className="icon"><ion-icon name="navigate-outline"></ion-icon></span>
						<input type="email" required />
						<label>Address</label>
					</div>
					<div className="input-box">
						<span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
						<input type="password" required />
						<label>Password</label>
					</div>
					<button type="submit" className="btn">Register</button>
					<div className="login-register">
						<p>Already have an account? <a href="/login.html" className="register-link">Log in</a></p>
					</div>
				</form>
			</div>
    	</div>

	);
};
