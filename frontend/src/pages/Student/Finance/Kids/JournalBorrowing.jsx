import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalBorrowing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Write: "One thing I borrowed and returned was ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I felt ___ when I returned what I borrowed."',
      minLength: 10,
    },
    {
      question: 'Write: "Borrowing responsibly means ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I made sure to return borrowed money by ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Borrowing taught me ___ about money."',
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
      title="Journal of Borrowing"
      subtitle="Reflect on responsible borrowing!"
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
      gameId="finance-kids-107"
      gameType="finance"
    >
      <div className="text-center text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full max-w-md p-4 rounded-xl text-black bg-white/90"
              placeholder="Write your journal entry here..."
            />
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-lg font-bold mt-4 transition-transform hover:scale-105"
              disabled={entry.trim().length < stages[currentStage].minLength}
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-6xl mb-4">🎉📝</div>
            <h3 className="text-3xl font-bold mb-4">Borrowing Expert!</h3>
            <p className="text-white/90 text-xl mb-6">
              You earned {coins} out of 5 for thoughtful entries!
            </p>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Responsible borrowing builds trust!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalBorrowing;