import React from 'react';

const Player = ({ isShooting, position = 50 }) => {
  return (
    <div 
      className={`player ${isShooting ? 'shooting' : ''}`}
      style={{ left: `${position}%` }}
    >
      🚀
    </div>
  );
  };

export default Player;
