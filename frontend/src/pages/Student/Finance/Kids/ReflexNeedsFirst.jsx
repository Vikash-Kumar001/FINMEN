import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexNeedsFirst = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("waiting"); // waiting, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentItem, setCurrentItem] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    { text: "Books", type: "correct", emoji: "📚", description: "Need for education" },
    { text: "Unneeded Toys", type: "wrong", emoji: "🧸", description: "Wants, not needs" },
    { text: "School Supplies", type: "correct", emoji: "✏️", description: "Need for learning" },
    { text: "Expensive Gadgets", type: "wrong", emoji: "📱", description: "Want, not essential" },
    { text: "Healthy Food", type: "correct", emoji: "🍎", description: "Need for health" },
    { text: "Candy", type: "wrong", emoji: "🍬", description: "Want, not necessary" },
    { text: "Medicine", type: "correct", emoji: "💊", description: "Need for health" },
    { text: "Designer Clothes", type: "wrong", emoji: "👗", description: "Want, not essential" },
    { text: "Toothbrush", type: "correct", emoji: "🪥", description: "Need for hygiene" },
    { text: "Video Games", type: "wrong", emoji: "🎮", description: "Want, not necessary" }
  ];

  // Generate a random item
  const generateItem = useCallback(() => {
    const randomItem = items[Math.floor(Math.random() * items.length)];
    setCurrentItem(randomItem);
  }, []);

  // Handle item tap
  const handleItemTap = (itemType) => {
    if (gameState !== "playing") return;

    if (itemType === "correct") {
      const newScore = score + 1;
      setScore(newScore);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      showCorrectAnswerFeedback(1, true);
    } else {
      // Reset streak on wrong answer
      setStreak(0);
    }

    // Generate next item
    generateItem();
  };

  // Start the game
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(30);
    setStreak(0);
    setBestStreak(0);
    resetFeedback();
    generateItem();
  };

  // Game timer
  useEffect(() => {
    let timer;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      setGameState("finished");
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const handleNext = () => {
    navigate("/student/finance/kids/badge-smart-spender-kid");
  };

  return (
    <GameShell
      title="Reflex Needs First"
      subtitle={gameState === "playing" ? `Time: ${timeLeft}s | Score: ${score}` : "Identify needs vs wants!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={score}
      gameId="finance-kids-reflex-needs-first"
      gameType="finance"
      totalLevels={10}
      currentLevel={9}
      showConfetti={gameState === "finished" && score >= 15}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8 max-w-2xl mx-auto">
        {gameState === "waiting" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Needs vs Wants Reflex Challenge</h2>
            <p className="text-white/90 mb-6">
              Tap the items that represent NEEDS as fast as you can! Avoid the WANTS.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-500/20 p-4 rounded-xl">
                <h3 className="font-bold text-green-300 mb-2">Needs (Tap These!)</h3>
                <p className="text-white/80 text-sm">Books, School Supplies, Healthy Food, Medicine, Toothbrush</p>
              </div>
              <div className="bg-red-500/20 p-4 rounded-xl">
                <h3 className="font-bold text-red-300 mb-2">Wants (Avoid These!)</h3>
                <p className="text-white/80 text-sm">Unneeded Toys, Expensive Gadgets, Candy, Designer Clothes, Video Games</p>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <div className="text-white/80">
                  <span className="font-bold">Time:</span> {timeLeft}s
                </div>
                <div className="text-white/80">
                  <span className="font-bold">Score:</span> {score}
                </div>
                <div className="text-white/80">
                  <span className="font-bold">Streak:</span> {streak}
                </div>
              </div>
              
              {currentItem && (
                <div className="flex flex-col items-center">
                  <div className="text-6xl mb-4">{currentItem.emoji}</div>
                  <button
                    onClick={() => handleItemTap(currentItem.type)}
                    className={`py-6 px-12 rounded-2xl font-bold text-2xl shadow-lg transition-all transform hover:scale-105 mb-6 ${
                      currentItem.type === "correct"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    }`}
                  >
                    {currentItem.text}
                  </button>
                  <p className="text-white/80 text-center">
                    {currentItem.description} - Tap {currentItem.type === "correct" ? "✅ Need" : "❌ Want"}
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <h3 className="text-white font-bold mb-2 text-center">Needs (Tap These!)</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {items.filter(w => w.type === "correct").map((item, index) => (
                  <span key={index} className="bg-green-500/30 text-green-200 px-3 py-1 rounded-full text-sm">
                    {item.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500/30 to-indigo-500/30 p-4 rounded-xl">
                <p className="text-3xl font-bold text-white">{score}</p>
                <p className="text-white/80">Final Score</p>
              </div>
              <div className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 p-4 rounded-xl">
                <p className="text-3xl font-bold text-white">{bestStreak}</p>
                <p className="text-white/80">Best Streak</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 p-4 rounded-xl">
                <p className="text-3xl font-bold text-white">{Math.round((score / 30) * 60)}</p>
                <p className="text-white/80">Items/Min</p>
              </div>
            </div>
            
            {score >= 15 ? (
              <div>
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-2">Amazing Reflexes!</h3>
                <p className="text-white/90 mb-4">
                  You scored {score} points! You know your needs from wants well.
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+3 Coins</span>
                </div>
              </div>
            ) : score >= 10 ? (
              <div>
                <div className="text-5xl mb-4">👍</div>
                <h3 className="text-2xl font-bold text-white mb-2">Good Job!</h3>
                <p className="text-white/90 mb-4">
                  You scored {score} points. Keep practicing to improve your reflexes!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-2">Keep Practicing!</h3>
                <p className="text-white/90 mb-4">
                  You scored {score} points. Try again to improve your score!
                </p>
              </div>
            )}
            
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mr-4"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexNeedsFirst;