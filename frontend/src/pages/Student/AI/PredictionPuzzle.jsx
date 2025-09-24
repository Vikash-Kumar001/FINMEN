import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const PredictionPuzzle = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [flashPoints, setFlashPoints] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const predictions = [
    {
      id: 1,
      scenario: "🌞 🌞 🌧️ 🌞 ... What comes next?",
      correctAnswer: "🌞",
      options: ["🌞", "🌧️", "⛅", "❄️"],
      rewardPoints: 5,
    },
    {
      id: 2,
      scenario: "🍎 🍎 🍌 🍎 ... What comes next?",
      correctAnswer: "🍎",
      options: ["🍎", "🍌", "🍊", "🍇"],
      rewardPoints: 5,
    },
    {
      id: 3,
      scenario: "📚 📚 🎮 📚 ... What comes next?",
      correctAnswer: "📚",
      options: ["📚", "🎮", "🛌", "📺"],
      rewardPoints: 5,
    },
    {
      id: 4,
      scenario: "🚗 🚗 🚌 🚗 ... What comes next?",
      correctAnswer: "🚗",
      options: ["🚗", "🚌", "🚲", "🚕"],
      rewardPoints: 5,
    },
    {
      id: 5,
      scenario: "🌙 🌙 ☀️ 🌙 ... What comes next?",
      correctAnswer: "🌙",
      options: ["🌙", "☀️", "⭐", "⛅"],
      rewardPoints: 5,
    },
  ];

  const currentPrediction = predictions[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;
    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentPrediction.correctAnswer) {
      setScore((prev) => prev + currentPrediction.rewardPoints);
      setFlashPoints(currentPrediction.rewardPoints);
      setFeedback({ message: "Great! Good prediction!", type: "correct" });
      setShowConfetti(true);
      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({
        message: `Wrong! The correct answer is: ${currentPrediction.correctAnswer}`,
        type: "wrong",
      });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    if (currentLevelIndex < predictions.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsOptionDisabled(false);
      setFeedback({ message: "", type: "" });
    } else {
      setGameOver(true);
    }
  };

  return (
    <GameShell
      gameId="prediction-puzzle"
      gameType="ai"
      totalLevels={predictions.length}
      title="Prediction Puzzle"
      subtitle="Try to predict the next item in the sequence!"
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{predictions.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={!!feedback.message && isOptionDisabled}
      showGameOver={gameOver}
      score={score}
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />}

      <LevelCompleteHandler gameId="prediction-puzzle" gameType="ai" levelNumber={currentLevelIndex + 1}>
        <GameCard>
          <div className="text-lg md:text-2xl font-bold text-white">
            {currentPrediction.scenario}
          </div>
        </GameCard>
      </LevelCompleteHandler>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {currentPrediction.options.map((option, idx) => (
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

      {feedback.message && (
        <div className="mt-6">
          <FeedbackBubble message={feedback.message} type={feedback.type} />
        </div>
      )}
    </GameShell>
  );
};

export default PredictionPuzzle;
