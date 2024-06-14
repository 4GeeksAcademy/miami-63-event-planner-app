import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { format } from "date-fns";
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
                <h1>Loading...</h1>
            </div>
        );
    }

    if (favorites.ok === false) {
        return (
            <div className="frame">
                <h1>{favorites.msg}</h1>
                {favorites.msg === "Not logged in." && <Link to="/login" className="register-link">Log in</Link>}
            </div>
        );
    }

    if (favorites.payload.length === 0) {
        return (
            <div className="frame">
                <h1>No favorites yet. Let's make some plans!</h1>
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
            <h1>Here are your upcoming great exeriences!</h1>
            <ul className="favorites-list">
                {favorites.payload.map(favorite => (
                    <li key={favorite.id} className="favorite-item">
                        <div className="favorite-image" style={{ backgroundImage: `url(${favorite.imageURL})` }}></div>
                        <div className="favorite-text">
                            <div className="favorite-super-text">
                                <h2>{favorite.title}</h2>
                                <h4>{format(new Date(favorite.startTime), 'MMMM d, yyyy h:mm a')}</h4>
                                <h5>{favorite.description}</h5>
                            </div>
                            <div className="favorite-sub-text">
                                <h5>{favorite.location}</h5>
                                <p>{favorite.address}</p>
                            </div>
                        </div>
                        <div className="favorite-buttons">
                            <button onClick={() => handleDelete(favorite.id)} className="delete-button">X</button>
                            <a className="add-to-calendar" href={generateGoogleCalendarLink(favorite)} target="_blank" rel="noopener noreferrer">
                                <i className="bi bi-calendar-plus"></i>
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};