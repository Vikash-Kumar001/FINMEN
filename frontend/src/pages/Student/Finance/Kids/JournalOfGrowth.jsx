import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { PenSquare } from "lucide-react";

const JournalOfGrowth = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Write: "If I invest ₹100, I want it to grow into ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Investing money makes me feel ___."',
      minLength: 10,
    },
    {
      question: 'Write: "One thing I learned about investing is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I would invest ₹100 to help ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Growing money taught me ___ about patience."',
      minLength: 10,
    },
  ];

  const handleSubmit = () => {
    resetFeedback();
    if (entry.trim().length >= stages[currentStage].minLength) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
      if (currentStage < stages.length - 1) {
        setTimeout(() => {
          setEntry("");
          setCurrentStage((prev) => prev + 1);
        }, 800);
      } else {
        setTimeout(() => setShowResult(true), 800);
      }
    }
  };

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Journal of Growth"
      subtitle="Reflect on growing your money!"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-kids-127"
      gameType="finance"
    >
      <div className="text-center text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <PenSquare className="mx-auto mb-4 w-10 h-10 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full md:w-2/3 h-40 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={handleSubmit}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-transform hover:scale-105 mt-4"
              disabled={entry.trim().length < stages[currentStage].minLength}
            >
              Submit Journal
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-3">📔✨</div>
            <h3 className="text-3xl font-bold mb-4">Growth Master!</h3>
            <p className="text-white/90 text-xl mb-6">
              You earned {coins} out of 5 for thoughtful reflections!
            </p>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Investing wisely grows your future!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfGrowth;