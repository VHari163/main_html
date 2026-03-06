import React from 'react';

const GameOver = ({ score, onPlayAgain }) => {
  return (
    <div className="game-over">
      <h1>GAME OVER</h1>
      <div className="final-score">
        Final Score: <span>{score}</span>
      </div>
      <button className="play-again-btn" onClick={onPlayAgain}>
        🎮 Play Again
      </button>
    </div>
  );
};

export default GameOver;
