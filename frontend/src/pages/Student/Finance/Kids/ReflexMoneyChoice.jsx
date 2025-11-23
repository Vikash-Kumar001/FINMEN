import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexMoneyChoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentWord, setCurrentWord] = useState("");
  const timerRef = useRef(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const words = [
    { word: "DEPOSIT", isCorrect: true, emoji: "📥" },
    { word: "THROW AWAY", isCorrect: false, emoji: "🗑️" },
    { word: "SAVE", isCorrect: true, emoji: "💰" },
    { word: "WASTE", isCorrect: false, emoji: "❌" },
    { word: "BANK", isCorrect: true, emoji: "🏦" },
    { word: "SPEND", isCorrect: false, emoji: "💸" },
    { word: "INVEST", isCorrect: true, emoji: "📈" },
    { word: "LOSE", isCorrect: false, emoji: "📉" }
  ];

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState("finished");
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(30);
    setScore(0);
    showNextWord();
  };

  const showNextWord = () => {
    if (gameState !== "playing") return;
    
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
  };

  const handleTap = (isSave) => {
    if (gameState !== "playing") return;
    
    if (isSave === currentWord.isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Show next word after a short delay
    setTimeout(showNextWord, 300);
  };

  const handleNext = () => {
    navigate("/student/finance/kids/badge-saver-kid");
  };

  return (
    <GameShell
      title="Reflex Money Choice"
      subtitle="Quickly tap the right action for each word!"
      coins={coins}
      currentLevel={9}
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={Math.min(score, 3)}
      gameId="finance-kids-9"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={10} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Tap "DEPOSIT" when you see words related to saving money.<br />
              Tap "THROW AWAY" when you see words related to wasting money.
            </p>
            <p className="text-white/80 mb-6">
              You have 30 seconds to get as many correct as possible!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 text-center">
              <div className="text-6xl mb-4">{currentWord.emoji}</div>
              <div className="text-5xl font-bold text-white mb-8">
                {currentWord.word}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleTap(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">📥</div>
                  <h3 className="font-bold text-xl mb-2">DEPOSIT</h3>
                </button>
                
                <button
                  onClick={() => handleTap(false)}
                  className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">🗑️</div>
                  <h3 className="font-bold text-xl mb-2">THROW AWAY</h3>
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-4">Game Over!</h3>
            <p className="text-white/90 text-lg mb-2">
              You got {score} correct answers!
            </p>
            <p className="text-white/80 mb-6">
              Great job testing your money knowledge!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              <span>+{Math.min(score, 3)} Coins</span>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexMoneyChoice;