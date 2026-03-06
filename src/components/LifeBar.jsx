import React from 'react';

const LifeBar = ({ lives }) => {
  return (
    <div className="life-bar">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className={`life ${index >= lives ? 'lost' : ''}`}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

export default LifeBar;
