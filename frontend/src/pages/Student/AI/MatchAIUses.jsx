import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const MatchAIUses = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [flashPoints, setFlashPoints] = useState(null); // ✅ Score flash
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [showConfetti, setShowConfetti] = useState(false);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ Congratulations modal

  const matches = [
    { use: "Voice Assistant", correctAnswer: "Siri", options: ["Siri", "Calculator", "Remote", "TV"], rewardPoints: 5 },
    { use: "Smart Speaker", correctAnswer: "Alexa", options: ["Alexa", "Radio", "Phone", "Computer"], rewardPoints: 5 },
    { use: "Chat Bot", correctAnswer: "ChatGPT", options: ["ChatGPT", "Email", "Text", "Call"], rewardPoints: 5 },
    { use: "Search Engine", correctAnswer: "Google", options: ["Google", "Calculator", "Phone", "TV"], rewardPoints: 5 },
    { use: "Navigation", correctAnswer: "GPS", options: ["GPS", "Map", "Compass", "Clock"], rewardPoints: 5 },
  ];

  const currentMatch = matches[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;
    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentMatch.correctAnswer) {
      setScore(prev => prev + currentMatch.rewardPoints);
      setFlashPoints(currentMatch.rewardPoints); // ✅ trigger flash
      setFeedback({ message: "Great! Perfect match!", type: "correct" });
      setShowConfetti(true);
      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({ message: `Wrong! Correct answer: ${currentMatch.correctAnswer}`, type: "wrong" });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);

    if (currentLevelIndex < matches.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setSelectedOption(null);
      setFeedback({ message: "", type: "" });
      setIsOptionDisabled(false);
    } else {
      setShowModal(true); // ✅ show congratulations modal
    }
  };

  return (
    <GameShell
      title="Match AI Uses"
      subtitle=""
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{matches.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={feedback.message && isOptionDisabled}
      showGameOver={showModal} // ✅ centralized congratulations modal
      score={score} // pass score to modal
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />} {/* ✅ Score flash */}

      <GameCard>
        <div className="text-3xl font-bold text-white">{currentMatch.use}</div>
        <p className="font-semibold text-white/80">Which AI tool does this?</p>
      </GameCard>

      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {currentMatch.options.map((option) => (
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

export default MatchAIUses;
