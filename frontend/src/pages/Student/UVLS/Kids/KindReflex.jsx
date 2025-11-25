import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from '../../../../utils/getGameData';

const KindReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-3";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 5;
  const totalCoins = gameData?.coins || 5;
  const totalXp = gameData?.xp || 10;
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(3);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const actions = [
    { id: 1, text: "Helping friend", emoji: "🤝", isKind: true },
    { id: 2, text: "Pushing others", emoji: "👊", isKind: false },
    { id: 3, text: "Sharing snacks", emoji: "🍪", isKind: true },
    { id: 4, text: "Name calling", emoji: "😡", isKind: false },
    { id: 5, text: "Saying thank you", emoji: "🙏", isKind: true },
    { id: 6, text: "Taking toys", emoji: "🎮", isKind: false },
    { id: 7, text: "Giving compliments", emoji: "💝", isKind: true },
    { id: 8, text: "Ignoring others", emoji: "🙈", isKind: false },
    { id: 9, text: "Holding door", emoji: "🚪", isKind: true },
    { id: 10, text: "Laughing at mistakes", emoji: "😂", isKind: false },
    { id: 11, text: "Listening to friend", emoji: "👂", isKind: true },
    { id: 12, text: "Interrupting others", emoji: "🗣️", isKind: false },
    { id: 13, text: "Inviting to play", emoji: "⚽", isKind: true },
    { id: 14, text: "Excluding someone", emoji: "🚫", isKind: false },
    { id: 15, text: "Saying please", emoji: "😊", isKind: true },
    { id: 16, text: "Yelling at people", emoji: "📢", isKind: false },
    { id: 17, text: "Helping clean up", emoji: "🧹", isKind: true },
    { id: 18, text: "Making mess", emoji: "🗑️", isKind: false },
    { id: 19, text: "Cheering others", emoji: "📣", isKind: true },
    { id: 20, text: "Being rude", emoji: "😤", isKind: false }
  ];

  const currentAction = actions[currentRound];

  const handleChoice = (isKind) => {
    const isCorrect = currentAction.isKind === isKind;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1); // 1 coin for correct answer
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentRound < actions.length - 1) {
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
        setTimer(3);
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
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
    setTimer(3);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const accuracy = Math.round((score / actions.length) * 100);

  useEffect(() => {
    if (gameStarted && !showResult && timer > 0) {
      const countdown = setTimeout(() => setTimer(prev => prev - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [gameStarted, showResult, timer]);

  return (
    <GameShell
      title="Kind Reflex"
      score={coins}
      subtitle={gameStarted ? `Action ${currentRound + 1} of ${actions.length}` : "Quick Tap Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="uvls-kids-3"
      gameType="uvls"
      totalLevels={10}
      currentLevel={3}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Test Your Reflexes?</h2>
            <p className="text-white/80 mb-6">Tap 'Kind' or 'Mean' as fast as you can!</p>
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
                  <div className="text-white font-bold text-xl">Kind 😊</div>
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">Mean 😞</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Amazing Reflexes!" : "💪 Keep Practicing!"}
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

export default KindReflex;

