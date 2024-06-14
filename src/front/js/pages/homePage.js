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
            console.log(`From homePage.js: local variable events set`)
        };
        fetchData();
    }, [store.events]);

    if (events.length === 0) {
        return (
            <div className="frame">
                <h1>Loading...</h1>
            </div>
        );
    }

    if (events.ok === false) {
        return (
            <div className="frame">
                <h1>{events.msg}</h1>
                {events.msg === "Not logged in." && <Link to="/login" className="register-link">Log in</Link>}
            </div>
        );
    }

    console.log(`From homePage.js: This are the events:`)
    console.log(events)

    return (
        <div className="frame">
            <h1>Let's swipe your plans off their feet!</h1>
            <CardsElement events={events.payload} />
        </div>
    );
};