import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const SiriAlexaQuiz = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flashPoints, setFlashPoints] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);

  // ✅ At least 5 Yes/No questions for awareness
  const questions = [
    { id: 1, question: "Is Alexa an AI?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
    { id: 2, question: "Is Siri an AI?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
    { id: 3, question: "Is a calculator an AI?", correctAnswer: "No", options: ["Yes", "No"], rewardPoints: 5 },
    { id: 4, question: "Can Siri learn from your voice?", correctAnswer: "Yes", options: ["Yes", "No"], rewardPoints: 5 },
    { id: 5, question: "Is a remote control an AI?", correctAnswer: "No", options: ["Yes", "No"], rewardPoints: 5 },
  ];

  const currentQuestion = questions[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + currentQuestion.rewardPoints);
      setFlashPoints(currentQuestion.rewardPoints); // ✅ flash reward
      setFeedback({ message: "Correct!", type: "correct" });
      setShowConfetti(true);
      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({ message: `Wrong! The answer is ${currentQuestion.correctAnswer}`, type: "wrong" });
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
      setShowGameOver(true); // ✅ show congrats modal
    }
  };

  return (
    <GameShell
      title="Siri/Alexa Quiz"
      subtitle="Is this AI? Yes or No!"
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{questions.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={feedback.message !== ""}
      showGameOver={showGameOver}
      score={score}
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />}

      <GameCard>
        <div className="text-2xl md:text-3xl font-bold text-white">{currentQuestion.question}</div>
      </GameCard>

      <div className="flex gap-6 justify-center mt-4">
        {currentQuestion.options.map((option) => (
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

export default SiriAlexaQuiz;
