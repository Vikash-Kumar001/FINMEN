import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexStoryLearner = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const learningItems = [
    { id: 1, emoji: "📚", action: "Learn From Failures", correct: true },
    { id: 2, emoji: "📚", action: "Quit Quickly", correct: false },
    { id: 3, emoji: "🔄", action: "Try New Approaches", correct: true },
    { id: 4, emoji: "🔄", action: "Repeat Mistakes", correct: false },
    { id: 5, emoji: "💡", action: "Ask Questions", correct: true },
    { id: 6, emoji: "💡", action: "Avoid Challenges", correct: false },
    { id: 7, emoji: "👥", action: "Seek Mentorship", correct: true },
    { id: 8, emoji: "👥", action: "Work Alone Always", correct: false },
    { id: 9, emoji: "📈", action: "Track Progress", correct: true },
    { id: 10, emoji: "📈", action: "Ignore Results", correct: false }
  ];

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      setGameFinished(true);
    }
  }, [timeLeft, gameActive]);

  const startGame = () => {
    setGameActive(true);
    setTimeLeft(30);
    setScore(0);
    setCoins(0);
    setItems([...learningItems].sort(() => Math.random() - 0.5));
    setCurrentItem(learningItems[0]);
  };

  const handleChoice = (isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Move to next item
    const currentIndex = items.findIndex(item => item.id === currentItem.id);
    if (currentIndex < items.length - 1) {
      setCurrentItem(items[currentIndex + 1]);
    } else {
      // If we've gone through all items, reshuffle and continue
      const shuffled = [...learningItems].sort(() => Math.random() - 0.5);
      setItems(shuffled);
      setCurrentItem(shuffled[0]);
    }
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  return (
    <GameShell
      title="Reflex Story Learner"
      subtitle={gameActive ? `Time: ${timeLeft}s | Score: ${score}` : "Quick learning concepts!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-49"
      gameType="ehe"
      totalLevels={10}
      currentLevel={49}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          {!gameActive && !gameFinished && (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white mb-4">
                Quick learning concepts! Tap 📚 for good actions, ❌ for bad ones.
              </h2>
              <p className="text-white/80 mb-6">
                You have 30 seconds to get as many correct answers as possible!
              </p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg hover:opacity-90 transition-all"
              >
                Start Game
              </button>
            </div>
          )}

          {gameActive && currentItem && (
            <div className="text-center">
              <div className="flex justify-between items-center mb-6">
                <div className="text-white/80">Time: {timeLeft}s</div>
                <div className="text-yellow-400 font-bold">Score: {score}</div>
              </div>
              
              <div className="mb-8">
                <span className="text-6xl block mb-4">{currentItem.emoji}</span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentItem.action}
                </h3>
                <p className="text-white/80">Is this good learning behavior?</p>
              </div>
              
              <div className="flex justify-center gap-8">
                <button
                  onClick={() => handleChoice(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white w-20 h-20 rounded-full text-4xl font-bold shadow-lg transition-all transform hover:scale-105"
                >
                  ✅
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white w-20 h-20 rounded-full text-4xl font-bold shadow-lg transition-all transform hover:scale-105"
                >
                  ❌
                </button>
              </div>
            </div>
          )}

          {gameFinished && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Game Over!</h2>
              <p className="text-xl text-white/80 mb-2">Your final score: <span className="text-yellow-400 font-bold">{score}</span></p>
              <p className="text-white/80 mb-6">You earned {coins} coins!</p>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">How did you do?</h3>
                <p className="text-white/80">
                  {score >= 8 ? "Excellent! You understand learning concepts well!" : 
                   score >= 5 ? "Good job! Keep learning about effective learning!" : 
                   "Keep exploring learning concepts to improve!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexStoryLearner;