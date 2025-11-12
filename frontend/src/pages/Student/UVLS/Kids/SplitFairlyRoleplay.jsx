import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SplitFairlyRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      resource: "5 stickers.",
      options: [
        { id: "a", text: "Split 2 and 3", emoji: "🖼️", isFair: false },
        { id: "b", text: "Split 2.5 each", emoji: "🤝", isFair: true },
        { id: "c", text: "One gets all", emoji: "👤", isFair: false }
      ]
    },
    {
      id: 2,
      resource: "4 cakes.",
      options: [
        { id: "a", text: "2 each", emoji: "🍰", isFair: true },
        { id: "b", text: "3 and 1", emoji: "😔", isFair: false },
        { id: "c", text: "Eat all alone", emoji: "😋", isFair: false }
      ]
    },
    {
      id: 3,
      resource: "6 candies.",
      options: [
        { id: "a", text: "3 each", emoji: "🍬", isFair: true },
        { id: "b", text: "4 and 2", emoji: "🤔", isFair: false },
        { id: "c", text: "Throw half", emoji: "🗑️", isFair: false }
      ]
    },
    {
      id: 4,
      resource: "2 toys.",
      options: [
        { id: "a", text: "One each", emoji: "🧸", isFair: true },
        { id: "b", text: "Both to one", emoji: "👥", isFair: false },
        { id: "c", text: "Break one", emoji: "💥", isFair: false }
      ]
    },
    {
      id: 5,
      resource: "10 minutes play.",
      options: [
        { id: "a", text: "5 each", emoji: "⏰", isFair: true },
        { id: "b", text: "7 and 3", emoji: "😠", isFair: false },
        { id: "c", text: "No play", emoji: "🚫", isFair: false }
      ]
    }
  ];

  const handleChoice = (selectedOption) => {
    const newChoices = [...choices, selectedOption];
    setChoices(newChoices);

    const isFair = questions[currentLevel].options.find(opt => opt.id === selectedOption)?.isFair;
    if (isFair) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isFair ? 800 : 0);
    } else {
      const fairChoices = newChoices.filter((sel, idx) => questions[idx].options.find(opt => opt.id === sel)?.isFair).length;
      setFinalScore(fairChoices);
      if (fairChoices >= 3) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Split Fairly Roleplay"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-75"
      gameType="uvls"
      totalLevels={100}
      currentLevel={75}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4 font-semibold">
                Share {getCurrentLevel().resource}
              </p>
              <div className="space-y-3">
                {getCurrentLevel().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 flex items-center gap-3"
                  >
                    <div className="text-3xl">{option.emoji}</div>
                    <div className="text-white font-medium text-left">{option.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Fair Splitter!" : "💪 Split Fairer!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You split fairly {finalScore} times!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 5 Coins! 🪙" : "Try again!"}
            </p>
            {finalScore < 3 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SplitFairlyRoleplay;