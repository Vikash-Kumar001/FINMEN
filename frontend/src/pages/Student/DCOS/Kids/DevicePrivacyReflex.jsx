import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DevicePrivacyReflex = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const prompts = [
    { id: 1, text: "This app asks: Allow camera access?", emoji: "📷", allow: false },
    { id: 2, text: "This app asks: Allow microphone access?", emoji: "🎤", allow: false },
    { id: 3, text: "Game asks: Allow internet connection?", emoji: "🌐", allow: true },
    { id: 4, text: "Photo editor asks: Allow photo gallery access?", emoji: "🖼️", allow: true },
    { id: 5, text: "Unknown app asks: Allow location access?", emoji: "📍", allow: false },
  ];

  useEffect(() => {
    if (gameStarted && !showResult && !autoAdvance) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Auto advance when time is up
        setAutoAdvance(true);
        setTimeout(() => {
          if (currentPrompt < prompts.length - 1) {
            setCurrentPrompt((prev) => prev + 1);
            setTimeLeft(2);
            setAutoAdvance(false);
          } else {
            const accuracy = (score / prompts.length) * 100;
            if (accuracy >= 70) {
              setCoins(3);
            }
            setShowResult(true);
          }
        }, 500);
      }
    }
  }, [timeLeft, gameStarted, showResult, currentPrompt, autoAdvance]);

  const currentPromptData = prompts[currentPrompt];

  const handleChoice = (isAllow) => {
    const isCorrect = currentPromptData.allow === isAllow;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    setAutoAdvance(true);
    setTimeout(() => {
      if (currentPrompt < prompts.length - 1) {
        setCurrentPrompt((prev) => prev + 1);
        setTimeLeft(2);
        setAutoAdvance(false);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        const accuracy = (finalScore / prompts.length) * 100;
        if (accuracy >= 70) {
          setCoins(3);
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
    setTimeLeft(2);
    setAutoAdvance(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/rights-poster-task");
  };

  const accuracy = Math.round((score / prompts.length) * 100);

  return (
    <GameShell
      title="Device Privacy Reflex"
      subtitle={gameStarted ? `Prompt ${currentPrompt + 1} of ${prompts.length}` : "Quick Reflex Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="dcos-kids-56"
      gameType="educational"
      totalLevels={100}
      currentLevel={56}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Be Smart! Protect Your Device 🔒</h2>
            <p className="text-white/80 mb-6">
              Tap <span className="font-bold text-green-400">“Allow”</span> only when the app really needs it. 
              Tap <span className="font-bold text-red-400">“Deny”</span> to protect your privacy!
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">
                  Prompt {currentPrompt + 1}/{prompts.length}
                </span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              <div className="bg-blue-500/20 rounded-lg p-3 mb-6 text-center">
                <div className="text-white text-lg font-bold">Time: {timeLeft}s</div>
              </div>

              <div className="text-8xl mb-4 text-center animate-pulse">
                {currentPromptData.emoji}
              </div>
              <h2 className="text-white text-3xl font-bold text-center mb-8">
                {currentPromptData.text}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  disabled={autoAdvance}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Allow ✅</div>
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  disabled={autoAdvance}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Deny 🚫</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🛡️ Privacy Protector!" : "⚠️ Try Again!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {score} out of {prompts.length} correct ({accuracy}%)
            </p>
            <div className="bg-purple-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Great job! Always think before you tap “Allow.” Only give permissions when it’s safe and necessary.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned 3 Coins! 🪙" : "Score 70% or higher to earn coins!"}
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

export default DevicePrivacyReflex;
