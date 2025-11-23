import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FriendshipReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSituation, setCurrentSituation] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSituation, setShowSituation] = useState(true);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const situations = [
    { id: 1, text: "A classmate is being teased online", emoji: "😢", action: "stand", correctAction: "stand" },
    { id: 2, text: "Your friend got a new haircut", emoji: "💇", action: "compliment", correctAction: "stand" },
    { id: 3, text: "Someone is spreading rumors", emoji: "🗣️", action: "stop", correctAction: "stand" },
    { id: 4, text: "A friend shares good news", emoji: "🎉", action: "celebrate", correctAction: "celebrate" },
    { id: 5, text: "Someone is left out of a game", emoji: "🎮", action: "include", correctAction: "stand" },
    { id: 6, text: "Friend posts about feeling sad", emoji: "💙", action: "support", correctAction: "stand" },
    { id: 7, text: "Someone shares their art", emoji: "🎨", action: "praise", correctAction: "celebrate" },
    { id: 8, text: "Mean comment on a post", emoji: "😠", action: "defend", correctAction: "stand" },
    { id: 9, text: "Friend achieves something great", emoji: "🏆", action: "cheer", correctAction: "celebrate" },
    { id: 10, text: "Someone is being bullied", emoji: "😰", action: "help", correctAction: "stand" }
  ];

  useEffect(() => {
    if (gameStarted && showSituation && !showResult) {
      const timer = setTimeout(() => {
        setShowSituation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted, showSituation, currentSituation, showResult]);

  const handleAction = (action) => {
    if (showSituation) return;
    
    const situation = situations[currentSituation];
    const isCorrect = situation.action === "stand" || situation.action === "stop" || 
                     situation.action === "defend" || situation.action === "help" || 
                     situation.action === "include" || situation.action === "support";
    
    if (isCorrect && action === "stand") {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentSituation < situations.length - 1) {
      setCurrentSituation(prev => prev + 1);
      setShowSituation(true);
    } else {
      const finalScore = score + (isCorrect && action === "stand" ? 1 : 0);
      const accuracy = (finalScore / situations.length) * 100;
      if (accuracy >= 70) {
        setCoins(3);
      }
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setGameStarted(false);
    setCurrentSituation(0);
    setScore(0);
    setCoins(0);
    setShowSituation(true);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/kind-friend-badge");
  };

  const currentSituationData = situations[currentSituation];
  const accuracy = Math.round((score / situations.length) * 100);

  return (
    <GameShell
      title="Friendship Reflex"
      score={coins}
      subtitle={gameStarted ? `Situation ${currentSituation + 1} of ${situations.length}` : "Quick Response Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="dcos-kids-19"
      gameType="educational"
      totalLevels={20}
      currentLevel={19}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Stand With Your Friend!</h2>
            <p className="text-white/80 mb-6">When you see bullying or someone needing help, tap "Stand with Friend"!</p>
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
                <span className="text-white/80">Situation {currentSituation + 1}/{situations.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              {showSituation ? (
                <div className="text-center py-12">
                  <div className="text-9xl mb-4 animate-bounce">{currentSituationData.emoji}</div>
                  <p className="text-white text-2xl font-bold">{currentSituationData.text}</p>
                </div>
              ) : (
                <>
                  <h3 className="text-white text-xl font-bold mb-6 text-center">Quick! What do you do?</h3>
                  <button
                    onClick={() => handleAction("stand")}
                    className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 border-4 border-white rounded-2xl p-8 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <div className="text-white font-bold text-3xl">Stand with Friend 💪</div>
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 True Friend!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You stood with your friends {score} out of {situations.length} times ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always stand up for your friends when they need help. True friends support each other!
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

export default FriendshipReflex;

