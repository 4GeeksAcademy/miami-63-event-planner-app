import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
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
  justify-content: flex-end;
  align-items: center;
  padding: 20px;
  margin: 10px;
  background-size: cover;
  background-position: center;
  position: absolute;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  h3, p {
    margin: 10px 0;
  }
`;

const swipeVariants = {
  enter: { x: "100%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitLeft: { x: "-100%", opacity: 0, transition: { duration: 0.5 } },
  exitRight: { x: "100%", opacity: 0, transition: { duration: 0.5 } }
};

const CardsElement = ({ events }) => {
  const { store, actions } = useContext(Context);
  const [currentIndex, setCurrentIndex] = useState(parseInt(store.currentIndex, 10) || 0);
  const [exitVariant, setExitVariant] = useState("");
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);

  const currentEvent = events[currentIndex];
  const nextEvent = events[(currentIndex + 1) % events.length];

  useEffect(() => {
    setCurrentIndex(parseInt(store.currentIndex, 10) || 0);
  }, [store.currentIndex]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      setExitVariant("exitRight");
      actions.swipe("right", currentEvent);
      setCurrentIndex((currentIndex + 1) % events.length);
    } else if (info.offset.x < -100) {
      setExitVariant("exitLeft");
      actions.swipe("left", currentEvent);
      setCurrentIndex((currentIndex + 1) % events.length);
    }
  };

  return (
    <div style={{ position: "relative", width: "300px", height: "400px" }}>
      <AnimatePresence initial={false}>
        {currentEvent && (
          <StyledCard
            key={currentEvent.id}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit={exitVariant}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x, rotate, backgroundImage: `url(${currentEvent?.imageURL})`, zIndex: 1 }}
            onDragEnd={handleDragEnd}
            whileTap={{ scale: 1.05 }}
          >
            {currentEvent.title && <h3>{currentEvent.title}</h3>}
            {currentEvent.startTime && currentEvent.endTime && (
              <p>{currentEvent.startTime} - {currentEvent.endTime}</p>
            )}
            {currentEvent.description && <p>{currentEvent.description}</p>}
            {currentEvent.location && <p>{currentEvent.location}</p>}
          </StyledCard>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {nextEvent && (
          <StyledCard
            key={nextEvent.id}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            style={{ backgroundImage: `url(${nextEvent?.imageURL})`, zIndex: 0 }}
          >
            {nextEvent.title && <h3>{nextEvent.title}</h3>}
            {nextEvent.startTime && nextEvent.endTime && (
              <p>{nextEvent.startTime} - {nextEvent.endTime}</p>
            )}
            {nextEvent.description && <p>{nextEvent.description}</p>}
            {nextEvent.location && <p>{nextEvent.location}</p>}
          </StyledCard>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardsElement;