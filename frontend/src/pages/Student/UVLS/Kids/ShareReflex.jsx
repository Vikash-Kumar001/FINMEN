import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShareReflex = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [roundTime, setRoundTime] = useState(0);
  const [speed, setSpeed] = useState(2000); // Starting speed
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const actions = [
    { id: 1, emoji: "🍪", text: "Share snack", shouldShare: true },
    { id: 2, emoji: "🎮", text: "Hog the game", shouldShare: false },
    { id: 3, emoji: "✏️", text: "Lend pencil", shouldShare: true },
    { id: 4, emoji: "🏀", text: "Take ball away", shouldShare: false },
    { id: 5, emoji: "📚", text: "Share books", shouldShare: true },
    { id: 6, emoji: "🧸", text: "Keep all toys", shouldShare: false },
    { id: 7, emoji: "🖍️", text: "Share crayons", shouldShare: true },
    { id: 8, emoji: "🎨", text: "Refuse to share", shouldShare: false },
    { id: 9, emoji: "⚽", text: "Invite to play", shouldShare: true },
    { id: 10, emoji: "🚫", text: "Exclude others", shouldShare: false },
    { id: 11, emoji: "🍎", text: "Share lunch", shouldShare: true },
    { id: 12, emoji: "👎", text: "Ignore friend", shouldShare: false },
    { id: 13, emoji: "🎁", text: "Give gift", shouldShare: true },
    { id: 14, emoji: "😠", text: "Be selfish", shouldShare: false },
    { id: 15, emoji: "🤝", text: "Take turns", shouldShare: true },
    { id: 16, emoji: "🙅", text: "Say no always", shouldShare: false },
    { id: 17, emoji: "💝", text: "Be generous", shouldShare: true },
    { id: 18, emoji: "🤐", text: "Hide things", shouldShare: false },
    { id: 19, emoji: "🎈", text: "Share joy", shouldShare: true },
    { id: 20, emoji: "😤", text: "Be mean", shouldShare: false }
  ];

  const currentAction = actions[currentRound];

  useEffect(() => {
    if (gameStarted && !showResult && roundTime > 0) {
      const timer = setTimeout(() => setRoundTime(prev => prev + 100), 100);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, showResult, roundTime]);

  const handleChoice = (shouldShare) => {
    const responseTime = roundTime;
    const isCorrect = currentAction.shouldShare === shouldShare;
    const isFast = responseTime < speed;
    
    if (isCorrect) {
      const points = isFast ? 2 : 1; // Bonus for speed
      setScore(prev => prev + points);
      showCorrectAnswerFeedback(points, false);
    }
    
    if (currentRound < actions.length - 1) {
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
        setRoundTime(0);
        // Increase speed every 5 rounds
        if ((currentRound + 1) % 5 === 0) {
          setSpeed(prev => Math.max(1000, prev - 200));
        }
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / actions.length) * 100;
      if (accuracy >= 70) {
        setCoins(3); // +3 Coins for accuracy (minimum for progress)
      }
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setGameStarted(false);
    setCurrentRound(0);
    setScore(0);
    setCoins(0);
    setRoundTime(0);
    setSpeed(2000);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const accuracy = Math.round((score / actions.length) * 100);

  return (
    <GameShell
      title="Share Reflex"
      subtitle={gameStarted ? `Round ${currentRound + 1} of ${actions.length}` : "Fast Tapping Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="uvls-kids-9"
      gameType="uvls"
      totalLevels={10}
      currentLevel={9}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Share Reflex Challenge!</h2>
            <p className="text-white/80 mb-4">Tap 'Share' or 'Keep' as FAST as you can!</p>
            <p className="text-white/70 text-sm mb-6">Speed increases as you progress! ⚡</p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Challenge! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Round {currentRound + 1}/{actions.length}</span>
                <div className="flex gap-4">
                  <span className="text-yellow-400 font-bold">Score: {score}</span>
                  <span className="text-blue-400 font-bold">Time: {(roundTime / 1000).toFixed(1)}s</span>
                </div>
              </div>
              
              <div className="text-9xl mb-6 text-center animate-bounce">{currentAction.emoji}</div>
              
              <p className="text-white text-2xl font-bold mb-8 text-center">
                {currentAction.text}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 transition-all transform hover:scale-105 active:scale-95"
                >
                  <div className="text-4xl mb-2">✓</div>
                  <div className="text-white font-bold text-xl">Share</div>
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 transition-all transform hover:scale-105 active:scale-95"
                >
                  <div className="text-4xl mb-2">✗</div>
                  <div className="text-white font-bold text-xl">Keep</div>
                </button>
              </div>

              <div className="mt-4 bg-white/10 rounded-lg p-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (roundTime / speed) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "⚡ Lightning Fast!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {score} out of {actions.length} correct!
            </p>
            <p className="text-white/80 text-lg mb-4">
              Accuracy: {accuracy}%
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned 3 Coins! 🪙" : "Get 70% or higher to earn coins!"}
            </p>
            <p className="text-white/70 text-sm mb-4">
              Teacher Tip: Reward the fastest correct player to motivate others!
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default ShareReflex;

