import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const AIOrNotQuiz = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [flashPoints, setFlashPoints] = useState(null); // ✅ Score flash
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ Congratulations modal

  const items = [
    { id: 1, item: "Siri", correctAnswer: "AI", rewardPoints: 5 },
    { id: 2, item: "Calculator", correctAnswer: "Not AI", rewardPoints: 5 },
    { id: 3, item: "ChatGPT", correctAnswer: "AI", rewardPoints: 5 },
    { id: 4, item: "Remote Control", correctAnswer: "Not AI", rewardPoints: 5 },
    { id: 5, item: "Alexa", correctAnswer: "AI", rewardPoints: 5 },
  ];

  const currentItem = items[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentItem.correctAnswer) {
      setScore(prev => prev + currentItem.rewardPoints);
      setFlashPoints(currentItem.rewardPoints); // ✅ trigger score flash
      setFeedback({ message: "Correct! ✅", type: "correct" });
      setShowConfetti(true);

      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({
        message: `Wrong! The answer is ${currentItem.correctAnswer}`,
        type: "wrong",
      });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);

    if (currentLevelIndex < items.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setFeedback({ message: "", type: "" });
      setSelectedOption(null);
      setIsOptionDisabled(false);
    } else {
      setShowModal(true); // ✅ show congratulations modal
    }
  };

  return (
    <GameShell
      title="AI or Not Quiz"
      subtitle="Decide what is AI and what is not"
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{items.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={!!feedback.message && isOptionDisabled}
      showGameOver={showModal} // ✅ centralized congratulations modal
      score={score} // pass final score
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />} {/* ✅ Score flash */}

      <GameCard>
        <p className="text-3xl md:text-4xl font-bold mb-4 text-white">{currentItem.item}</p>
        <p className="text-white/80 text-lg md:text-2xl font-semibold">
          Is this AI or Not?
        </p>
      </GameCard>

      <div className="flex gap-6 justify-center flex-wrap mt-4">
        {["AI", "Not AI"].map((option) => (
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
        <FeedbackBubble message={feedback.message} type={feedback.type} />
      )}
    </GameShell>
  );
};

export default AIOrNotQuiz;
