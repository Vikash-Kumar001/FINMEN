import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JournalSafety = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-87";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Write: "One way I can avoid being cheated is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I stay safe with money by ___."',
      minLength: 10,
    },
    {
      question: 'Write: "A time I avoided a money scam was ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I learned ___ about keeping money safe."',
      minLength: 10,
    },
    {
      question: 'Write: "Being careful with money makes me feel ___."',
      minLength: 10,
    },
  ];

  const handleSubmit = () => {
    resetFeedback();
    if (entry.trim().length >= stages[currentStage].minLength) {
      setScore((prev) => prev + 1);
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

  const finalScore = score;

  return (
    <GameShell
      title="Journal of Safety"
      subtitle={`Question ${currentStage + 1} of ${stages.length}: Reflect on staying safe with money!`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId="finance-kids-167"
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
          <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Write your journal entry here..."
            className="w-full p-4 rounded-lg text-black bg-white/90"
            rows="4"
            disabled={showResult}
          />
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-full font-bold mt-4 transition-transform hover:scale-105"
            disabled={entry.trim().length < stages[currentStage].minLength || showResult}
          >
            Submit Journal
          </button>
        </div>
      </div>
    </GameShell>
  );
};

export default JournalSafety;