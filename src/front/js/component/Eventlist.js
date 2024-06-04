import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import { useFlux } from '../flux';

const EventList = () => {
    const { state, dispatch } = useFlux();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Fetch events from API
        fetch('/api/events')
            .then(response => response.json())
            .then(data => setEvents(data));
    }, []);

    const onSwipe = (direction, event) => {
        if (direction === 'right') {
            // Show options to book or save event
            const shouldSave = window.confirm('Save this event to favorites?');
            if (shouldSave) {
                dispatch({ type: 'ADD_FAVORITE', payload: event });
            }
        }
        // Remove event from list
        setEvents(events.filter(e => e.id !== event.id));
    };

    return (
        <div className="event-list">
            {events.length > 0 ? (
                events.map(event => (
                    <EventCard key={event.id} event={event} onSwipe={onSwipe} />
                ))
            ) : (
                <p>No more events</p>
            )}
        </div>
    );
};

export default EventList;
