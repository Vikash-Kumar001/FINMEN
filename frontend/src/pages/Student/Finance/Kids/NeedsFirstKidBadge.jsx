import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const NeedsFirstKidBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-40";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: "You have ₹20. Buy candy or a school notebook?",
      choices: [
        { text: "Notebook 📓", correct: true },
        { text: "Candy 🍬", correct: false },
        { text: "Toys 🧸", correct: false },
      ],
    },
    {
      question: "You need ₹15 for lunch. You have ₹10. What’s smart?",
      choices: [
        { text: "Buy snacks 🍟", correct: false },
        { text: "Borrow ₹5 🙈", correct: false },
        { text: "Save ₹5 more 💰", correct: true },
      ],
    },
    {
      question: "You want a game but need shoes. What comes first?",
      choices: [
        { text: "Shoes 👟", correct: true },
        { text: "Game 🎮", correct: false },
        { text: "Both 🛍️", correct: false },
      ],
    },
    {
      question: "You have ₹30. Spend on needs or wants?",
      choices: [
        { text: "Needs like books 📚", correct: true },
        { text: "Wants like toys 🧸", correct: false },
        { text: "Give it away 🎁", correct: false },
      ],
    },
    {
      question: "Why prioritize needs over wants?",
      choices: [
        { text: "Gets you more toys 🛒", correct: false },
        { text: "Meets essentials first 🥗", correct: true },
        { text: "Makes you popular 👥", correct: false },
      ],
    },
  ];

  const handleChoice = (isCorrect) => {
    resetFeedback();
    if (isCorrect) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage((prev) => prev + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleFinish = () => {
    navigate("/games/financial-literacy/kids");
  };

  return (
    <GameShell
      title="Badge: Needs First Kid"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={handleFinish}
      nextEnabled={false}
      showGameOver={showResult}
      showConfetti={showResult && coins === stages.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-kids-40"
      gameType="finance"
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentStage + 1} of ${stages.length}`}>
      <div className="text-center text-white space-y-8">
        {!showResult && stages[currentStage] ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentStage + 1}/{stages.length}</span>
              <span className="text-yellow-400 font-bold">Score: {coins}/{stages.length}</span>
            </div>
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="flex justify-center gap-6 flex-wrap">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default NeedsFirstKidBadge;