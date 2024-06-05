// src/Card.js
import React, { useState } from 'react';
import '../../styles/card.css';

const Card = ({ content }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    setInitialPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({ x: e.clientX - initialPosition.x, y: e.clientY - initialPosition.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(position.x) > 100) {
      // Here you can handle the swipe (left or right)
      console.log(position.x > 0 ? 'Swiped right' : 'Swiped left');
    }
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      className="card"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {content}
    </div>
  );
};

export default Card;