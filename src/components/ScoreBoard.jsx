import React from 'react';

const ScoreBoard = ({ score, combo }) => {
  return (
    <div className="score-board">
      <div>SCORE</div>
      <div className="score-value">{score}</div>
      {combo > 0 && <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>🔥 Combo: {combo}</div>}
    </div>
  );
};

export default ScoreBoard;
