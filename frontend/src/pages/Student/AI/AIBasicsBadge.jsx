import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, Confetti, FeedbackBubble } from "./GameShell";

const AIBasicsBadge = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What does AI stand for?",
      correctAnswer: "Artificial Intelligence",
      options: ["Artificial Intelligence", "Amazing Ideas", "Awesome Internet", "Amazing Inventions"],
      rewardPoints: 5,
    },
    {
      id: 2,
      question: "Can AI learn from data?",
      correctAnswer: "yes",
      options: ["yes", "no", "sometimes", "never"],
      rewardPoints: 5,
    },
    {
      id: 3,
      question: "Is AI helpful to humans?",
      correctAnswer: "yes",
      options: ["yes", "no", "sometimes", "never"],
      rewardPoints: 5,
    },
    {
      id: 4,
      question: "Can AI understand language?",
      correctAnswer: "yes",
      options: ["yes", "no", "sometimes", "never"],
      rewardPoints: 5,
    },
    {
      id: 5,
      question: "Is AI safe to use?",
      correctAnswer: "yes",
      options: ["yes", "no", "sometimes", "never"],
      rewardPoints: 5,
    },
  ];

  const currentQuestion = questions[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentQuestion.correctAnswer) {
      setFeedback({ message: "Great! You earned a badge!", type: "correct" });
      setScore((prev) => prev + currentQuestion.rewardPoints);
      setShowConfetti(true);
    } else {
      setFeedback({ message: `Wrong! Correct answer: ${currentQuestion.correctAnswer}`, type: "wrong" });
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
      title="AI Basics Badge"
      subtitle="Answer the questions correctly!"
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{questions.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={!!feedback.message}
    >
      {showConfetti && <Confetti />}

      <GameCard>
        <p className="text-2xl font-semibold text-white">{currentQuestion.question}</p>
      </GameCard>

      {/* Options */}
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

      {/* Feedback */}
      {feedback.message && <FeedbackBubble message={feedback.message} type={feedback.type} />}
    </GameShell>
  );
};

export default AIBasicsBadge;
