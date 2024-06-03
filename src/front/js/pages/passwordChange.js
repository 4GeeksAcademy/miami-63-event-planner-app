import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import PinITLogo from "../../img/PinIT-logo low-res.png;"
import "../../styles/passwordChange.css";

export const PasswordChange = () => {
	const { store, actions } = useContext(Context);

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
			  <form action="#">
				<div className="input-box">
				  <span className="icon"><IonIcon name="mail-outline" /></span>
				  <input type="password" required />
				  <label>New Password</label>
				</div>
				<div className="input-box">
				  <span className="icon"><IonIcon name="lock-closed-outline" /></span>
				  <input type="password" required />
				  <label>Confirm New Password</label>
				</div>
				<button type="submit" className="btn">Log in</button>
			  </form>
			</div>
		  </div>
		</body>
	  );
	};
	
	export default ChangePassword;
