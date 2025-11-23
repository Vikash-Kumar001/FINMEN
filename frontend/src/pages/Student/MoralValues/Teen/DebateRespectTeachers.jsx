import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateRespectTeachers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [argument, setArgument] = useState("");
  const [rebuttal, setRebuttal] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentDebate, setCurrentDebate] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // 🔹 5 debate questions
  const debates = [
    {
      topic: "Should students argue rudely with teachers?",
      correctId: 2,
      positions: [
        { id: 1, position: "Yes - students have rights too", emoji: "💪" },
        { id: 2, position: "No - disagree respectfully, not rudely", emoji: "🙏" },
      ],
    },
    {
      topic: "Is it okay to interrupt a teacher while they’re explaining?",
      correctId: 2,
      positions: [
        { id: 1, position: "Yes - if I think they’re wrong", emoji: "🗣️" },
        { id: 2, position: "No - wait and share politely later", emoji: "🤝" },
      ],
    },
    {
      topic: "Should students gossip about teachers online?",
      correctId: 2,
      positions: [
        { id: 1, position: "Yes - it’s freedom of speech", emoji: "💬" },
        { id: 2, position: "No - it spreads disrespect", emoji: "🚫" },
      ],
    },
    {
      topic: "Is obeying teachers the same as respecting them?",
      correctId: 2,
      positions: [
        { id: 1, position: "Yes - you must always obey", emoji: "🙇" },
        { id: 2, position: "No - respect means understanding, not blind obedience", emoji: "🧠" },
      ],
    },
    {
      topic: "Should teachers and students treat each other equally?",
      correctId: 2,
      positions: [
        { id: 1, position: "No - teachers should always dominate", emoji: "👑" },
        { id: 2, position: "Yes - mutual respect creates better learning", emoji: "🤗" },
      ],
    },
  ];

  const current = debates[currentDebate];
  const selectedPos = current.positions.find((p) => p.id === selectedPosition);

  const handleSubmit = () => {
    if (selectedPosition && argument.trim().length >= 30 && rebuttal.trim().length >= 20) {
      const isCorrect = selectedPosition === current.correctId;
      const earned = isCorrect ? 2 : 0;
      if (isCorrect) showCorrectAnswerFeedback(2, true);
      setCoins((prev) => prev + earned);

      // Move to next debate or end
      if (currentDebate < debates.length - 1) {
        setTimeout(() => {
          setSelectedPosition(null);
          setArgument("");
          setRebuttal("");
          setShowFeedback(false);
          setCurrentDebate((prev) => prev + 1);
        }, 1000);
      } else {
        setShowFeedback(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/roleplay-respect-leader");
  };

  return (
    <GameShell
      title="Debate: Respect & Communication"
      subtitle="Think, Argue, Reflect Respectfully"
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={showFeedback}
      score={coins}
      gameId="moral-teen-17"
      gameType="moral"
      totalLevels={20}
      currentLevel={17}
      showConfetti={showFeedback}
      backPath="/games/moral-values/teens"
    
      maxScore={20} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-5xl mb-4 text-center">👩‍🏫</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Debate {currentDebate + 1} / 5
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl font-semibold text-center">
                {current.topic}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">1️⃣ Choose Your Position</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {current.positions.map((pos) => (
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

            <h3 className="text-white font-bold mb-2">2️⃣ Build Your Argument (min 30 chars)</h3>
            <textarea
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Provide reasoning or examples..."
              className="w-full h-24 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">
              {argument.length}/200
            </div>

            <h3 className="text-white font-bold mb-2">3️⃣ Prepare Your Rebuttal (min 20 chars)</h3>
            <textarea
              value={rebuttal}
              onChange={(e) => setRebuttal(e.target.value)}
              placeholder="Counter the other side’s view..."
              className="w-full h-20 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={150}
            />
            <div className="text-white/50 text-sm mb-4 text-right">
              {rebuttal.length}/150
            </div>

            <button
              onClick={handleSubmit}
              disabled={
                !selectedPosition ||
                argument.trim().length < 30 ||
                rebuttal.trim().length < 20
              }
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedPosition &&
                argument.trim().length >= 30 &&
                rebuttal.trim().length >= 20
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentDebate < debates.length - 1
                ? "Next Debate ➡️"
                : "Finish All Debates 🌟"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">🏅</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Great Work, Respectful Debater!
            </h2>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 You completed all 5 debates thoughtfully! Remember — respectful disagreement
                builds understanding and trust. Keep your voice confident and kind.
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateRespectTeachers;
