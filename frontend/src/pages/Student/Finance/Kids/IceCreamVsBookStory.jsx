import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const IceCreamVsBookStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-31";
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
      question: "You have ₹20. Buy ice cream or a book for class?",
      choices: [
        { text: "Buy ice cream 🍦", correct: false },
        { text: "Buy a book 📚", correct: true },
        { text: "Spend on toys 🧸", correct: false },
      ],
    },
    {
      question: "A book costs ₹15, ice cream ₹10. You have ₹12. What’s smart?",
      choices: [
        { text: "Save ₹3 more for the book 💰", correct: true },
        { text: "Buy ice cream now 🍦", correct: false },
        { text: "Borrow ₹3 🙈", correct: false },
      ],
    },
    {
      question: "You saved ₹20. A sale offers books for ₹18. Can you buy one?",
      choices: [
        { text: "Yes, and have ₹2 left 📚", correct: true },
        { text: "No, need ₹2 more 📉", correct: false },
        { text: "Buy ice cream instead 🍦", correct: false },
      ],
    },
    {
      question: "Your friend wants ice cream but you need a book. What do you do?",
      choices: [
        { text: "Stick to buying the book ✅", correct: true },
        { text: "Split money for ice cream 🎉", correct: false },
        { text: "Give money to friend 🎁", correct: false },
      ],
    },
    {
      question: "Why is choosing a book over ice cream smart?",
      choices: [
        { text: "Helps you learn and grow 🧠", correct: true },
        { text: "Tastes better than ice cream 🍦", correct: false },
        { text: "Gets you more friends 👥", correct: false },
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

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Ice Cream vs School Book Story"
      subtitle="Make the smart choice!"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-kids-61"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">📚🍦</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-4 rounded-xl text-lg font-bold transition-transform hover:scale-105"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">🎉📚</div>
            <h3 className="text-3xl font-bold mb-4">Smart Learner!</h3>
            <p className="text-white/90 text-xl mb-6">
              You earned {coins} out of 5 — great choices!
            </p>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Choosing needs over wants helps you grow!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default IceCreamVsBookStory;