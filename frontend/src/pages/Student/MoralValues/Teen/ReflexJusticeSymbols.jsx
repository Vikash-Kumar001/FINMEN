import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexJusticeSymbols = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 🏛️ Justice-related and unrelated symbols
  const symbols = [
    { id: 1, emoji: "⚖️", text: "Scales of Justice", isJustice: true },
    { id: 2, emoji: "💣", text: "Bomb", isJustice: false },
    { id: 3, emoji: "🔨", text: "Judge’s Gavel", isJustice: true },
    { id: 4, emoji: "🎯", text: "Target", isJustice: false },
    { id: 5, emoji: "👩‍⚖️", text: "Judge", isJustice: true },
    { id: 6, emoji: "🚔", text: "Police Car", isJustice: true },
    { id: 7, emoji: "🕊️", text: "Peace Dove", isJustice: true },
    { id: 8, emoji: "💰", text: "Money Bag", isJustice: false },
    { id: 9, emoji: "🔥", text: "Fire", isJustice: false },
    { id: 10, emoji: "📜", text: "Law Document", isJustice: true },
  ];

  useEffect(() => {
    if (gameStarted && !showResult && !autoAdvance) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setAutoAdvance(true);
        setTimeout(() => {
          if (currentSymbol < symbols.length - 1) {
            setCurrentSymbol((prev) => prev + 1);
            setTimeLeft(2);
            setAutoAdvance(false);
          } else {
            const accuracy = (score / symbols.length) * 100;
            if (accuracy >= 70) {
              setCoins(3);
            }
            setShowResult(true);
          }
        }, 500);
      }
    }
  }, [timeLeft, gameStarted, showResult, currentSymbol, autoAdvance, score, symbols.length]);

  const currentSymbolData = symbols[currentSymbol];

  const handleChoice = (isJustice) => {
    const isCorrect = currentSymbolData.isJustice === isJustice;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    setAutoAdvance(true);
    setTimeout(() => {
      if (currentSymbol < symbols.length - 1) {
        setCurrentSymbol((prev) => prev + 1);
        setTimeLeft(2);
        setAutoAdvance(false);
      } else {
        const finalScore = score + (isCorrect ? 1 : 0);
        const accuracy = (finalScore / symbols.length) * 100;
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
    setCurrentSymbol(0);
    setScore(0);
    setCoins(0);
    setTimeLeft(2);
    setAutoAdvance(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/puzzle-fairness1");
  };

  const accuracy = Math.round((score / symbols.length) * 100);

  return (
    <GameShell
      title="Reflex: Justice Symbols"
      subtitle={gameStarted ? `Symbol ${currentSymbol + 1} of ${symbols.length}` : "Quick Justice Reflex Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="moral-teen-43"
      gameType="moral"
      totalLevels={100}
      currentLevel={43}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Tap if it's a Justice Symbol!</h2>
            <p className="text-white/80 mb-6">Recognize fairness, peace, and justice icons fast ⚖️</p>
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
                <span className="text-white/80">Symbol {currentSymbol + 1}/{symbols.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>

              <div className="bg-purple-500/20 rounded-lg p-3 mb-6 text-center">
                <div className="text-white text-lg font-bold">Time: {timeLeft}s</div>
              </div>

              <div className="text-8xl mb-4 text-center animate-pulse">{currentSymbolData.emoji}</div>
              <h2 className="text-white text-3xl font-bold text-center mb-8">"{currentSymbolData.text}"</h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  disabled={autoAdvance}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Justice ✓</div>
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  disabled={autoAdvance}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  <div className="text-white font-bold text-2xl">Not Justice ✗</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "⚖️ Justice Defender!" : "💪 Try Again for Fairness!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You identified {score} out of {symbols.length} symbols correctly ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Justice means fairness and peace — symbols like ⚖️, 👩‍⚖️, and 🕊️ represent honesty and equality.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned 3 Coins! 🪙" : "Score 70%+ to earn coins!"}
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

export default ReflexJusticeSymbols;
