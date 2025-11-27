import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HonestyPuzzleGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-94";
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
      question: "Match: Return Money → ?",
      choices: [
        { text: "Good 😊", correct: true },
        { text: "Wrong 😞", correct: false },
        { text: "Neutral 😐", correct: false },
      ],
    },
    {
      question: "Match: Keep Extra Change → ?",
      choices: [
        { text: "Good 😊", correct: false },
        { text: "Neutral 😐", correct: false },
        { text: "Wrong 😞", correct: true },
      ],
    },
    {
      question: "Match: Tell Truth About Spending → ?",
      choices: [
        { text: "Wrong 😞", correct: false },
        { text: "Good 😊", correct: true },
        { text: "Neutral 😐", correct: false },
      ],
    },
    {
      question: "Match: Borrow Without Asking → ?",
      choices: [
        { text: "Wrong 😞", correct: true },
        { text: "Good 😊", correct: false },
        { text: "Neutral 😐", correct: false },
      ],
    },
    {
      question: "Match: Save Honestly for Goals → ?",
      choices: [
        { text: "Wrong 😞", correct: false },
        { text: "Good 😊", correct: true },
        { text: "Neutral 😐", correct: false },
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
      title="Puzzle of Honesty"
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
      gameId="finance-kids-94"
      gameType="finance"
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      subtitle={showResult ? "Puzzle Complete!" : `Question ${currentStage + 1} of ${stages.length}`}>
      <div className="text-center text-white space-y-6">
        {!showResult && stages[currentStage] ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentStage + 1}/{stages.length}</span>
              <span className="text-yellow-400 font-bold">Score: {coins}/{stages.length}</span>
            </div>
            <div className="text-4xl mb-4">🧩</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice.correct)}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-6 py-3 rounded-full w-full hover:scale-105 transition-transform"
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

export default HonestyPuzzleGame;