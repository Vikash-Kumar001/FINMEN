import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const RecommendationGame = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [flashPoints, setFlashPoints] = useState(null); // ✅ Score flash
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ Congratulations modal

  const recommendations = [
    { id: 1, scenario: "🍎 You like apples. What should AI recommend?", correctAnswer: "more fruits", options: ["more fruits", "vegetables", "meat", "candy"], rewardPoints: 5 },
    { id: 2, scenario: "📚 You read mystery books. What should AI recommend?", correctAnswer: "more mystery books", options: ["more mystery books", "cooking books", "science books", "comics"], rewardPoints: 5 },
    { id: 3, scenario: "🎵 You listen to pop music. What should AI recommend?", correctAnswer: "similar pop songs", options: ["similar pop songs", "classical music", "rock music", "jazz"], rewardPoints: 5 },
    { id: 4, scenario: "🎮 You play puzzle games. What should AI recommend?", correctAnswer: "more puzzle games", options: ["more puzzle games", "action games", "sports games", "racing games"], rewardPoints: 5 },
    { id: 5, scenario: "🍕 You order pizza often. What should AI recommend?", correctAnswer: "different pizza types", options: ["different pizza types", "burgers", "salads", "sushi"], rewardPoints: 5 },
  ];

  const currentRecommendation = recommendations[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentRecommendation.correctAnswer) {
      setScore(prev => prev + currentRecommendation.rewardPoints);
      setFlashPoints(currentRecommendation.rewardPoints); // ✅ trigger score flash
      setFeedback({ message: "Great! Good recommendation!", type: "correct" });
      setShowConfetti(true);

      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({ message: `Wrong! Correct: ${currentRecommendation.correctAnswer}`, type: "wrong" });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);

    if (currentLevelIndex < recommendations.length - 1) {
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
      gameId="recommendation-game"
      gameType="ai"
      totalLevels={recommendations.length}
      title="Recommendation Game"
      subtitle=""
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{recommendations.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={!!feedback.message && isOptionDisabled}
      showGameOver={showModal} // ✅ centralized congratulations modal
      score={score} // pass final score
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />} {/* ✅ Score flash */}

      <LevelCompleteHandler gameId="recommendation-game" gameType="ai" levelNumber={currentLevelIndex + 1}>
        <GameCard>
          <p className="text-xl font-bold text-white">{currentRecommendation.scenario}</p>
        </GameCard>
      </LevelCompleteHandler>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {currentRecommendation.options.map((option, idx) => (
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

export default RecommendationGame;
