import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti } from "./GameShell";

const SortingAnimals = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const animals = [
    { id: 1, animal: "🐱", correctAnswer: "pet", options: ["pet", "wild", "farm", "sea"], rewardPoints: 5 },
    { id: 2, animal: "🦁", correctAnswer: "wild", options: ["pet", "wild", "farm", "sea"], rewardPoints: 5 },
    { id: 3, animal: "🐄", correctAnswer: "farm", options: ["pet", "wild", "farm", "sea"], rewardPoints: 5 },
    { id: 4, animal: "🐠", correctAnswer: "sea", options: ["pet", "wild", "farm", "sea"], rewardPoints: 5 },
    { id: 5, animal: "🐶", correctAnswer: "pet", options: ["pet", "wild", "farm", "sea"], rewardPoints: 5 },
  ];

  const currentAnimal = animals[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;
    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentAnimal.correctAnswer) {
      setFeedback({ message: "Great! Correct sorting!", type: "correct" });
      setScore(prev => prev + currentAnimal.rewardPoints);
      setShowConfetti(true);
    } else {
      setFeedback({ message: `Wrong! Correct: ${currentAnimal.correctAnswer}`, type: "wrong" });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    if (currentLevelIndex < animals.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setFeedback({ message: "", type: "" });
      setSelectedOption(null);
      setIsOptionDisabled(false);
    } else {
      alert(`Game Over! Your final score is: ${score}`);
      setCurrentLevelIndex(0);
      setScore(0);
      setFeedback({ message: "", type: "" });
      setSelectedOption(null);
      setIsOptionDisabled(false);
    }
  };

  return (
    <GameShell
      title="Sorting Animals"
      subtitle="Put each animal in the right group!"
      rightSlot={<div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">Score: {score} ⭐ {currentLevelIndex + 1}/{animals.length}</div>}
      onNext={handleNextLevel}
      nextEnabled={!!feedback.message}
    >
      {showConfetti && <Confetti />}

      <GameCard>
        <div className="text-[clamp(80px,15vw,120px)] mb-6">{currentAnimal.animal}</div>
        <p className="text-lg font-bold text-white text-center">What type of animal is this?</p>
      </GameCard>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {currentAnimal.options.map(option => (
          <OptionButton
            key={option}
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

export default SortingAnimals;
