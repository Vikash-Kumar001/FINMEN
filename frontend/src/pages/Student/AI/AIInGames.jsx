import React, { useState } from "react";
import GameShell, { OptionButton, Confetti, FeedbackBubble, GameCard, ScoreFlash } from "./GameShell";

const AIInGames = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flashPoints, setFlashPoints] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);

  // ✅ Story-style varied questions
  const questions = [
    { id: 1, question: "Who controls the enemies in a video game?", correctAnswer: "AI", options: ["AI", "Teacher"], rewardPoints: 5 },
    { id: 2, question: "Who makes the car move in a racing game?", correctAnswer: "AI", options: ["AI", "Your cat"], rewardPoints: 5 },
    { id: 3, question: "Who decides how monsters attack?", correctAnswer: "AI", options: ["AI", "Clouds"], rewardPoints: 5 },
    { id: 4, question: "Who helps NPCs talk to you?", correctAnswer: "AI", options: ["AI", "Pencil"], rewardPoints: 5 },
    { id: 5, question: "Who makes the game characters play against you?", correctAnswer: "AI", options: ["AI", "Your shoes"], rewardPoints: 5 },
  ];

  const currentQuestion = questions[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + currentQuestion.rewardPoints);
      setFlashPoints(currentQuestion.rewardPoints);
      setFeedback({ message: "Correct! 🎮 AI makes games fun!", type: "correct" });
      setShowConfetti(true);

      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({ message: `Wrong! The correct answer is ${currentQuestion.correctAnswer}`, type: "wrong" });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    if (currentLevelIndex < questions.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1);
      setFeedback({ message: "", type: "" });
      setSelectedOption(null);
      setIsOptionDisabled(false);
    } else {
      setShowGameOver(true);
    }
  };

  return (
    <GameShell
      title="AI in Games"
      subtitle="Who controls characters in games?"
      rightSlot={
        <div className="px-3 py-2 bg-white/20 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{questions.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={!!feedback.message}
      showGameOver={showGameOver}
      score={score}
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />}

      <GameCard>
        <p className="font-bold text-lg md:text-2xl text-white">{currentQuestion.question}</p>
      </GameCard>

      <div className="flex flex-wrap justify-center gap-4">
        {currentQuestion.options.map((option, idx) => (
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

export default AIInGames;
