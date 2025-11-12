import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterBanksHelp = () => {
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
      question: 'Choose a poster: "Bank = Safe Money."',
      choices: [
        { text: "Bank = Safe Money 🏦", correct: true },
        { text: "Spend Fast 🛍️", correct: false },
        { text: "Hide Money at Home 🏺", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Banks Keep Money Safe."',
      choices: [
        { text: "Banks Keep Money Safe 🔒", correct: true },
        { text: "Spend All Now 🎉", correct: false },
        { text: "Money Under Bed 🛏️", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Save in Bank, Grow Money."',
      choices: [
        { text: "Save in Bank, Grow Money 📈", correct: true },
        { text: "Buy Toys Now 🧸", correct: false },
        { text: "Give Money Away 🎁", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Banks Protect Your Savings."',
      choices: [
        { text: "Banks Protect Your Savings 💰", correct: true },
        { text: "Spend Without Plan 🛒", correct: false },
        { text: "Keep Cash in Pocket 🎒", correct: false },
      ],
    },
    {
      question: 'Why do posters about banks help kids?',
      choices: [
        { text: "Teach safe money habits 📚", correct: true },
        { text: "Make banks fun 🎉", correct: false },
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
      title="Poster: Banks Help"
      subtitle="Choose posters that promote safe banking!"
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
      gameId="finance-kids-86"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(choice.correct)}
                  className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-yellow-500 transition-transform hover:scale-105"
                >
                  <div className="text-lg font-semibold">{choice.text}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-3" />
            <h3 className="text-3xl font-bold mb-4">Bank Poster Pro!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for promoting safe banking!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Banks keep your money safe!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterBanksHelp;