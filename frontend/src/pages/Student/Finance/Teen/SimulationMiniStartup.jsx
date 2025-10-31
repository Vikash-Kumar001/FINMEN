import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationMiniStartup = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);

  const stages = [
    {
      id: 1,
      text: "You have ₹500 to start snack stall. Buy ingredients (₹300), profit ₹200. Smart?",
      options: [
        { id: "yes", text: "Yes", emoji: "✅", description: "Profitable choice", isCorrect: true },
        { id: "no", text: "No", emoji: "❌", description: "Not worth it", isCorrect: false }
      ],
      reward: 5
    },
    {
      id: 2,
      text: "You have ₹600 for a juice stall. Spend ₹400, profit ₹250. Good?",
      options: [
        { id: "yes", text: "Yes", emoji: "🍹", description: "Solid profit", isCorrect: true },
        { id: "no", text: "No", emoji: "🙅", description: "Too risky", isCorrect: false }
      ],
      reward: 5
    },
    {
      id: 3,
      text: "You have ₹700 for a craft stall. Spend ₹450, profit ₹300. Smart?",
      options: [
        { id: "yes", text: "Yes", emoji: "🎨", description: "Good return", isCorrect: true },
        { id: "no", text: "No", emoji: "🚫", description: "Not profitable", isCorrect: false }
      ],
      reward: 6
    },
    {
      id: 4,
      text: "You have ₹800 for a bake sale. Spend ₹500, profit ₹350. Wise?",
      options: [
        { id: "yes", text: "Yes", emoji: "🍰", description: "High return", isCorrect: true },
        { id: "no", text: "No", emoji: "❌", description: "Risky move", isCorrect: false }
      ],
      reward: 6
    },
    {
      id: 5,
      text: "You have ₹1000 for a small shop. Spend ₹600, profit ₹500. Smart?",
      options: [
        { id: "yes", text: "Yes", emoji: "💰", description: "Great profit", isCorrect: true },
        { id: "no", text: "No", emoji: "🙈", description: "Too much risk", isCorrect: false }
      ],
      reward: 7
    }
  ];

  const handleChoice = (choiceId) => {
    resetFeedback();
    const stage = stages[currentStage];
    const isCorrect = stage.options.find(opt => opt.id === choiceId)?.isCorrect;

    setSelectedChoice(choiceId);
    if (isCorrect) {
      setScore(prev => prev + stage.reward);
      showCorrectAnswerFeedback(stage.reward, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    if (currentStage < stages.length - 1) {
      setTimeout(() => {
        setCurrentStage(prev => prev + 1);
        setSelectedChoice(null);
        resetFeedback();
      }, 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleFinish = () => navigate("/student/finance/teen");

  return (
    <GameShell
      title="Simulation: Mini Startup"
      subtitle={`Stage ${currentStage + 1} of ${stages.length}`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      showGameOver={showResult}
      showConfetti={showResult && score >= 15}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId="finance-teens-158"
      gameType="simulation"
    >
      <div className="space-y-8 text-white">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Stage {currentStage + 1}/{stages.length}</span>
              <span className="text-yellow-400 font-bold">Coins: {score}</span>
            </div>
            <p className="text-xl mb-6">{stages[currentStage].text}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stages[currentStage].options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleChoice(opt.id)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">{opt.emoji}</div>
                  <h3 className="font-bold text-xl mb-2">{opt.text}</h3>
                  <p className="text-white/90">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h3 className="text-3xl font-bold mb-4">Mini Startup Star!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {score} coins!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{score} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Startups can be profitable with planning!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationMiniStartup;