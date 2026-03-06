import React from 'react';

const Enemy = ({ position, isExploding }) => {
  return (
    <div
      className={`enemy ${isExploding ? 'exploding' : ''}`}
      style={{ left: `${position.x}%` }}
    >
      👾
    </div>
  );
};

export default Enemy;
