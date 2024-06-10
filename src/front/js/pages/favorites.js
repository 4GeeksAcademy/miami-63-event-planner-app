import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/favorites.css";
import { Link } from "react-router-dom";

export const Favorites = () => {
    const { store, actions } = useContext(Context);
    const [favorites, setFavorites] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await actions.data("favorites");
            setFavorites(data);
            console.log(`From favorites.js: local variable favorites set`);
        };
        fetchData();
    }, []);

    if (favorites === null) {
        return (
            <div className="frame">
                <p>Loading...</p>
            </div>
        );
    }

    if (favorites.ok === false) {
        return (
            <div className="frame">
                <p>{favorites.msg}</p>
                {favorites.msg === "Not logged in." && <Link to="/login" className="register-link">Log in</Link>}
            </div>
        );
    }

    if (favorites.payload.length === 0) {
        return (
            <div className="frame">
                <p>No favorites yet</p>
            </div>
        );
    }

    const handleDelete = async (id) => {
        const data = await actions.data("delete", { id });
        setFavorites(data);
        console.log(`From favorites.js: local variable favorites set after deletion`);
    };

    const generateGoogleCalendarLink = (event) => {
        const { title, startTime, description, location } = event;
        const start = new Date(startTime);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour to start time

        const formattedStartTime = start.toISOString().replace(/-|:|\.\d+/g, '');
        const formattedEndTime = end.toISOString().replace(/-|:|\.\d+/g, '');

        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formattedStartTime}/${formattedEndTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

        return googleCalendarUrl;
    };

    console.log(`From favorites.js: These are the favorites:`);
    console.log(favorites.payload);

    return (
        <div className="frame">
            <h1>Favorite Events</h1>
            <ul className="favorites-list">
                {favorites.payload.map(favorite => (
                    <li key={favorite.id} className="favorite-item">
                        <div className="favorite-banner">
                            <h3>{favorite.title}</h3>
                            <p>{favorite.startTime} - {new Date(new Date(favorite.startTime).getTime() + 60 * 60 * 1000).toISOString()}</p>
                            <p>{favorite.description}</p>
                            <p>{favorite.location}</p>
                            <div className="favorite-buttons">
                                <a className="add-to-calendar" href={generateGoogleCalendarLink(favorite)} target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-calendar-plus"></i>
                                </a>
                                <button onClick={() => handleDelete(favorite.id)} className="delete-button">X</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};