import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Context } from "../store/appContext";
import { format } from "date-fns";

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
  
  let currentEvent = events[currentIndex];
  let nextEvent = events[(currentIndex + 1) % events.length];

  const trimer = (text) => {
    let place = -1;
    for(let i = 0; i < text.length && i < 499; i++) {
      if (text[i] === ".") {
        place = i;
      }
    }
    return place === -1 ? text.slice(0, 499) : text.slice(0, place + 1);
  };

  if(currentEvent && nextEvent) {
    currentEvent.description = currentEvent.description ? trimer(currentEvent.description) : "";
    nextEvent.description = nextEvent.description ? trimer(nextEvent.description) : "";
  }

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
      actions.swipe("left");
      setCurrentIndex((currentIndex + 1) % events.length);
    }
  };

  return (
    <div style={{ position: "relative", width: "400px", height: "600px" }}> {/* Adjusted size for bigger display */}
      <AnimatePresence initial={false}>
        {currentEvent && (
          <motion.div
            className="home-card"
            key={currentEvent.id}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit={exitVariant}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x, rotate, backgroundImage: `url(${currentEvent.imageURL})`, zIndex: 1 }}
            onDragEnd={handleDragEnd}
            whileTap={{ scale: 1.05 }}
          >
            {currentEvent.title && <h3>{currentEvent.title}</h3>}
            {currentEvent.startTime && (
              <p>{format(new Date(currentEvent.startTime), 'MMMM d, yyyy h:mm a')}</p> // Better date formatting
            )}
            {currentEvent.description && <p>{currentEvent.description}</p>}
            {currentEvent.location && <p>{currentEvent.location}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {nextEvent && (
          <motion.div
            className="home-card"
            key={nextEvent.id}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            style={{ backgroundImage: `url(${nextEvent.imageURL})`, zIndex: 0 }}
          >
            {nextEvent.title && <h3>{nextEvent.title}</h3>}
            {nextEvent.startTime && (
              <p>{format(new Date(nextEvent.startTime), 'MMMM d, yyyy h:mm a')}</p> // Better date formatting
            )}
            {nextEvent.description && <p>{nextEvent.description}</p>}
            {nextEvent.location && <p>{nextEvent.location}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardsElement;
