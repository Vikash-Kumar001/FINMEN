import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AddictionReflex = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const prompts = [
    {
      id: 1,
      text: "Autoplay starts another cartoon episode!",
      emoji: "📺",
      shouldStop: true,
    },
    {
      id: 2,
      text: "You get a notification from your favorite game!",
      emoji: "🎮",
      shouldStop: true,
    },
    {
      id: 3,
      text: "Your friend calls you outside to play football!",
      emoji: "⚽",
      shouldStop: false,
    },
    {
      id: 4,
      text: "Next video countdown begins in 5 seconds...",
      emoji: "⏱️",
      shouldStop: true,
    },
    {
      id: 5,
      text: "Homework time reminder pops up!",
      emoji: "📚",
      shouldStop: false,
    },
  ];

  useEffect(() => {
    if (gameStarted && !showResult && !autoAdvance) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setAutoAdvance(true);
        setTimeout(() => {
          if (currentPrompt < prompts.length - 1) {
            setCurrentPrompt((prev) => prev + 1);
            setTimeLeft(3);
            setAutoAdvance(false);
          } else {
            const accuracy = (score / prompts.length) * 100;
            if (accuracy >= 70) {
              setCoins(5);
            }
            setShowResult(true);
          }
        }, 400);
      }
    }
  }, [timeLeft, gameStarted, showResult, currentPrompt, autoAdvance]);

  const currentPromptData = prompts[currentPrompt];

  const handleChoice = (stopped) => {
    const isCorrect = currentPromptData.shouldStop === stopped;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    setAutoAdvance(true);
    setTimeout(() => {
      if (currentPrompt < prompts.length - 1) {
        setCurrentPrompt((prev) => prev + 1);
        setTimeLeft(3);
        setAutoAdvance(false);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        const accuracy = (finalScore / prompts.length) * 100;
        if (accuracy >= 70) {
          setCoins(5);
        }
        setScore(finalScore);
        setShowResult(true);
      }
    }, 300);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setGameStarted(false);
    setCurrentPrompt(0);
    setScore(0);
    setCoins(0);
    setTimeLeft(3);
    setAutoAdvance(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/journal-my-balance");
  };

  const accuracy = Math.round((score / prompts.length) * 100);

  return (
    <GameShell
      title="Addiction Reflex"
      subtitle={gameStarted ? `Scenario ${currentPrompt + 1} of ${prompts.length}` : "Reflex Challenge"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="dcos-kids-28"
      gameType="educational"
      totalLevels={100}
      currentLevel={28}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">🎯 Stop the Screen Trap!</h2>
            <p className="text-white/80 mb-6">
              Tap <span className="text-red-400 font-semibold">“Stop”</span> when autoplay or screen addiction appears.
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-red-500 to-yellow-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚦
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">
                  Scenario {currentPrompt + 1}/{prompts.length}
                </span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              <div className="bg-purple-500/20 rounded-lg p-3 mb-6 text-center">
                <div className="text-white text-lg font-bold">Time: {timeLeft}s</div>
              </div>

              <div className="text-8xl mb-4 text-center animate-pulse">{currentPromptData.emoji}</div>
              <h2 className="text-white text-3xl font-bold text-center mb-8">
                {currentPromptData.text}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  disabled={autoAdvance}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Stop 🖐️</div>
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  disabled={autoAdvance}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Continue ▶️</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🏆 Self-Control Kid!" : "🧘 Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You stopped at the right time {score} out of {prompts.length} times ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Sometimes the best choice is to pause. Taking breaks builds real-world happiness and focus!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned the Badge 🥇 Self-Control Kid!" : "Get 70% or higher to earn the badge!"}
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

export default AddictionReflex;
