import React, { useState } from 'react';
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from './GameShell';

const RobotVisionGame = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flashPoints, setFlashPoints] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);

  // ✅ 5 questions with +2 points each
  const images = [
    { id: 1, image: '🚗', correctAnswer: 'car', options: ['car', 'truck', 'bus', 'bike'], rewardPoints: 2 },
    { id: 2, image: '🐱', correctAnswer: 'cat', options: ['cat', 'dog', 'bird', 'fish'], rewardPoints: 2 },
    { id: 3, image: '🍎', correctAnswer: 'apple', options: ['apple', 'orange', 'banana', 'grape'], rewardPoints: 2 },
    { id: 4, image: '🏠', correctAnswer: 'house', options: ['house', 'building', 'tree', 'car'], rewardPoints: 2 },
    { id: 5, image: '🌳', correctAnswer: 'tree', options: ['tree', 'flower', 'grass', 'bush'], rewardPoints: 2 },
  ];

  const currentImage = images[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentImage.correctAnswer) {
      setScore(prev => prev + currentImage.rewardPoints);
      setFlashPoints(currentImage.rewardPoints);
      setFeedback({ message: 'Great! Robot vision working!', type: 'correct' });
      setShowConfetti(true);

      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({ message: `Wrong! Correct: ${currentImage.correctAnswer}`, type: 'wrong' });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    if (currentLevelIndex < images.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsOptionDisabled(false);
      setFeedback({ message: '', type: '' });
    } else {
      setShowGameOver(true);
    }
  };

  return (
    <GameShell
      gameId="robot-vision-game"
      gameType="ai"
      totalLevels={images.length}
      title="Robot Vision Game"
      subtitle="AI robot sees objects. Pick the correct one."
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{images.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={feedback.message && isOptionDisabled}
      showGameOver={showGameOver}
      score={score}
      nextLabel="Next"
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />}

      <LevelCompleteHandler gameId="robot-vision-game" gameType="ai" levelNumber={currentLevelIndex + 1}>
        <GameCard>
          <div style={{ fontSize: 'clamp(80px, 15vw, 120px)', marginBottom: '20px' }}>
            {currentImage.image}
          </div>
          <p style={{ fontSize: 'clamp(16px, 3vw, 24px)', fontWeight: 'bold', color: '#fff' }}>
            What does the robot see?
          </p>
        </GameCard>
      </LevelCompleteHandler>

      <div className="flex flex-wrap justify-center gap-4">
        {currentImage.options.map((option, idx) => (
          <OptionButton
            key={idx}
            option={option}
            onClick={handleOptionClick}
            selected={selectedOption}
            disabled={isOptionDisabled}
            feedback={feedback}
          />
        ))}
      </div>

      {feedback.message && <FeedbackBubble message={feedback.message} type={feedback.type} />}
    </GameShell>
  );
};

export default RobotVisionGame;
