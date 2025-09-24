import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const RobotHelperReflex = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [flashPoints, setFlashPoints] = useState(null); // ✅ Score flash
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ Congratulations modal

  const reflexes = [
    { id: 1, scenario: "🚨 Emergency! What should robot do first?", correctAnswer: "call for help", options: ["call for help", "run away", "ignore", "laugh"], rewardPoints: 5 },
    { id: 2, scenario: "🔥 Fire detected! What should robot do?", correctAnswer: "alert everyone", options: ["alert everyone", "hide", "ignore", "laugh"], rewardPoints: 5 },
    { id: 3, scenario: "🚑 Someone is hurt! What should robot do?", correctAnswer: "get help", options: ["get help", "run away", "ignore", "laugh"], rewardPoints: 5 },
    { id: 4, scenario: "🚪 Door is stuck! What should robot do?", correctAnswer: "try to open", options: ["try to open", "give up", "ignore", "laugh"], rewardPoints: 5 },
    { id: 5, scenario: "📞 Phone is ringing! What should robot do?", correctAnswer: "answer it", options: ["answer it", "ignore it", "break it", "laugh"], rewardPoints: 5 },
  ];

  const currentReflex = reflexes[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentReflex.correctAnswer) {
      setScore(prev => prev + currentReflex.rewardPoints);
      setFlashPoints(currentReflex.rewardPoints); // ✅ trigger score flash
      setFeedback({ message: "Great! Good reflex!", type: "correct" });
      setShowConfetti(true);

      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({ message: `Wrong! Correct answer: ${currentReflex.correctAnswer}`, type: "wrong" });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);

    if (currentLevelIndex < reflexes.length - 1) {
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
      gameId="robot-helper-reflex"
      gameType="ai"
      totalLevels={reflexes.length}
      title="Robot Helper Reflex"
      subtitle=""
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{reflexes.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={feedback.message && isOptionDisabled}
      showGameOver={showModal} // ✅ centralized congratulations modal
      score={score} // pass final score
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />} {/* ✅ Score flash */}

      <LevelCompleteHandler gameId="robot-helper-reflex" gameType="ai" levelNumber={currentLevelIndex + 1}>
        <GameCard>
          <div className="text-xl md:text-2xl font-bold text-white">{currentReflex.scenario}</div>
        </GameCard>
      </LevelCompleteHandler>

      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {currentReflex.options.map(option => (
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

export default RobotHelperReflex;
