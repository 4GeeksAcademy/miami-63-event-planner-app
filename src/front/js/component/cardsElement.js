import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Context } from "../store/appContext";
import { format } from "date-fns";

const swipeThreshold = window.innerWidth * 0.2;

const CardsElement = ({ events }) => {
  const { store, actions } = useContext(Context);
  const [currentIndex, setCurrentIndex] = useState(parseInt(store.currentIndex, 10) || 0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [zIndex, setZIndex] = useState(1);

  const currentEvent = events[currentIndex];
  const nextEvent = events[(currentIndex + 1) % events.length];

  const trimmer = (text) => {
    let place = -1;
    for (let i = 0; i < text.length && i < 250; i++) {
      if (text[i] === ".") {
        place = i;
      }
    }
    return place === -1 ? text.slice(0, 250) : text.slice(0, place + 1);
  };

  useEffect(() => {
    setCurrentIndex(parseInt(store.currentIndex, 10) || 0);
  }, [store.currentIndex]);

  const handleDragEnd = (event, info) => {
    if (!isSwiping) {
      if (info.offset.x > swipeThreshold) {
        setSwipeDirection("right");
        setIsSwiping(true);
        setZIndex(-1);
        handleSwipe("right", currentEvent);
      } else if (info.offset.x < -swipeThreshold) {
        setSwipeDirection("left");
        setIsSwiping(true);
        setZIndex(-1);
        handleSwipe("left", currentEvent);
      } else {
        setIsSwiping(false);
      }
    }
  };

  const handleSwipe = (direction, event) => {
    setTimeout(() => {
      actions.swipe(direction, event);
      setCurrentIndex((currentIndex + 1) % events.length);
      setIsSwiping(false);
      setZIndex(1);
    }, 750); // Adjust delay as needed
  };

  return (
    <div className="cards-element" style={{ position: "relative", height: "100%" }}>
      <AnimatePresence initial={false}>
        {currentEvent && (
          <motion.div
            className="home-card"
            key={currentEvent.id}
            initial="center"
            animate="center"
            exit={isSwiping ? (swipeDirection === "right" ? "exitRight" : "exitLeft") : "swipeBack"}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileTap={{ scale: 1.05 }}
            style={{ 
              backgroundImage: `url(${currentEvent.imageURL})`,
              zIndex: zIndex 
            }}
          >
            <div className="home-card-text">
              {currentEvent.title && <h2>{currentEvent.title}</h2>}
              {currentEvent.startTime && (
                <h5>{format(new Date(currentEvent.startTime), 'MMMM d, yyyy h:mm a')}</h5>
              )}
              {currentEvent.description && <p>{trimmer(currentEvent.description)}</p>}
              {currentEvent.location && <h5>{currentEvent.location}</h5>}
              {currentEvent.address && <p>{currentEvent.address}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {nextEvent && (
        <motion.div
          className="home-card"
          style={{ 
            backgroundImage: `url(${nextEvent.imageURL})`,
            zIndex: 0, 
            position: "absolute", 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0 
          }}
        >
          <div className="home-card-text">
            {nextEvent.title && <h2>{nextEvent.title}</h2>}
            {nextEvent.startTime && (
              <h5>{format(new Date(nextEvent.startTime), 'MMMM d, yyyy h:mm a')}</h5>
            )}
            {nextEvent.description && <p>{trimmer(nextEvent.description)}</p>}
            {nextEvent.location && <h5>{nextEvent.location}</h5>}
            {nextEvent.address && <p>{nextEvent.address}</p>}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CardsElement;

//timeout