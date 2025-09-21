import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const RobotHelperStory = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [flashPoints, setFlashPoints] = useState(null); // ✅ Score flash

  const scenarios = [
    { text: "🤖 Robot helps clean the room. What should you do?", correctAnswer: "Thank robot", options: ["Thank robot", "Ignore"], rewardPoints: 5 },
    { text: "🤖 Robot finds a spilled cup. What should it do?", correctAnswer: "Clean it", options: ["Clean it", "Get angry"], rewardPoints: 5 },
    { text: "🤖 Robot drops a toy. What should you do?", correctAnswer: "Pick it up", options: ["Throw it", "Pick it up"], rewardPoints: 5 },
    { text: "🤖 Robot needs charging. What should it do?", correctAnswer: "Go to charger", options: ["Go to charger", "Keep moving randomly"], rewardPoints: 5 },
    { text: "🤖 Robot sees someone sad. What should it do?", correctAnswer: "Comfort them", options: ["Comfort them", "Ignore"], rewardPoints: 5 },
  ];

  const currentScenario = scenarios[currentIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentScenario.correctAnswer) {
      setScore(prev => prev + currentScenario.rewardPoints);
      setFlashPoints(currentScenario.rewardPoints); // ✅ trigger score flash
      setFeedback({ message: "Great! Correct choice!", type: "correct" });
      setShowConfetti(true);

      // remove flash after 1 second
      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({
        message: `Oops! The right choice is: ${currentScenario.correctAnswer}`,
        type: "wrong",
      });
      setShowConfetti(false);
    }
  };

  const handleNext = () => {
    setShowConfetti(false);
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setFeedback({ message: "", type: "" });
      setIsOptionDisabled(false);
    } else {
      setShowGameOver(true); // 🎉 trigger congratulations modal
    }
  };

  return (
    <GameShell
      title="Robot Helper Story"
      subtitle="Pick the kind and safe choice"
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentIndex + 1}/{scenarios.length}
        </div>
      }
      onNext={handleNext}
      nextEnabled={feedback.message && isOptionDisabled}
      showGameOver={showGameOver}
      score={score}
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />} {/* ✅ Score flash */}

      <GameCard>
        <p style={{ fontWeight: "bold", fontSize: "clamp(18px, 4vw, 28px)", color: "white" }}>
          {currentScenario.text}
        </p>
      </GameCard>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
        {currentScenario.options.map((option, index) => (
          <OptionButton
            key={index}
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

export default RobotHelperStory;
