import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const SmartHomeStory = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [flashPoints, setFlashPoints] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  // ✅ Mixed AI and Human actions
  const scenarios = [
    { id: 1, scenario: "🏠 Light turns on automatically when you enter the room. Who did it?", correctAnswer: "AI", options: ["AI", "Human"], rewardPoints: 5 },
    { id: 2, scenario: "🌡️ You adjust the thermostat yourself. Who did it?", correctAnswer: "Human", options: ["AI", "Human"], rewardPoints: 5 },
    { id: 3, scenario: "🔒 Door locks automatically at night. Who did it?", correctAnswer: "AI", options: ["AI", "Human"], rewardPoints: 5 },
    { id: 4, scenario: "💡 You turn off the bedroom light before sleeping. Who did it?", correctAnswer: "Human", options: ["AI", "Human"], rewardPoints: 5 },
    { id: 5, scenario: "☔ Windows close automatically when it rains. Who did it?", correctAnswer: "AI", options: ["AI", "Human"], rewardPoints: 5 },
  ];

  const currentScenario = scenarios[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentScenario.correctAnswer) {
      setScore(prev => prev + currentScenario.rewardPoints);
      setFlashPoints(currentScenario.rewardPoints);
      setFeedback({ message: `Correct! ${currentScenario.correctAnswer} did it.`, type: "correct" });
      setShowConfetti(true);
      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({ message: `Wrong! Correct answer: ${currentScenario.correctAnswer}`, type: "wrong" });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    if (currentLevelIndex < scenarios.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsOptionDisabled(false);
      setFeedback({ message: "", type: "" });
    } else {
      setShowGameOver(true);
    }
  };

  return (
    <GameShell
      title="Smart Home Story"
      subtitle="Who performed the action? AI or Human?"
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{scenarios.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={!!feedback.message && isOptionDisabled}
      showGameOver={showGameOver}
      score={score}
      nextLabel="Next"
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />}

      <GameCard>
        <div className="text-xl md:text-2xl font-bold text-white mb-4">
          {currentScenario.scenario}
        </div>
      </GameCard>

      <div className="flex flex-wrap gap-4 justify-center">
        {currentScenario.options.map(option => (
          <OptionButton
            key={option}
            option={option}
            selected={selectedOption}
            feedback={feedback}
            disabled={isOptionDisabled}
            onClick={handleOptionClick}
          />
        ))}
      </div>

      {feedback.message && <FeedbackBubble message={feedback.message} type={feedback.type} />}
    </GameShell>
  );
};

export default SmartHomeStory;
