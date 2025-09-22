import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const FriendlyAIQuiz = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [flashPoints, setFlashPoints] = useState(null); // ✅ Score flash
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false); // ✅ for congratulations modal

  const questions = [
    { id: 1, question: "Is AI friendly to humans?", correctAnswer: "yes", options: ["yes", "no", "sometimes", "never"], rewardPoints: 5 },
    { id: 2, question: "Can AI help us learn?", correctAnswer: "yes", options: ["yes", "no", "sometimes", "never"], rewardPoints: 5 },
    { id: 3, question: "Is AI safe to use?", correctAnswer: "yes", options: ["yes", "no", "sometimes", "never"], rewardPoints: 5 },
    { id: 4, question: "Can AI be our friend?", correctAnswer: "yes", options: ["yes", "no", "sometimes", "never"], rewardPoints: 5 },
    { id: 5, question: "Does AI want to help us?", correctAnswer: "yes", options: ["yes", "no", "sometimes", "never"], rewardPoints: 5 },
  ];

  const currentQuestion = questions[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentQuestion.correctAnswer) {
      setScore(prev => prev + currentQuestion.rewardPoints);
      setFlashPoints(currentQuestion.rewardPoints); // ✅ trigger score flash
      setFeedback({ message: "Great! AI is friendly!", type: "correct" });
      setShowConfetti(true);

      // hide flash after 1 second
      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({ message: `Wrong! Correct: ${currentQuestion.correctAnswer}`, type: "wrong" });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    if (currentLevelIndex < questions.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsOptionDisabled(false);
      setFeedback({ message: "", type: "" });
    } else {
      setGameOver(true); // ✅ show congratulations modal
    }
  };

  return (
    <GameShell
      title="Friendly AI Quiz"
      subtitle="Test your AI knowledge!"
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{questions.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={!!feedback.message && isOptionDisabled}
      showGameOver={gameOver} // centralized congratulations modal
      score={score} // pass final score
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />} {/* ✅ score flash */}

      <GameCard>
        <div className="text-white font-bold text-xl md:text-2xl">{currentQuestion.question}</div>
      </GameCard>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
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

      {feedback.message && (
        <div className="mt-6">
          <FeedbackBubble message={feedback.message} type={feedback.type} />
        </div>
      )}
    </GameShell>
  );
};

export default FriendlyAIQuiz;
