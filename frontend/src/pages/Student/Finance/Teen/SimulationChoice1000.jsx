import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationChoice1000 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-138";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);

  const stages = [
    {
      id: 1,
      text: "You have ₹1000. Options: (a) FD, (b) Stocks, (c) Spend",
      options: [
        { id: "mix", text: "Mix FD + Stocks", emoji: "🔄", description: "Balanced approach", isCorrect: true },
        { id: "spend", text: "Spend", emoji: "🛍️", description: "No growth", isCorrect: false }
      ],
      reward: 5
    },
    {
      id: 2,
      text: "You have ₹1500. Options: (a) Savings, (b) Mutual Fund, (c) Spend",
      options: [
        { id: "mix", text: "Mix Savings + Mutual Fund", emoji: "📈", description: "Safe and growth", isCorrect: true },
        { id: "spend", text: "Spend", emoji: "💸", description: "Loses value", isCorrect: false }
      ],
      reward: 5
    },
    {
      id: 3,
      text: "You have ₹1200. Options: (a) FD, (b) Crypto, (c) Spend",
      options: [
        { id: "mix", text: "Mix FD + Crypto", emoji: "🛡️", description: "Balanced risk", isCorrect: true },
        { id: "spend", text: "Spend", emoji: "🛍️", description: "No investment", isCorrect: false }
      ],
      reward: 6
    },
    {
      id: 4,
      text: "You have ₹2000. Options: (a) Bonds, (b) Stocks, (c) Spend",
      options: [
        { id: "mix", text: "Mix Bonds + Stocks", emoji: "🔄", description: "Diversified growth", isCorrect: true },
        { id: "spend", text: "Spend", emoji: "💸", description: "No returns", isCorrect: false }
      ],
      reward: 6
    },
    {
      id: 5,
      text: "You have ₹1800. Options: (a) FD, (b) Mutual Fund, (c) Spend",
      options: [
        { id: "mix", text: "Mix FD + Mutual Fund", emoji: "📊", description: "Stable and growth", isCorrect: true },
        { id: "spend", text: "Spend", emoji: "🛍️", description: "Missed opportunity", isCorrect: false }
      ],
      reward: 7
    }
  ];

  const handleChoice = (choiceId) => {
    resetFeedback();
    const stage = stages[currentStage];
    const isCorrect = stage.options.find(opt => opt.id === choiceId)?.isCorrect;

    setSelectedChoice(choiceId);
    if (isCorrect) {
      setScore(prev => prev + stage.reward);
      showCorrectAnswerFeedback(stage.reward, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    if (currentStage < stages.length - 1) {
      setTimeout(() => {
        setCurrentStage(prev => prev + 1);
        setSelectedChoice(null);
        resetFeedback();
      }, 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleFinish = () => navigate("/student/finance/teen");

  return (
    <GameShell
      title="Simulation: ₹1000 Choice"
      subtitle={`Stage ${currentStage + 1} of ${stages.length}`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      showGameOver={showResult}
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score>= 15}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId="finance-teens-138"
      gameType="simulation"
    >
      <div className="space-y-8 text-white">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Stage {currentStage + 1}/{stages.length}</span>
              <span className="text-yellow-400 font-bold">Coins: {score}</span>
            </div>
            <p className="text-xl mb-6">{stages[currentStage].text}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stages[currentStage].options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleChoice(opt.id)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">{opt.emoji}</div>
                  <h3 className="font-bold text-xl mb-2">{opt.text}</h3>
                  <p className="text-white/90">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h3 className="text-3xl font-bold mb-4">Investment Choice Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {score} coins!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{score} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Mix investments for balance!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationChoice1000;