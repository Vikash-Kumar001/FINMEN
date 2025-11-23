import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateKindnessOrStrength = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [argument, setArgument] = useState("");
  const [rebuttal, setRebuttal] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const debates = [
    {
      id: 1,
      topic: "Is kindness a sign of strength or weakness?",
      positions: [
        { id: 1, position: "Weakness - people take advantage", emoji: "😕", isCorrect: false },
        { id: 2, position: "Strength - it takes courage to stay kind", emoji: "💪", isCorrect: true },
      ],
    },
    {
      id: 2,
      topic: "Does being kind make you vulnerable?",
      positions: [
        { id: 1, position: "Yes - people might hurt you", emoji: "🥺", isCorrect: false },
        { id: 2, position: "No - kindness inspires and uplifts", emoji: "🌈", isCorrect: true },
      ],
    },
    {
      id: 3,
      topic: "Can kindness change others’ behavior?",
      positions: [
        { id: 1, position: "No - people don’t change easily", emoji: "🙄", isCorrect: false },
        { id: 2, position: "Yes - kindness can heal and motivate", emoji: "💖", isCorrect: true },
      ],
    },
    {
      id: 4,
      topic: "Is standing up for others a form of kindness?",
      positions: [
        { id: 1, position: "No - it causes conflict", emoji: "😬", isCorrect: false },
        { id: 2, position: "Yes - kindness includes courage", emoji: "🦁", isCorrect: true },
      ],
    },
    {
      id: 5,
      topic: "Can a strong leader also be kind?",
      positions: [
        { id: 1, position: "No - kindness makes you soft", emoji: "🧊", isCorrect: false },
        { id: 2, position: "Yes - true strength includes kindness", emoji: "👑", isCorrect: true },
      ],
    },
  ];

  const currentDebate = debates[currentIndex];

  const handleSubmit = () => {
    const pos = currentDebate.positions.find((p) => p.id === selectedPosition);
    if (pos?.isCorrect && argument.trim().length >= 30 && rebuttal.trim().length >= 20) {
      showCorrectAnswerFeedback(2, true);
      setTotalCorrect((prev) => prev + 1);
    }

    if (currentIndex < debates.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setSelectedPosition(null);
        setArgument("");
        setRebuttal("");
      }, 600);
    } else {
      const earned = totalCorrect + (pos?.isCorrect ? 1 : 0);
      setCoins(earned * 2);
      setShowFeedback(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedPosition(null);
    setArgument("");
    setRebuttal("");
    setCurrentIndex(0);
    setCoins(0);
    setShowFeedback(false);
    setTotalCorrect(0);
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/journal-empathy1");
  };

  const selectedPos = currentDebate.positions.find((p) => p.id === selectedPosition);

  return (
    <GameShell
      title="Debate: Kindness or Strength"
      score={coins}
      subtitle="Exploring True Strength"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showFeedback && coins > 0}
      
      gameId="moral-teen-26"
      gameType="moral"
      totalLevels={100}
      currentLevel={26}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">💬</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Debate {currentIndex + 1} of {debates.length}
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl font-semibold text-center">
                {currentDebate.topic}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">1. Choose Your Position</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {currentDebate.positions.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => setSelectedPosition(pos.id)}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    selectedPosition === pos.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-3xl mb-2">{pos.emoji}</div>
                  <div className="text-white font-semibold text-sm text-center">
                    {pos.position}
                  </div>
                </button>
              ))}
            </div>

            <h3 className="text-white font-bold mb-2">
              2. Write Your Argument (min 30 chars)
            </h3>
            <textarea
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Share your reasoning..."
              className="w-full h-24 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">
              {argument.length}/200
            </div>

            <h3 className="text-white font-bold mb-2">
              3. Prepare Rebuttal (min 20 chars)
            </h3>
            <textarea
              value={rebuttal}
              onChange={(e) => setRebuttal(e.target.value)}
              placeholder="Counter the other side..."
              className="w-full h-20 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={150}
            />
            <div className="text-white/50 text-sm mb-4 text-right">
              {rebuttal.length}/150
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedPosition || argument.trim().length < 30 || rebuttal.trim().length < 20}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedPosition && argument.trim().length >= 30 && rebuttal.trim().length >= 20
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Submit Response
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">💖</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {coins >= 8 ? "🌟 Kindness is Power!" : "Think Deeper..."}
            </h2>

            {coins >= 8 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Beautiful reasoning! Kindness isn’t weakness — it’s real
                    strength. It takes confidence, control, and compassion to
                    stay kind in a tough world. True leaders combine both
                    courage and kindness.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned {coins} Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Kindness may seem soft, but it takes inner strength. Try
                    again to explore how compassion builds strong relationships
                    and leadership.
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateKindnessOrStrength;
