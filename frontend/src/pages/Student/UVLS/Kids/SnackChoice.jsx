import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SnackChoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-51";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      scenario: "You're hungry after play.",
      options: [
        { id: "a", text: "Apple", emoji: "🍎", isHealthy: true },
        { id: "b", text: "Candy", emoji: "🍬", isHealthy: false },
        { id: "c", text: "Chips", emoji: "🥔", isHealthy: false }
      ]
    },
    {
      id: 2,
      scenario: "Need energy for homework.",
      options: [
        { id: "a", text: "Banana", emoji: "🍌", isHealthy: true },
        { id: "b", text: "Soda", emoji: "🥤", isHealthy: false },
        { id: "c", text: "Cookies", emoji: "🍪", isHealthy: false }
      ]
    },
    {
      id: 3,
      scenario: "Feeling tired.",
      options: [
        { id: "a", text: "Yogurt", emoji: "🥛", isHealthy: true },
        { id: "b", text: "Ice cream", emoji: "🍨", isHealthy: false },
        { id: "c", text: "Cake", emoji: "🍰", isHealthy: false }
      ]
    },
    {
      id: 4,
      scenario: "Before bed snack.",
      options: [
        { id: "a", text: "Milk", emoji: "🥛", isHealthy: true },
        { id: "b", text: "Chocolate", emoji: "🍫", isHealthy: false },
        { id: "c", text: "Gum", emoji: "🍬", isHealthy: false }
      ]
    },
    {
      id: 5,
      scenario: "After sports.",
      options: [
        { id: "a", text: "Orange", emoji: "🍊", isHealthy: true },
        { id: "b", text: "Donut", emoji: "🍩", isHealthy: false },
        { id: "c", text: "Pizza", emoji: "🍕", isHealthy: false }
      ]
    }
  ];

  const handleChoice = (selectedOption) => {
    const newChoices = [...choices, selectedOption];
    setChoices(newChoices);

    const isHealthy = questions[currentLevel].options.find(opt => opt.id === selectedOption)?.isHealthy;
    if (isHealthy) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isHealthy ? 800 : 0);
    } else {
      const healthyChoices = newChoices.filter((sel, idx) => questions[idx].options.find(opt => opt.id === sel)?.isHealthy).length;
      setFinalScore(healthyChoices);
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
      title="Snack Choice"
      score={coins}
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-51"
      gameType="uvls"
      totalLevels={70}
      currentLevel={51}
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
                {getCurrentLevel().scenario}
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
              {finalScore >= 3 ? "🎉 Healthy Chooser!" : "💪 Choose Healthier!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You chose healthy {finalScore} times!
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

export default SnackChoice;