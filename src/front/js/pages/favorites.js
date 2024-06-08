import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/favorites.css";

export const Favorites = () => {
	const { store, actions } = useContext(Context);
	const [favorites, setFavorites] = useState({});

	useEffect(() => {
        const fetchData = async () => {
            const data = await actions.data("favorites");
            setFavorites(data);
            console.log(`From favorites.js: local variable favorites set`)
        };
        fetchData();
    }, []);

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

    const handleDelete = (id) => {
        actions.data("delete", { id });
    };

    return (
        <div className="favorites-page">
            <h1>Favorite Events</h1>
            <ul className="favorites-list">
                {favorites.map(favorite => (
                    <li key={favorite.id} className="favorite-item">
                        <div className="favorite-banner">
                            <h3>{favorite.title}</h3>
                            <p>{favorite.startTime} - {favorite.endTime}</p>
                            <p>{favorite.description}</p>
                            <p>{favorite.location}</p>
                            <div className="favorite-buttons">
                                <a href="#" className="add-to-calendar">Add to Calendar</a>
                                <button onClick={() => handleDelete(favorite.id)} className="delete-button">Delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
