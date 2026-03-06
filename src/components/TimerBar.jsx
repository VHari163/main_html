import React from 'react';

const TimerBar = ({ timeLeft, maxTime }) => {
  const percentage = (timeLeft / maxTime) * 100;
  const isDanger = timeLeft <= 3;

  return (
    <div className="timer-bar">
      <div className="timer-container">
        <div
          className={`timer-fill ${isDanger ? 'danger' : ''}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="timer-text">{timeLeft}s</div>
    </div>
  );
};

export default TimerBar;
