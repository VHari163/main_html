import React from 'react';

const Bullet = ({ isActive }) => {
  return (
    <div className={`bullet ${isActive ? 'active' : ''}`}>
      💫
    </div>
  );
};

export default Bullet;
