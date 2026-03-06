import React, { useState, useEffect, useCallback } from 'react';
import Player from './Player';
import Enemy from './Enemy';
import Bullet from './Bullet';
import QuestionDialog from './QuestionDialog';
import ScoreBoard from './ScoreBoard';
import LifeBar from './LifeBar';
import TimerBar from './TimerBar';
import GameOver from './GameOver';
import { getRandomQuestion } from '../data/questions';
import '../styles/game.css';

const GameBoard = () => {
  // Game State
  const [gameState, setGameState] = useState('playing'); // 'playing', 'question', 'gameOver'
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [maxTime, setMaxTime] = useState(10);
  
  // Animation State
  const [isShooting, setIsShooting] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [showCombo, setShowCombo] = useState(false);
  const [pointsPopup, setPointsPopup] = useState({ show: false, x: 0, y: 0, points: 0 });
  
  // Question State
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [enemyPosition, setEnemyPosition] = useState({ x: 50 });
  const [selectedOption, setSelectedOption] = useState(null);

  // Player Position State
  const [playerPosition, setPlayerPosition] = useState(50);

  // Initialize game
  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'question') return;
      
      if (e.key === 'ArrowLeft') {
        setPlayerPosition(prev => Math.max(10, prev - 5));
      } else if (e.key === 'ArrowRight') {
        setPlayerPosition(prev => Math.min(90, prev + 5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Timer Logic
  useEffect(() => {
    if (gameState !== 'question' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return maxTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, maxTime, handleTimeUp]);

  const loadNewQuestion = useCallback(() => {
    const question = getRandomQuestion();
    setCurrentQuestion(question);
    setSelectedOption(null);
    setGameState('question');
    
    // Random enemy position (20% to 80%)
    setEnemyPosition({ x: 20 + Math.random() * 60 });
  }, []);

  const handleTimeUp = useCallback(() => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameState('gameOver');
      } else {
        triggerShake();
        triggerFlash();
        setCombo(0);
        loadNewQuestion();
      }
      return newLives;
    });
  }, [loadNewQuestion]);

  const handleAnswer = (answer) => {
    if (!currentQuestion || selectedOption !== null) return;
    
    setSelectedOption(answer);

    if (answer === currentQuestion.correctAnswer) {
      // Correct Answer
      setTimeout(() => {
        setIsShooting(true);
        
        // Play shooting sound
        playSound('shoot');
        
        setTimeout(() => {
          setIsExploding(true);
          playSound('explosion');
          
          // Calculate points with combo bonus
          const basePoints = 10;
          const newCombo = combo + 1;
          let bonusPoints = 0;
          
          if (newCombo >= 3) {
            bonusPoints = 30;
            setShowCombo(true);
            setTimeout(() => setShowCombo(false), 1000);
          }
          
          const totalPoints = basePoints + bonusPoints;
          setScore(prev => prev + totalPoints);
          setCombo(newCombo);
          
          // Show points popup
          setPointsPopup({
            show: true,
            x: 50,
            y: 30,
            points: totalPoints
          });
          setTimeout(() => setPointsPopup({ show: false, x: 0, y: 0, points: 0 }), 1000);
          
          // Increase difficulty
          if (score > 50 && maxTime > 7) setMaxTime(7);
          if (score > 100 && maxTime > 5) setMaxTime(5);
          
        }, 300);
        
        setTimeout(() => {
          setIsShooting(false);
          setIsExploding(false);
          loadNewQuestion();
          setTimeLeft(maxTime);
        }, 800);
      }, 300);
    } else {
      // Wrong Answer
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameState('gameOver');
        } else {
          triggerShake();
          triggerFlash();
          setCombo(0);
          setTimeout(() => {
            loadNewQuestion();
            setTimeLeft(maxTime);
          }, 500);
        }
        return newLives;
      });
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
  };

  const playSound = (type) => {
    // Sound effects - using Web Audio API for generated sounds
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'shoot') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } else if (type === 'explosion') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const handlePlayAgain = () => {
    setScore(0);
    setLives(3);
    setCombo(0);
    setTimeLeft(10);
    setMaxTime(10);
    setIsShooting(false);
    setIsExploding(false);
    setGameState('playing');
    loadNewQuestion();
  };

  return (
    <div className={`game-container ${shake ? 'shake' : ''} ${flash ? 'flash' : ''}`}>
      {/* Animated Stars Background */}
      <div className="stars"></div>
      
      {/* Game Elements */}
      <ScoreBoard score={score} combo={combo} />
      <LifeBar lives={lives} />
      
      {gameState === 'question' && currentQuestion && (
        <TimerBar timeLeft={timeLeft} maxTime={maxTime} />
      )}
      
      <Player isShooting={isShooting} position={playerPosition} />
      <Bullet isActive={isShooting} />
      <Enemy 
        position={enemyPosition} 
        isExploding={isExploding} 
      />
      
      {/* Question Dialog */}
      {gameState === 'question' && currentQuestion && (
        <QuestionDialog 
          question={currentQuestion}
          onAnswer={handleAnswer}
          selectedOption={selectedOption}
        />
      )}
      
      {/* Combo Display */}
      {showCombo && (
        <div className="combo-display">
          🔥 COMBO x{combo}! +30 BONUS!
        </div>
      )}
      
      {/* Points Popup */}
      {pointsPopup.show && (
        <div 
          className="points-popup"
          style={{ left: `${pointsPopup.x}%`, top: `${pointsPopup.y}%` }}
        >
          +{pointsPopup.points}
        </div>
      )}
      
      {/* Game Over */}
      {gameState === 'gameOver' && (
        <GameOver score={score} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
};

export default GameBoard;
