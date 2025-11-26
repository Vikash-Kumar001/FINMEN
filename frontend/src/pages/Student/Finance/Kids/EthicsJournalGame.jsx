import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EthicsJournalGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-97";
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
      question: 'Write: “One time I used money honestly was ___.”',
      minLength: 10,
    },
    {
      question: 'Write: “I helped someone with money by ___.”',
      minLength: 10,
    },
    {
      question: 'Write: “A time I felt good about saving money was ___.”',
      minLength: 10,
    },
    {
      question: 'Write: “I avoided spending money wrongly by ___.”',
      minLength: 10,
    },
    {
      question: 'Write: “Being honest with money makes me feel ___.”',
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

  const handleFinish = () => {
    navigate("/games/financial-literacy/kids");
  };

  return (
    <GameShell
      title="Journal of Ethics"
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
      gameId="finance-kids-97"
      gameType="finance"
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      subtitle={showResult ? "Journal Complete!" : `Entry ${currentStage + 1} of ${stages.length}`}>
      <div className="text-center text-white space-y-6">
        {!showResult && stages[currentStage] ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Entry {currentStage + 1}/{stages.length}</span>
              <span className="text-yellow-400 font-bold">Score: {coins}/{stages.length}</span>
            </div>
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <textarea
              className="w-full p-4 rounded-xl text-black bg-white/90"
              rows={4}
              placeholder="Write your journal entry here..."
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-3 rounded-full mt-4 font-semibold transition-transform hover:scale-105"
              disabled={entry.trim().length < stages[currentStage].minLength}
            >
              Submit Journal
            </button>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default EthicsJournalGame;