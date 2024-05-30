import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import PinITLogo from "../../img/PinIT-logo low-res.png;"
import "../../styles/favorites.css";

export const Favorites = () => {
	const { store, actions } = useContext(Context);

	return (
	<nav class="navbar">
		<img src={PinITLogo} class="navbar-logo" alt="logo" />
		<ul class="navbar-list">
		
		</ul>

		<div class="profile-dropdown">
			<div onclick="toggle()" class="profile-dropdown-btn">
				<div class="profile-img">
					<i>  <ion-icon name="ellipse"></ion-icon></i>
				</div>

				<span
					>Michel R.
					<i class="fa-solid fa-angle-down"></i>
				</span>
			</div>

			<ul class="profile-dropdown-list">

				<li class="profile-dropdown-list-item">
					<a href="favorites.html">
						<i><ion-icon name="heart-outline"></ion-icon> </i>
						Favorites
					</a>
				</li>

				<li class="profile-dropdown-list-item">
					<a href="#">
					<i><ion-icon name="settings-outline"></ion-icon></i>
					Settings
					</a>
				</li>
				<hr />

				<li class="profile-dropdown-list-item">
					<a href="#">
						<i> <ion-icon name="log-out-outline"></ion-icon></i>
					Sign out
					</a>
				</li>
			</ul>
		</div>
    </nav>
	);
};
