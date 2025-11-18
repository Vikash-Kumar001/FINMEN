import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WrongLabelsPuzzle = () => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    { id: 1, emoji: "🍎", correctLabel: "Apple", options: ["Apple", "Banana", "Cherry"] },
    { id: 2, emoji: "🍌", correctLabel: "Banana", options: ["Apple", "Banana", "Cherry"] },
    { id: 3, emoji: "🍓", correctLabel: "Strawberry", options: ["Apple", "Banana", "Strawberry"] },
    { id: 4, emoji: "🍒", correctLabel: "Cherry", options: ["Apple", "Banana", "Cherry"] },
    { id: 5, emoji: "🍋", correctLabel: "Lemon", options: ["Lemon", "Apple", "Banana"] }
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
  };

  const handleConfirm = () => {
    const isCorrect = selectedChoice === currentItemData.correctLabel;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    setSelectedChoice(null);

    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem(prev => prev + 1);
      }, 600);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentItem(0);
    setSelectedChoice(null);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/robot-practice-game"); // Update with actual next game path
  };

  return (
    <GameShell
      title="Wrong Labels Puzzle"
      subtitle={`Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 4}
      showGameOver={showResult && score >= 4}
      score={coins}
      gameId="ai-kids-72"
      gameType="ai"
      totalLevels={100}
      currentLevel={72} // Update the current level appropriately
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Correct the label for the robot!
            </h3>

            <div className="bg-blue-500/20 rounded-lg p-6 mb-6">
              <div className="text-6xl mb-3 text-center">{currentItemData.emoji}</div>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">Choose the correct label:</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {currentItemData.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(option)}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    selectedChoice === option
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-white font-bold text-xl text-center">{option}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 4 ? "🎯 Great Job!" : "💪 Keep Correcting!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You corrected {score} out of {items.length} labels correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm text-center">
                💡 Accurate data labeling helps AI learn correctly. You trained the robot well!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 4 ? "You earned 5 Coins! 🪙" : "Get 4 or more correct to earn coins!"}
            </p>
            {score < 4 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WrongLabelsPuzzle;
