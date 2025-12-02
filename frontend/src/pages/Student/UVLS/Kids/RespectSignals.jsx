import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RespectSignals = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-19";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSignal, setCurrentSignal] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const signals = [
    { id: 1, emoji: "👁️", text: "Eye contact when listening", isRespect: true },
    { id: 2, emoji: "📱", text: "Looking at phone while someone talks", isRespect: false },
    { id: 3, emoji: "👂", text: "Turning to face the speaker", isRespect: true },
    { id: 4, emoji: "🙄", text: "Rolling eyes during conversation", isRespect: false },
    { id: 5, emoji: "🙌", text: "Nodding to show understanding", isRespect: true },
    { id: 6, emoji: "😴", text: "Yawning without covering mouth", isRespect: false },
    { id: 7, emoji: "🤝", text: "Proper handshake greeting", isRespect: true },
    { id: 8, emoji: "🚶", text: "Walking away mid-conversation", isRespect: false },
    { id: 9, emoji: "😊", text: "Smiling when someone talks", isRespect: true },
    { id: 10, emoji: "😒", text: "Frowning and looking bored", isRespect: false },
    { id: 11, emoji: "🙇", text: "Bowing as greeting", isRespect: true },
    { id: 12, emoji: "🗣️", text: "Interrupting constantly", isRespect: false },
    { id: 13, emoji: "🤲", text: "Open body language", isRespect: true },
    { id: 14, emoji: "🙅", text: "Arms crossed defensively", isRespect: false },
    { id: 15, emoji: "👍", text: "Giving positive feedback", isRespect: true }
  ];

  const currentSignalData = signals[currentSignal];

  const handleAnswer = (isRespect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = currentSignalData.isRespect === isRespect;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    if (currentSignal < signals.length - 1) {
      setTimeout(() => {
        setCurrentSignal(prev => prev + 1);
        setAnswered(false);
      }, 500);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setGameStarted(false);
    setCurrentSignal(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const accuracy = Math.round((score / signals.length) * 100);

  return (
    <GameShell
      title="Respect Signals"
      subtitle={gameStarted && !showResult ? `Signal ${currentSignal + 1} of ${signals.length}` : showResult ? "Game Complete!" : "Recognition Game"}
      score={score}
      currentLevel={currentSignal + 1}
      totalLevels={signals.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={signals.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="uvls"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Respect Signals!</h2>
            <p className="text-white/80 mb-6">Recognize respectful body language and actions!</p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Signal {currentSignal + 1}/{signals.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{signals.length}</span>
              </div>
              
              <div className="text-8xl mb-6 text-center animate-pulse">{currentSignalData.emoji}</div>
              
              <p className="text-white text-xl font-bold mb-8 text-center">
                {currentSignalData.text}
              </p>
              
              <p className="text-white/80 mb-6 text-center text-lg">Is this a respect signal?</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer(true)}
                  disabled={answered}
                  className={`p-6 rounded-xl transition-all transform ${
                    answered
                      ? currentSignalData.isRespect
                        ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                        : "bg-red-500/20 border-2 border-red-400 opacity-75"
                      : "bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 hover:scale-105"
                  } ${answered ? "cursor-not-allowed" : ""}`}
                >
                  <div className="text-white font-bold text-xl">Yes ✓</div>
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  disabled={answered}
                  className={`p-6 rounded-xl transition-all transform ${
                    answered
                      ? !currentSignalData.isRespect
                        ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                        : "bg-red-500/20 border-2 border-red-400 opacity-75"
                      : "bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 hover:scale-105"
                  } ${answered ? "cursor-not-allowed" : ""}`}
                >
                  <div className="text-white font-bold text-xl">No ✗</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {accuracy >= 70 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Signal Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {signals.length} correct!
                  You can recognize respect signals!
                </p>
                <p className="text-white/80 text-lg mb-4">
                  Accuracy: {accuracy}%
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Respectful body language includes eye contact, facing the speaker, nodding, smiling, and open body language. Disrespectful signals include looking at phones, rolling eyes, interrupting, and closed body language. Paying attention to these signals helps you show respect to others!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {signals.length} correct.
                  Accuracy: {accuracy}%
                </p>
                <p className="text-white/80 mb-4">
                  Get 70% or higher to earn coins!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Respectful signals show you're paying attention - like eye contact, facing the speaker, and nodding. Disrespectful signals show you're not interested - like looking at your phone or rolling your eyes!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RespectSignals;
