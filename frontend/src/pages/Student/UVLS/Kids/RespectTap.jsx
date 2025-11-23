import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RespectTap = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const actions = [
    { id: 1, emoji: "🙏", text: "Saying please", isRespectful: true },
    { id: 2, emoji: "🫱", text: "Pushing others", isRespectful: false },
    { id: 3, emoji: "👂", text: "Listening carefully", isRespectful: true },
    { id: 4, emoji: "😤", text: "Yelling at people", isRespectful: false },
    { id: 5, emoji: "🤝", text: "Handshake greeting", isRespectful: true },
    { id: 6, emoji: "👅", text: "Sticking tongue out", isRespectful: false },
    { id: 7, emoji: "🙇", text: "Bowing politely", isRespectful: true },
    { id: 8, emoji: "🙄", text: "Rolling eyes", isRespectful: false },
    { id: 9, emoji: "👋", text: "Waving hello", isRespectful: true },
    { id: 10, emoji: "😠", text: "Making angry faces", isRespectful: false },
    { id: 11, emoji: "🤲", text: "Offering help", isRespectful: true },
    { id: 12, emoji: "🚫", text: "Refusing rudely", isRespectful: false },
    { id: 13, emoji: "😊", text: "Smiling kindly", isRespectful: true },
    { id: 14, emoji: "😏", text: "Mocking others", isRespectful: false },
    { id: 15, emoji: "👍", text: "Encouraging others", isRespectful: true },
    { id: 16, emoji: "👎", text: "Putting others down", isRespectful: false },
    { id: 17, emoji: "🙌", text: "Celebrating together", isRespectful: true },
    { id: 18, emoji: "😈", text: "Being mean", isRespectful: false },
    { id: 19, emoji: "🤗", text: "Friendly hug", isRespectful: true },
    { id: 20, emoji: "🤬", text: "Using bad words", isRespectful: false }
  ];

  const currentAction = actions[currentRound];

  const handleChoice = (isRespectful) => {
    const isCorrect = currentAction.isRespectful === isRespectful;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentRound < actions.length - 1) {
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / actions.length) * 100;
      if (accuracy >= 70) {
        setCoins(3); // +3 Coins for ≥70% (minimum for progress)
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
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const accuracy = Math.round((score / actions.length) * 100);

  return (
    <GameShell
      title="Respect Tap"
      score={coins}
      subtitle={gameStarted ? `Action ${currentRound + 1} of ${actions.length}` : "Tap Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="uvls-kids-13"
      gameType="uvls"
      totalLevels={20}
      currentLevel={13}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Respect Tap Game!</h2>
            <p className="text-white/80 mb-6">Tap 'Respectful' or 'Not Respectful' quickly!</p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Round {currentRound + 1}/{actions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              <div className="text-8xl mb-6 text-center animate-bounce">{currentAction.emoji}</div>
              
              <p className="text-white text-2xl font-bold mb-8 text-center">
                {currentAction.text}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">Respectful ✓</div>
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">Not Respectful ✗</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Great Respect!" : "💪 Keep Learning!"}
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
            <p className="text-white/70 text-sm">
              Teacher Tip: Include cultural gestures (handshake/bow) where appropriate!
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

export default RespectTap;

