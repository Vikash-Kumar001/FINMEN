import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { PenSquare } from "lucide-react";
import { getGameDataById } from "../../../../utils/getGameData";

const JournalOfBudgeting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-27";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Write: "One time I planned my money wisely was ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Budgeting helps me because ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I saved money for ___ and felt ___."',
      minLength: 10,
    },
    {
      question: 'Write: "A smart budgeting tip I learned is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Planning my money makes me feel ___."',
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
      title="Journal of Budgeting"
      subtitle="Reflect and write about your smart money use."
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
      gameId="finance-kids-27"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <PenSquare className="mx-auto w-10 h-10 text-emerald-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full md:w-2/3 h-40 p-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={handleSubmit}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-transform hover:scale-105 mt-4"
              disabled={entry.trim().length < stages[currentStage].minLength}
            >
              Submit Journal
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4">📔✨</div>
            <h3 className="text-3xl font-bold mb-4">Budgeting Pro!</h3>
            <p className="text-white/90 text-xl mb-6">
              You earned {coins} out of 5 — awesome planning!
            </p>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Budgeting makes your money work smarter!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfBudgeting;