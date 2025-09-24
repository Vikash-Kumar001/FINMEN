import React, { useState } from 'react';
import GameShell from './GameShell';

// --- Inline Star Component ---
const Star = ({ color = '#FFD700', size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
  >
    <path d="M12 2L14.09 8.26H20.82L15.36 12.74L17.45 19L12 14.52L6.55 19L8.64 12.74L3.18 8.26H9.91L12 2Z" />
  </svg>
);

// --- Floating Particles Component ---
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 30 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20"
        style={{
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    ))}
  </div>
);

// --- Game Data ---
const patterns = [
  {
    id: 1,
    sequence: ['circle-yellow', 'square-blue', 'circle-yellow', 'square-blue'],
    options: [
      { type: 'triangle', color: 'red' },
      { type: 'circle', color: 'yellow' },
      { type: 'square', color: 'blue' }
    ],
    correctAnswer: { type: 'circle', color: 'yellow' },
    rewardPoints: 10,
  },
  {
    id: 2,
    sequence: ['star-red', 'star-blue', 'star-red', 'star-blue'],
    options: [
      { type: 'star', color: 'green' },
      { type: 'star', color: 'red' },
      { type: 'star', color: 'yellow' }
    ],
    correctAnswer: { type: 'star', color: 'red' },
    rewardPoints: 15,
  },
  {
    id: 3,
    sequence: ['triangle-green', 'triangle-green', 'square-orange', 'triangle-green', 'triangle-green'],
    options: [
      { type: 'triangle', color: 'green' },
      { type: 'square', color: 'orange' },
      { type: 'circle', color: 'purple' }
    ],
    correctAnswer: { type: 'square', color: 'orange' },
    rewardPoints: 20,
  },
  {
    id: 4,
    sequence: ['arrow-up-yellow', 'arrow-down-red', 'arrow-up-yellow', 'arrow-down-red'],
    options: [
      { type: 'arrow-left', color: 'blue' },
      { type: 'arrow-up', color: 'yellow' },
      { type: 'arrow-down', color: 'red' }
    ],
    correctAnswer: { type: 'arrow-up', color: 'yellow' },
    rewardPoints: 25,
  },
  {
    id: 5,
    sequence: ['heart-pink', 'heart-pink', 'heart-pink', 'star-gold', 'heart-pink', 'heart-pink'],
    options: [
      { type: 'circle', color: 'blue' },
      { type: 'heart', color: 'pink' },
      { type: 'star', color: 'gold' }
    ],
    correctAnswer: { type: 'heart', color: 'pink' },
    rewardPoints: 30,
  },
];

// --- Enhanced Shape Rendering ---
const renderShape = (shapeString) => {
  const parts = shapeString.split('-');
  let type, color;

  if (parts[0] === 'arrow') {
    type = parts[0] + '-' + parts[1];
    color = parts[2];
  } else {
    type = parts[0];
    color = parts[1];
  }

  const colorMap = {
    yellow: '#FFD700',
    blue: '#4FC3F7',
    red: '#FF5252',
    green: '#66BB6A',
    orange: '#FF9800',
    purple: '#AB47BC',
    pink: '#EC407A',
    gold: '#FFD700',
  };

  const actualColor = colorMap[color] || color;

  const shapeBaseStyle = {
    width: 'clamp(70px, 12vw, 120px)',
    height: 'clamp(70px, 12vw, 120px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: type === 'circle' ? '50%' : '16px',
    background: type !== 'star' && type !== 'heart' && !type.includes('arrow')
      ? `linear-gradient(135deg, ${actualColor}, ${actualColor}dd)`
      : 'transparent',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
    border: '2px solid rgba(255,255,255,0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  };

  switch (type) {
    case 'star':
      return (
        <div className="animate-pulse-glow" style={{ ...shapeBaseStyle, background: 'transparent' }}>
          <Star color={actualColor} size={60} />
        </div>
      );
    case 'heart':
      return (
        <div className="animate-heartbeat" style={{ ...shapeBaseStyle, background: 'transparent' }}>
          <span style={{
            fontSize: 'clamp(40px, 8vw, 60px)',
            color: actualColor,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          }}>❤</span>
        </div>
      );
    case 'arrow-up':
      return (
        <div className="animate-bounce-subtle" style={{ ...shapeBaseStyle, background: 'transparent' }}>
          <span style={{
            fontSize: 'clamp(40px, 8vw, 60px)',
            color: actualColor,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          }}>⬆</span>
        </div>
      );
    case 'arrow-down':
      return (
        <div className="animate-bounce-subtle" style={{ ...shapeBaseStyle, background: 'transparent' }}>
          <span style={{
            fontSize: 'clamp(40px, 8vw, 60px)',
            color: actualColor,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          }}>⬇</span>
        </div>
      );
    case 'arrow-left':
      return (
        <div className="animate-bounce-subtle" style={{ ...shapeBaseStyle, background: 'transparent' }}>
          <span style={{
            fontSize: 'clamp(40px, 8vw, 60px)',
            color: actualColor,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          }}>⬅</span>
        </div>
      );
    case 'question':
      return (
        <div className="animate-question-mark" style={{
          fontSize: 'clamp(60px, 12vw, 100px)',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        }}>
          ?
        </div>
      );
    default:
      return <div className="animate-shape-glow" style={shapeBaseStyle}></div>;
  }
};

const renderOptionShape = (option) => {
  const colorMap = {
    yellow: '#FFD700',
    blue: '#4FC3F7',
    red: '#FF5252',
    green: '#66BB6A',
    orange: '#FF9800',
    purple: '#AB47BC',
    pink: '#EC407A',
    gold: '#FFD700',
  };

  const actualColor = colorMap[option.color] || option.color;

  const shapeStyle = {
    width: 'clamp(65px, 10vw, 90px)',
    height: 'clamp(65px, 10vw, 90px)',
    background: option.type !== 'star' && option.type !== 'heart' && !option.type.includes('arrow')
      ? `linear-gradient(135deg, ${actualColor}, ${actualColor}dd)`
      : 'transparent',
    borderRadius: option.type === 'circle' ? '50%' : '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
    border: '2px solid rgba(255,255,255,0.3)',
  };

  switch (option.type) {
    case 'star':
      return (
        <div style={{ ...shapeStyle, background: 'transparent' }}>
          <Star color={actualColor} size={45} />
        </div>
      );
    case 'heart':
      return (
        <div style={{ ...shapeStyle, background: 'transparent' }}>
          <span style={{
            fontSize: 'clamp(30px, 6vw, 40px)',
            color: actualColor,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}>❤</span>
        </div>
      );
    case 'arrow-up':
      return (
        <div style={{ ...shapeStyle, background: 'transparent' }}>
          <span style={{
            fontSize: 'clamp(30px, 6vw, 40px)',
            color: actualColor,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}>⬆</span>
        </div>
      );
    case 'arrow-down':
      return (
        <div style={{ ...shapeStyle, background: 'transparent' }}>
          <span style={{
            fontSize: 'clamp(30px, 6vw, 40px)',
            color: actualColor,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}>⬇</span>
        </div>
      );
    case 'arrow-left':
      return (
        <div style={{ ...shapeStyle, background: 'transparent' }}>
          <span style={{
            fontSize: 'clamp(30px, 6vw, 40px)',
            color: actualColor,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}>⬅</span>
        </div>
      );
    default:
      return <div style={shapeStyle}></div>;
  }
};

// --- Main Component ---
const SpotThePattern = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: '', type: '', correctWas: null });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false); // ✅ Add gameOver state

  const currentPatternData = patterns[currentLevelIndex];

  const areOptionsEqual = (option1, option2) => {
    return option1.type === option2.type && option1.color === option2.color;
  };

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (areOptionsEqual(option, currentPatternData.correctAnswer)) {
      setFeedback({ message: 'Perfect!', type: 'correct' });
      setScore(prevScore => prevScore + currentPatternData.rewardPoints);
      setShowConfetti(true);
    } else {
      setFeedback({
        message: 'Try again! Correct answer:',
        type: 'wrong',
        correctWas: currentPatternData.correctAnswer
      });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    if (currentLevelIndex < patterns.length - 1) {
      setCurrentLevelIndex(prevIndex => prevIndex + 1);
      setFeedback({ message: '', type: '', correctWas: null });
      setSelectedOption(null);
      setIsOptionDisabled(false);
    } else {
      setGameOver(true); // ✅ trigger centralized GameOverModal
    }
  };

  const renderConfetti = () => {
    if (!showConfetti) return null;
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 2 + 3}s`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <GameShell
      title="Spot The Pattern"
      subtitle="Find the correct shape in the sequence!"
      rightSlot={
        <div className="text-white font-bold bg-white/10 px-4 py-2 rounded-xl">
          Score: {score}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={!!feedback.message}
      showGameOver={gameOver} // ✅ centralized modal
      score={score} // ✅ pass score
      gameId="spot-the-pattern" // ✅ Add game ID for heal coins
      gameType="ai" // ✅ Add game type
      totalLevels={patterns.length} // ✅ Add total levels
    >
      <FloatingParticles />
      {renderConfetti()}

      {/* Game Stats */}
      <div className="flex gap-6 mb-8 z-10">
        <div className="bg-black/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10">
          <div className="text-yellow-400 text-sm font-medium">SCORE</div>
          <div className="text-white text-2xl font-bold">{score}</div>
        </div>
        <div className="bg-black/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10">
          <div className="text-blue-400 text-sm font-medium">LEVEL</div>
          <div className="text-white text-2xl font-bold">{currentLevelIndex + 1}/{patterns.length}</div>
        </div>
      </div>

      {/* Pattern Display */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl z-10 max-w-4xl w-full">
        <h2 className="text-white text-xl font-semibold mb-6 text-center">Find the next shape in the sequence</h2>

        <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
          {currentPatternData.sequence.map((shapeString, index) => (
            <div key={index} className="animate-slide-in-sequence" style={{ animationDelay: `${index * 0.1}s` }}>
              {renderShape(shapeString)}
            </div>
          ))}
          <div className="animate-slide-in-sequence" style={{ animationDelay: `${currentPatternData.sequence.length * 0.1}s` }}>
            {renderShape('question')}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="flex gap-6 mb-8 z-10 flex-wrap justify-center">
        {currentPatternData.options.map((option, index) => {
          const isSelected = selectedOption && selectedOption.type === option.type && selectedOption.color === option.color;
          const isCorrect = feedback.type === 'correct' && isSelected;
          const isWrong = feedback.type === 'wrong' && isSelected;
          const isShowingCorrect = feedback.type === 'wrong' && feedback.correctWas &&
            feedback.correctWas.type === option.type && feedback.correctWas.color === option.color;

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={isOptionDisabled}
              className={`
                relative group transform transition-all duration-300 ease-out
                ${isSelected ? 'scale-110' : 'hover:scale-105 hover:-translate-y-2'}
                ${isCorrect ? 'animate-success-pulse' : ''}
                ${isWrong ? 'animate-shake' : ''}
                ${isShowingCorrect ? 'animate-highlight-correct' : ''}
                ${!isOptionDisabled ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
              style={{
                background: isCorrect ? 'linear-gradient(135deg, #10B981, #059669)' :
                  isWrong ? 'linear-gradient(135deg, #EF4444, #DC2626)' :
                    isShowingCorrect ? 'linear-gradient(135deg, #F59E0B, #D97706)' :
                      'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                borderRadius: '24px',
                padding: '20px',
                border: `3px solid ${isCorrect ? '#10B981' : isWrong ? '#EF4444' : isShowingCorrect ? '#F59E0B' : 'rgba(255,255,255,0.2)'}`,
                boxShadow: isSelected ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 15px 35px -5px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="animate-option-appear" style={{ animationDelay: `${index * 0.1}s` }}>
                {renderOptionShape(option)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback.message && (
        <div className={`
          fixed bottom-32 left-1/2 transform -translate-x-1/2 z-20
          px-8 py-4 rounded-2xl text-white font-bold text-lg
          animate-feedback-appear backdrop-blur-md border
          ${feedback.type === 'correct'
            ? 'bg-green-500/90 border-green-400'
            : 'bg-red-500/90 border-red-400'
          }
        `}>
          <div className="flex items-center gap-3">
            <span>{feedback.message}</span>
            {feedback.type === 'wrong' && feedback.correctWas && (
              <div className="scale-75">
                {renderOptionShape(feedback.correctWas)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next Button */}
      {feedback.message && (
        <button
          onClick={handleNextLevel}
          className="fixed bottom-8 right-8 z-20 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 animate-next-button"
        >
          {currentLevelIndex < patterns.length - 1 ? 'Next Level →' : 'Complete 🎉'}
        </button>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 5px currentColor); }
          50% { filter: drop-shadow(0 0 20px currentColor); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes question-mark {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
        }
        @keyframes shape-glow {
          0%, 100% { box-shadow: 0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2); }
          50% { box-shadow: 0 8px 35px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3); }
        }
        @keyframes title-glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(255,255,255,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.6)); }
        }
        @keyframes slide-in-sequence {
          0% { transform: translateX(-50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes option-appear {
          0% { transform: scale(0) rotate(180deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes success-pulse {
          0% { transform: scale(1.1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1.1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0) scale(1.1); }
          25% { transform: translateX(-5px) scale(1.1); }
          75% { transform: translateX(5px) scale(1.1); }
        }
        @keyframes highlight-correct {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes feedback-appear {
          0% { transform: translate(-50%, 20px); opacity: 0; }
          100% { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes next-button {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-question-mark { animation: question-mark 1s ease-in-out infinite; }
        .animate-shape-glow { animation: shape-glow 3s ease-in-out infinite; }
        .animate-title-glow { animation: title-glow 2s ease-in-out infinite; }
        .animate-slide-in-sequence { animation: slide-in-sequence 0.5s ease-out forwards; opacity: 0; }
        .animate-option-appear { animation: option-appear 0.6s ease-out forwards; opacity: 0; }
        .animate-success-pulse { animation: success-pulse 0.5s ease-in-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-highlight-correct { animation: highlight-correct 1s ease-in-out infinite; }
        .animate-feedback-appear { animation: feedback-appear 0.4s ease-out; }
        .animate-next-button { animation: next-button 0.5s ease-out; }
        .animate-confetti { animation: confetti linear infinite; }
      `}</style>
    </GameShell>
  );
};

export default SpotThePattern;