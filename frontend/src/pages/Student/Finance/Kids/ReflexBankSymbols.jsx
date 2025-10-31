import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexBankSymbols = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [target, setTarget] = useState("");

  const stages = [
    { symbol: "₹", wrong: "$", prompt: "Tap the ₹ symbol!" },
    { symbol: "Bank", wrong: "Toy", prompt: "Tap the Bank symbol!" },
    { symbol: "Save", wrong: "Spend", prompt: "Tap the Save symbol!" },
    { symbol: "Coin", wrong: "Candy", prompt: "Tap the Coin symbol!" },
    { symbol: "Vault", wrong: "Box", prompt: "Tap the Vault symbol!" },
  ];

  useEffect(() => {
    if (currentStage < stages.length) {
      setTarget(Math.random() < 0.7 ? stages[currentStage].symbol : stages[currentStage].wrong);
    }
  }, [currentStage]);

  const handleTap = (symbol) => {
    resetFeedback();
    if (symbol === stages[currentStage].symbol) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
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
      title="Reflex Banking Symbols"
      subtitle={stages[currentStage]?.prompt || "Test your banking symbol reflexes!"}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId="finance-kids-89"
      gameType="finance"
    >
      <div className="text-center text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-2xl font-bold mb-4">Round {currentStage + 1}</h3>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleTap(stages[currentStage].symbol)}
                className="bg-green-500 px-8 py-4 rounded-full text-white font-bold hover:scale-105 transition-transform"
              >
                {stages[currentStage].symbol}
              </button>
              <button
                onClick={() => handleTap(stages[currentStage].wrong)}
                className="bg-red-500 px-8 py-4 rounded-full text-white font-bold hover:scale-105 transition-transform"
              >
                {stages[currentStage].wrong}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-3" />
            <h3 className="text-3xl font-bold mb-4">Symbol Reflex Master!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {score} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{score} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Know your banking symbols!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexBankSymbols;