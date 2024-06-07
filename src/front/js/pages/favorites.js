import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/favorites.css";

export const Favorites = () => {
	const { store, actions } = useContext(Context);
	const [favorites, setFavorites] = useState({});

	useEffect(
		async () => {
			data = await actions.data("favorites");
			setFavorites(data);
		}
		, [store.events]);

	if (Object.keys(favorites).length === 0) {
		return (
			<div className="notReady">
				<p>Loading...</p>
			</div>
		)
	}

	if (favorites.ok === false) {
		return (
			<div className="notReady">
				<p>${favorites.msg}</p>
				{favorites.msg === "Not logged in." && <Link to="/login" className="register-link">Log in</Link>}
			</div>
		)
	}

	if (favorites.payload.length === 0) {
		return (
			<div className="notReady">
				<p>No favorites yet</p>
			</div>
		)
	}

	return (
		<div className="text-center mt-5">
			<h1>Hello PinIT!!</h1>
			<p>
				<img src={PinITLogo} />
			</p>
			<div className="alert alert-info">
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>
			<p>
				This boilerplate comes with lots of documentation:{" "}
				<a href="https://start.4geeksacademy.com/starters/react-flask">
					Read documentation
				</a>
			</p>
		</div>
	);
};
