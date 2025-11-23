import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Paintbrush } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterGrowYourMoney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Choose a poster: "Invest = Grow."',
      choices: [
        { text: "Invest = Grow 📈", correct: true },
        { text: "Spend Now 🛍️", correct: false },
        { text: "Hide Money 🏺", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Save a Little, Grow a Lot."',
      choices: [
        { text: "Save a Little, Grow a Lot 💰", correct: true },
        { text: "Buy Toys Now 🧸", correct: false },
        { text: "Give Money Away 🎁", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Grow Money with Banks."',
      choices: [
        { text: "Grow Money with Banks 🏦", correct: true },
        { text: "Spend Fast 🎉", correct: false },
        { text: "Keep Cash at Home 🏺", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Invest Smart, Win Big."',
      choices: [
        { text: "Invest Smart, Win Big 📊", correct: true },
        { text: "Spend Without Plan 🛒", correct: false },
        { text: "Lose Money Fast 💸", correct: false },
      ],
    },
    {
      question: 'Why do posters about growing money help?',
      choices: [
        { text: "Teach kids to invest wisely 📚", correct: true },
        { text: "Make spending fun 🎉", correct: false },
        { text: "Get more toys 🧸", correct: false },
      ],
    },
  ];

  const handleSelect = (isCorrect) => {
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
      title="Poster: Grow Your Money"
      subtitle="Choose posters that promote smart investing!"
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
      gameId="finance-kids-126"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Paintbrush className="mx-auto mb-4 w-8 h-8 text-yellow-400" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(choice.correct)}
                  className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-emerald-600 transition-transform hover:scale-105"
                >
                  <div className="text-lg font-semibold">{choice.text}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-8xl mb-4">🏅</div>
            <h3 className="text-3xl font-bold mb-4">Investment Poster Star!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for promoting growth!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Investing grows your money!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterGrowYourMoney;