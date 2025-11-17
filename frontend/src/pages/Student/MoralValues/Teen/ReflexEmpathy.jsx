import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexEmpathy = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    { id: 1, text: "Your classmate drops their books. What do you do?", emoji: "📚", isEmpathetic: true },
    { id: 2, text: "A new student sits alone. What do you do?", emoji: "😔", isEmpathetic: true },
    { id: 3, text: "Someone is upset after losing a game. You...", emoji: "😢", isEmpathetic: true },
    { id: 4, text: "A friend shares their problem, and you laugh.", emoji: "😂", isEmpathetic: false },
    { id: 5, text: "Your teammate makes a mistake. You shout at them.", emoji: "😡", isEmpathetic: false },
  ];

  useEffect(() => {
    if (gameStarted && !showResult && !autoAdvance) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setAutoAdvance(true);
        setTimeout(() => {
          if (currentScenario < scenarios.length - 1) {
            setCurrentScenario(prev => prev + 1);
            setTimeLeft(2);
            setAutoAdvance(false);
          } else {
            const accuracy = (score / scenarios.length) * 100;
            if (accuracy >= 70) {
              setCoins(3);
            }
            setShowResult(true);
          }
        }, 500);
      }
    }
  }, [timeLeft, gameStarted, showResult, currentScenario, autoAdvance, score, scenarios.length]);

  const currentScenarioData = scenarios[currentScenario];

  const handleChoice = (isEmpathetic) => {
    const isCorrect = currentScenarioData.isEmpathetic === isEmpathetic;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setAutoAdvance(true);
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
        setTimeLeft(2);
        setAutoAdvance(false);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        const accuracy = (finalScore / scenarios.length) * 100;
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
    setCurrentScenario(0);
    setScore(0);
    setCoins(0);
    setTimeLeft(2);
    setAutoAdvance(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/feelings-puzzle");
  };

  const accuracy = Math.round((score / scenarios.length) * 100);

  return (
    <GameShell
      title="Reflex: Empathy"
      subtitle={gameStarted ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Quick Empathy Reflex Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="moral-teen-23"
      gameType="moral"
      totalLevels={100}
      currentLevel={23}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Tap Understand or Ignore!</h2>
            <p className="text-white/80 mb-6">
              Respond fast — show empathy reflexes 🧠💖
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
                  Scenario {currentScenario + 1}/{scenarios.length}
                </span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              <div className="bg-purple-500/20 rounded-lg p-3 mb-6 text-center">
                <div className="text-white text-lg font-bold">Time: {timeLeft}s</div>
              </div>
              
              <div className="text-8xl mb-4 text-center animate-pulse">
                {currentScenarioData.emoji}
              </div>
              <h2 className="text-white text-2xl font-bold text-center mb-8">
                {currentScenarioData.text}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  disabled={autoAdvance}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Understand 💞</div>
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  disabled={autoAdvance}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Ignore 🚫</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "💖 Empathy Hero!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You understood {score} out of {scenarios.length} correctly ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Empathy means understanding others’ feelings — offering help, kindness, or comfort when they need it most.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned 3 Coins! 🪙" : "Get 70% or higher to earn coins!"}
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

export default ReflexEmpathy;
