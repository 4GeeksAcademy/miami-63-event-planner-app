import React, { useContext } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Context } from "../store/appContext";

// Styled motion.div component for the card
const StyledCard = styled(motion.div)`
  width: 300px;
  height: 400px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: 10px;
  background-size: cover;
  background-position: center;
  position: absolute;
`;

const CardsElement = ({ events }) => {
  const { store, actions } = useContext(Context);
  const currentEvent = events[store.currentIndex];
  const nextEvent = events[store.currentIndex + 1];

  return (
    <div style={{ position: "relative", width: "300px", height: "400px" }}>
      {nextEvent && (
        <StyledCard
          style={{ backgroundImage: `url(${nextEvent.imageURL})`, zIndex: 0 }}
        >
          <h3>{nextEvent.title}</h3>
          <p>{nextEvent.startTime} - {nextEvent.endTime}</p>
          <p>{nextEvent.description}</p>
          <p>{nextEvent.location}</p>
        </StyledCard>
      )}
      {currentEvent && (
        <StyledCard
          drag
          dragConstraints={{ left: -300, right: 300, top: 0, bottom: 0 }}
          onDragEnd={(event, info) => {
            if (info.offset.x > 100) {
              actions.swipe("right", currentEvent);
            } else if (info.offset.x < -100) {
              actions.swipe("left", currentEvent);
            }
          }}
          whileTap={{ scale: 1.1 }}
          style={{ backgroundImage: `url(${currentEvent.imageURL})`, zIndex: 1 }}
        >
          <h3>{currentEvent.title}</h3>
          <p>{currentEvent.startTime} - {currentEvent.endTime}</p>
          <p>{currentEvent.description}</p>
          <p>{currentEvent.location}</p>
        </StyledCard>
      )}
    </div>
  );
};

export default CardsElement;