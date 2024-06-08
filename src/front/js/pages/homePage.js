import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import CardsElement from "../component/cardsElement";
import "../../styles/homePage.css";
import { Link } from "react-router-dom";

export const HomePage = () => {
    const { store, actions } = useContext(Context);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await actions.data("events");
            setEvents(data);
        };
        fetchData();
    }, [store.events]);

    if (events.length === 0) {
        return (
            <div className="notReady">
                <p>Loading...</p>
            </div>
        );
    }

    if (events.ok === false) {
        return (
            <div className="notReady">
                <p>{events.msg}</p>
                {events.msg === "Not logged in." && <Link to="/login" className="register-link">Log in</Link>}
            </div>
        );
    }

    return (
        <div>
            <h1>Event Cards</h1>
            <CardsElement events={events} />
        </div>
    );
};