import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RespectSignals = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSignal, setCurrentSignal] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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

  const handleChoice = (isRespect) => {
    const isCorrect = currentSignalData.isRespect === isRespect;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentSignal < signals.length - 1) {
      setTimeout(() => {
        setCurrentSignal(prev => prev + 1);
      }, 400);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const accuracy = (finalScore / signals.length) * 100;
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
    setCurrentSignal(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const accuracy = Math.round((score / signals.length) * 100);

  return (
    <GameShell
      title="Respect Signals"
      subtitle={gameStarted ? `Signal ${currentSignal + 1} of ${signals.length}` : "Recognition Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="uvls-kids-19"
      gameType="uvls"
      totalLevels={20}
      currentLevel={19}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
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
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Signal {currentSignal + 1}/{signals.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              <div className="text-8xl mb-6 text-center animate-pulse">{currentSignalData.emoji}</div>
              
              <p className="text-white text-xl font-bold mb-8 text-center">
                {currentSignalData.text}
              </p>
              
              <p className="text-white/80 mb-4 text-center">Is this a respect signal?</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice(true)}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">Yes ✓</div>
                </button>
                <button
                  onClick={() => handleChoice(false)}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">No ✗</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Signal Expert!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {score} out of {signals.length} correct!
            </p>
            <p className="text-white/80 text-lg mb-4">
              Accuracy: {accuracy}%
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned 3 Coins! 🪙" : "Get 70% or higher to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Tip: Teach nonverbal cues explicitly to help students understand body language!
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

export default RespectSignals;

