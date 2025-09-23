import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const RobotEmotionStoryShell = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [flashPoints, setFlashPoints] = useState(null); // ✅ Score flash
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ for congratulations modal

  const scenarios = [
    { id: 1, scenario: '🤖 Robot sees a sad person. What should it do?', correctAnswer: 'comfort them', options: ['comfort them', 'ignore them', 'laugh', 'run away'], rewardPoints: 5 },
    { id: 2, scenario: '🤖 Robot sees someone happy. What should it do?', correctAnswer: 'celebrate with them', options: ['celebrate with them', 'ignore them', 'get sad', 'run away'], rewardPoints: 5 },
    { id: 3, scenario: '🤖 Robot sees someone angry. What should it do?', correctAnswer: 'stay calm', options: ['stay calm', 'get angry too', 'ignore them', 'run away'], rewardPoints: 5 },
    { id: 4, scenario: '🤖 Robot sees someone scared. What should it do?', correctAnswer: 'reassure them', options: ['reassure them', 'scare them more', 'ignore them', 'run away'], rewardPoints: 5 },
    { id: 5, scenario: '🤖 Robot sees someone excited. What should it do?', correctAnswer: 'share their joy', options: ['share their joy', 'ignore them', 'get sad', 'run away'], rewardPoints: 5 },
  ];

  const currentScenario = scenarios[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentScenario.correctAnswer) {
      setScore(prev => prev + currentScenario.rewardPoints);
      setFlashPoints(currentScenario.rewardPoints); // ✅ trigger score flash
      setFeedback({ message: "Great! Robot shows empathy!", type: "correct" });
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
      setFeedback({ message: "", type: "" });
      setSelectedOption(null);
      setIsOptionDisabled(false);
    } else {
      setShowModal(true); // ✅ show congratulations modal
    }
  };

  return (
    <GameShell
      gameId="robot-emotion-story"
      gameType="ai"
      totalLevels={scenarios.length}
      title="Robot Emotion Story"
      subtitle=""
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{scenarios.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={!!feedback.message && isOptionDisabled}
      showGameOver={showModal} // centralized congratulations modal
      score={score} // pass final score
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />} {/* ✅ score flash */}

      <LevelCompleteHandler gameId="robot-emotion-story" gameType="ai" levelNumber={currentLevelIndex + 1}>
        <GameCard>
          <div className="text-xl font-bold text-white">{currentScenario.scenario}</div>
        </GameCard>
      </LevelCompleteHandler>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
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

      {feedback.message && (
        <div className="mt-6">
          <FeedbackBubble message={feedback.message} type={feedback.type} />
        </div>
      )}
    </GameShell>
  );
};

export default RobotEmotionStoryShell;
