import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/homePage.css";

export const HomePage = () => {
	const { store, actions } = useContext(Context);
	const [events, setEvents] = useState({});

	useEffect(
		async () => {
			data = await actions.data("events");
			setEvents(data);
		}
		, [store.events]);

	if (events.length === 0) {
		return (
			<div className="notReady">
				<p>Loading...</p>
			</div>
		)
	}

	if (events.ok === false) {
		return (
			<div className="notReady">
				<p>${events.msg}</p>
				{events.msg === "Not logged in." && <Link to="/login" className="register-link">Log in</Link>}
			</div>
		)
	}
	

	return (
		<div className="text-center mt-5">
			<h1>Hello PinIT!!</h1>
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
