import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PlaygroundReflex = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    { id: 1, situation: "A child is being insulted by others on the playground.", correctAction: "Help" },
    { id: 2, situation: "Two kids are fighting over a toy.", correctAction: "Help" },
    { id: 3, situation: "A group of friends is laughing at a shy student.", correctAction: "Help" },
    { id: 4, situation: "Someone falls while running and gets hurt.", correctAction: "Help" },
    { id: 5, situation: "Everyone is playing happily together.", correctAction: "Ignore" },
  ];

  const currentData = scenarios[currentScenario];

  const handleChoice = (action) => {
    const isCorrect = currentData.correctAction === action;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario((prev) => prev + 1);
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / scenarios.length) * 100;
      if (accuracy >= 70) setCoins(3);
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setGameStarted(false);
    setCurrentScenario(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/respect-hero-badge");
  };

  const accuracy = Math.round((score / scenarios.length) * 100);

  return (
    <GameShell
      title="Playground Reflex"
      subtitle={gameStarted ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Reflex Action Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="dcos-kids-89"
      gameType="reflex"
      totalLevels={100}
      currentLevel={89}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Be a Playground Hero!</h2>
            <p className="text-white/80 mb-6">
              Tap “Help” whenever you see someone being insulted or treated badly.
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🏃‍♀️
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              <div className="text-white text-lg font-semibold mb-6 text-center">
                {currentData.situation}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice("Help")}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">Help 🤝</div>
                </button>
                <button
                  onClick={() => handleChoice("Ignore")}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">Ignore 🚫</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Playground Hero Badge!" : "💪 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You helped in {score} out of {scenarios.length} situations ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always support others and stand up for kindness on the playground!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned +3 Coins and the Hero Badge! 🏅" : "Get 70% or higher to win the badge!"}
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PlaygroundReflex;
