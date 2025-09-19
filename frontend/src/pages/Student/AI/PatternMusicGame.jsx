import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatternMusicGame = () => {
  const navigate = useNavigate();
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const patterns = [
    { 
      id: 1, 
      sequence: ['🎵', '🎶', '🎵', '🎶'], 
      correctAnswer: '🎵', 
      options: ['🎵', '🎶', '🎼', '🎹'],
      rewardPoints: 5 
    },
    { 
      id: 2, 
      sequence: ['🎹', '🎹', '🎸', '🎹', '🎹'], 
      correctAnswer: '🎸', 
      options: ['🎹', '🎸', '🎺', '🎻'],
      rewardPoints: 5 
    },
    { 
      id: 3, 
      sequence: ['🎺', '🎷', '🎺', '🎷'], 
      correctAnswer: '🎺', 
      options: ['🎺', '🎷', '🎸', '🎹'],
      rewardPoints: 5 
    },
    { 
      id: 4, 
      sequence: ['🎼', '🎼', '🎼', '🎵'], 
      correctAnswer: '🎼', 
      options: ['🎼', '🎵', '🎶', '🎹'],
      rewardPoints: 5 
    },
    { 
      id: 5, 
      sequence: ['🎻', '🎸', '🎻', '🎸'], 
      correctAnswer: '🎻', 
      options: ['🎻', '🎸', '🎹', '🎺'],
      rewardPoints: 5 
    },
  ];

  const currentPattern = patterns[currentLevelIndex];

  const containerStyle = {
    fontFamily: 'Comic Sans MS, cursive, sans-serif',
    textAlign: 'center',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    background: 'linear-gradient(to bottom, #87CEEB, #A7D9F8, #FFFFFF)',
    padding: 'clamp(12px, 2.5vw, 24px)',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const backButtonStyle = {
    position: 'absolute',
    top: 'clamp(12px, 3vh, 24px)',
    left: 'clamp(12px, 3vw, 24px)',
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    border: 'none',
    borderRadius: '50%',
    width: 'clamp(40px, 8vw, 60px)',
    height: 'clamp(40px, 8vw, 60px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  };

  const titleBoxStyle = {
    backgroundColor: '#FFEB3B',
    border: '4px solid #FFC107',
    borderRadius: '24px',
    padding: 'clamp(10px, 1.8vw, 18px) clamp(24px, 4vw, 48px)',
    fontSize: 'clamp(20px, 5vw, 48px)',
    fontWeight: 'bold',
    color: '#D32F2F',
    textShadow: '2px 2px 0 #FFEB3B, -2px -2px 0 #FFEB3B, 4px 4px 0 #FF5722',
    letterSpacing: '1.5px',
    marginBottom: 'clamp(16px, 4vh, 40px)',
    zIndex: 1,
    boxShadow: '0 8px 15px rgba(0,0,0,0.3)',
  };

  const gameCardStyle = {
    backgroundColor: 'white',
    borderRadius: '20px',
    border: '6px solid #E91E63',
    padding: 'clamp(16px, 3vw, 32px)',
    margin: 'clamp(8px, 2vh, 16px) 0',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
    maxHeight: '45vh',
    overflow: 'hidden',
  };

  const sequenceStyle = {
    display: 'flex',
    gap: 'clamp(8px, 2vw, 16px)',
    marginBottom: 'clamp(16px, 3vh, 24px)',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const sequenceItemStyle = {
    fontSize: 'clamp(24px, 5vw, 40px)',
    fontWeight: 'bold',
    color: '#333',
    padding: 'clamp(8px, 2vw, 16px)',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: '12px',
    border: '2px solid rgba(0,0,0,0.1)',
  };

  const optionsContainerStyle = {
    display: 'flex',
    gap: 'clamp(8px, 2vw, 16px)',
    marginTop: 'clamp(16px, 3vh, 24px)',
    position: 'relative',
    zIndex: 3,
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const optionButtonStyle = (option) => {
    const isSelected = selectedOption === option;
    const isCorrectFeedback = feedback.type === 'correct' && isSelected;
    const isWrongFeedback = feedback.type === 'wrong' && isSelected;

    return {
      width: 'clamp(60px, 12vw, 100px)',
      height: 'clamp(60px, 12vw, 100px)',
      borderRadius: '20px',
      backgroundColor: '#f0f0f0',
      border: `4px solid ${isCorrectFeedback ? '#4CAF50' : isWrongFeedback ? '#F44336' : '#CCCCCC'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: isOptionDisabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease-in-out',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
      opacity: isOptionDisabled && !isSelected ? 0.6 : 1,
      fontSize: 'clamp(18px, 3.5vw, 28px)',
      fontWeight: 'bold',
      color: '#333',
    };
  };

  const feedbackBubbleStyle = {
    backgroundColor: feedback.type === 'correct' ? '#8BC34A' : '#F44336',
    color: 'white',
    padding: '8px 14px',
    borderRadius: '25px',
    position: 'absolute',
    bottom: '2px',
    fontSize: 'clamp(16px, 4vw, 28px)',
    fontWeight: 'bold',
    zIndex: 4,
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    display: feedback.message ? 'block' : 'none',
    transform: 'translateY(-10px)',
    animation: feedback.message ? 'pop-in 0.3s ease-out forwards' : 'none',
    marginTop: '12px',
  };

  const nextButtonContainerStyle = {
    position: 'absolute',
    right: 'clamp(12px, 3vw, 32px)',
    bottom: 'clamp(12px, 3vh, 24px)',
    zIndex: 5,
  };

  const nextButtonStyle = {
    backgroundColor: '#FF9800',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: 'clamp(84px, 12vw, 120px)',
    height: 'clamp(84px, 12vw, 120px)',
    fontSize: 'clamp(14px, 2.5vw, 18px)',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 8px 15px rgba(0,0,0,0.4)',
    transition: 'background-color 0.2s ease-in-out, transform 0.2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: feedback.message && (feedback.type === 'correct' || (feedback.type === 'wrong' && isOptionDisabled)) ? 1 : 0.5,
    pointerEvents: feedback.message && (feedback.type === 'correct' || (feedback.type === 'wrong' && isOptionDisabled)) ? 'auto' : 'none',
  };

  const scoreTrackerStyle = {
    position: 'absolute',
    bottom: 'clamp(10px, 2.5vh, 20px)',
    left: 'clamp(10px, 2.5vw, 20px)',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: '20px',
    padding: '8px 12px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    fontSize: 'clamp(14px, 2.4vw, 18px)',
    fontWeight: 'bold',
    color: '#555',
    zIndex: 5,
  };

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentPattern.correctAnswer) {
      setFeedback({ message: 'Great! Perfect rhythm!', type: 'correct' });
      setScore(prevScore => prevScore + currentPattern.rewardPoints);
      setShowConfetti(true);
    } else {
      setFeedback({
        message: `Wrong! The correct answer is: ${currentPattern.correctAnswer}`,
        type: 'wrong'
      });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    if (currentLevelIndex < patterns.length - 1) {
      setCurrentLevelIndex(prevIndex => prevIndex + 1);
      setFeedback({ message: '', type: '' });
      setSelectedOption(null);
      setIsOptionDisabled(false);
    } else {
      alert(`Game Over! Your final score is: ${score}`);
      setCurrentLevelIndex(0);
      setScore(0);
      setFeedback({ message: '', type: '' });
      setSelectedOption(null);
      setIsOptionDisabled(false);
    }
  };

  const renderConfetti = () => {
    if (!showConfetti) return null;
    return (
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 100,
      }}>
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random(),
              animation: `confetti-fall ${Math.random() * 2 + 3}s linear infinite`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <button style={backButtonStyle} onClick={() => navigate('/student/games')}>
        <ArrowLeft size={20} />
      </button>

      {/* Confetti Animation */}
      {showConfetti && renderConfetti()}

      {/* Title */}
      <div style={titleBoxStyle}>Pattern Music Game</div>

      {/* Game Card */}
      <div style={gameCardStyle}>
        <div style={sequenceStyle}>
          {currentPattern.sequence.map((item, index) => (
            <div key={index} style={sequenceItemStyle}>
              {item}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 'clamp(16px, 3vw, 24px)', fontWeight: 'bold', color: '#333' }}>
          What comes next in the rhythm?
        </p>
      </div>

      {/* Options */}
      <div style={optionsContainerStyle}>
        {currentPattern.options.map((option, index) => (
          <button
            key={index}
            style={optionButtonStyle(option)}
            onClick={() => handleOptionClick(option)}
            disabled={isOptionDisabled}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Feedback Bubble */}
      {feedback.message && (
        <div style={feedbackBubbleStyle}>
          {feedback.message}
        </div>
      )}

      {/* Next Level Button */}
      <div style={nextButtonContainerStyle}>
        <button
          style={nextButtonStyle}
          onClick={handleNextLevel}
          disabled={!(feedback.message && (feedback.type === 'correct' || (feedback.type === 'wrong' && isOptionDisabled)))}
        >
          <span>Next</span>
          <span>Level</span>
          <span style={{ fontSize: '20px' }}>😊</span>
        </button>
      </div>

      {/* Score Tracker */}
      <div style={scoreTrackerStyle}>
        Score: {score}
        <span style={{ marginLeft: '10px' }}>⭐ {currentLevelIndex + 1}/{patterns.length}</span>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.5) translateY(-10px); opacity: 0; }
          80% { transform: scale(1.1) translateY(-10px); opacity: 1; }
          100% { transform: scale(1) translateY(-10px); opacity: 1; }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default PatternMusicGame;
