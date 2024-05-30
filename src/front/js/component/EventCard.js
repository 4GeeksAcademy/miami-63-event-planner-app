import React from 'react';
import TinderCard from 'react-tinder-card';

const EventCard = ({ event, onSwipe }) => {
    return (
        <TinderCard
            className="swipe"
            onSwipe={(dir) => onSwipe(dir, event)}
            preventSwipe={['up', 'down']}
        >
            <div
                style={{ backgroundImage: `url(${event.imageURL})` }}
                className="card"
            >
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>{event.location}</p>
                <p>{`Starts: ${new Date(event.startTime).toLocaleString()}`}</p>
                {event.endTime && <p>{`Ends: ${new Date(event.endTime).toLocaleString()}`}</p>}
            </div>
        </TinderCard>
    );
};

export default EventCard;
