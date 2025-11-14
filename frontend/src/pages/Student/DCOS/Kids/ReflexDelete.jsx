import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexDelete = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const photos = [
    { id: 1, emoji: "😜", caption: "Silly selfie with toothpaste on face" },
    { id: 2, emoji: "🥴", caption: "Weird dance pose caught on camera" },
    { id: 3, emoji: "🤪", caption: "Funny face photo before school" },
    { id: 4, emoji: "😅", caption: "Messy hair Monday picture" },
    { id: 5, emoji: "🙈", caption: "Goofy group photo with friends" }
  ];

  useEffect(() => {
    let timer;
    if (gameStarted && !showResult && !waiting) {
      const delay = Math.random() * 3000 + 1000; // 1–4 sec random
      setWaiting(true);
      timer = setTimeout(() => {
        setShowImage(true);
        setWaiting(false);
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [gameStarted, currentRound, showResult]);

  const handleTap = () => {
    if (showImage) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    nextRound();
  };

  const handleMiss = () => {
    if (!showImage) {
      nextRound();
    }
  };

  const nextRound = () => {
    setShowImage(false);
    if (currentRound < photos.length - 1) {
      setCurrentRound((prev) => prev + 1);
    } else {
      const accuracy = ((score + (showImage ? 1 : 0)) / photos.length) * 100;
      if (accuracy >= 70) {
        setCoins(3);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setGameStarted(false);
    setCurrentRound(0);
    setScore(0);
    setCoins(0);
    setShowResult(false);
    setShowImage(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/puzzle-online-forever");
  };

  const accuracy = Math.round((score / photos.length) * 100);
  const currentPhoto = photos[currentRound];

  return (
    <GameShell
      title="Reflex Delete"
      subtitle={gameStarted ? `Round ${currentRound + 1} of ${photos.length}` : "Quick Reflex Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="dcos-kids-62"
      gameType="reflex"
      totalLevels={100}
      currentLevel={62}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Reflex Delete Challenge!</h2>
            <p className="text-white/80 mb-6">
              👀 Tap FAST when a silly photo appears — don’t let it get posted online!
            </p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div
            onClick={handleMiss}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center relative"
          >
            <div className="flex justify-between mb-6">
              <span className="text-white/80">Round {currentRound + 1}/{photos.length}</span>
              <span className="text-yellow-400 font-bold">Score: {score}</span>
            </div>

            {showImage ? (
              <div
                onClick={handleTap}
                className="cursor-pointer select-none transition transform hover:scale-110"
              >
                <div className="text-9xl mb-4 animate-bounce">{currentPhoto.emoji}</div>
                <p className="text-white text-xl font-bold mb-2">{currentPhoto.caption}</p>
                <p className="text-white/70 text-sm">(Tap to delete before it posts!)</p>
              </div>
            ) : (
              <p className="text-white/60 text-lg py-20 animate-pulse">Waiting for photo...</p>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🧠 Smart Reflexes!" : "⚡ Too Slow!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You avoided {score} out of {photos.length} silly posts ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Think before posting! Once online, it stays forever — deleting before posting is a smart move.
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

export default ReflexDelete;
