import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateRightVsPopular = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [argument, setArgument] = useState("");
  const [rebuttal, setRebuttal] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const debates = [
    {
      id: 1,
      topic: "Would you rather be liked or be honest?",
      positions: [
        { id: 1, position: "Liked - to fit in", emoji: "😅", isCorrect: false },
        { id: 2, position: "Honest - even if unpopular", emoji: "💬", isCorrect: true },
      ],
    },
    {
      id: 2,
      topic: "If friends cheat, should you report or stay quiet?",
      positions: [
        { id: 1, position: "Stay quiet to keep friends", emoji: "🤫", isCorrect: false },
        { id: 2, position: "Report it - it’s the right thing", emoji: "⚖️", isCorrect: true },
      ],
    },
    {
      id: 3,
      topic: "Should you follow trends that go against your values?",
      positions: [
        { id: 1, position: "Yes - everyone’s doing it", emoji: "📱", isCorrect: false },
        { id: 2, position: "No - stay true to your values", emoji: "🧭", isCorrect: true },
      ],
    },
    {
      id: 4,
      topic: "Should you stand up for a bullied classmate even if others won’t?",
      positions: [
        { id: 1, position: "Stay silent to avoid attention", emoji: "😐", isCorrect: false },
        { id: 2, position: "Stand up for them", emoji: "🦸‍♂️", isCorrect: true },
      ],
    },
    {
      id: 5,
      topic: "Is being right more important than being famous?",
      positions: [
        { id: 1, position: "Fame matters most", emoji: "🌟", isCorrect: false },
        { id: 2, position: "Integrity matters more", emoji: "💎", isCorrect: true },
      ],
    },
  ];

  const debate = debates[currentIndex];

  const handleSubmit = () => {
    if (selectedPosition && argument.trim().length >= 30 && rebuttal.trim().length >= 20) {
      const selectedPos = debate.positions.find((p) => p.id === selectedPosition);
      if (selectedPos.isCorrect) {
        showCorrectAnswerFeedback(10, true);
        setCoins((prev) => prev + 10);
      }
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < debates.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedPosition(null);
      setArgument("");
      setRebuttal("");
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/teen/journal-of-ethics");
    }
  };

  const selectedPos = debate.positions.find((p) => p.id === selectedPosition);

  return (
    <GameShell
      title="Debate: Right vs Popular"
      subtitle="Choosing Integrity Over Approval"
      score={coins}
      gameId="moral-teen-96"
      gameType="moral"
      totalLevels={100}
      currentLevel={96}
      showConfetti={showFeedback && selectedPos?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">🗣️</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Debate Topic</h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl font-semibold text-center">{debate.topic}</p>
            </div>

            <h3 className="text-white font-bold mb-4">1️⃣ Choose Your Position</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {debate.positions.map((pos) => (
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
                  <div className="text-white font-semibold text-sm text-center">{pos.position}</div>
                </button>
              ))}
            </div>

            <h3 className="text-white font-bold mb-2">2️⃣ Build Your Argument (min 30 chars)</h3>
            <textarea
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Provide evidence and reasoning..."
              className="w-full h-24 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{argument.length}/200</div>

            <h3 className="text-white font-bold mb-2">3️⃣ Prepare Your Rebuttal (min 20 chars)</h3>
            <textarea
              value={rebuttal}
              onChange={(e) => setRebuttal(e.target.value)}
              placeholder="Counter the opposing view..."
              className="w-full h-20 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={150}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{rebuttal.length}/150</div>

            <button
              onClick={handleSubmit}
              disabled={!selectedPosition || argument.trim().length < 30 || rebuttal.trim().length < 20}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedPosition && argument.trim().length >= 30 && rebuttal.trim().length >= 20
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Submit Debate
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedPos.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedPos.isCorrect ? "🎯 True Leader!" : "Think It Over..."}
            </h2>

            {selectedPos.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! You chose what's right, even if it’s unpopular. That’s real leadership and moral strength!
                  </p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 mb-4">
                  <p className="text-white/80 text-sm mb-1">Your Argument:</p>
                  <p className="text-white italic">"{argument}"</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">+10 Coins 🪙</p>
              </>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  Popularity fades, but doing the right thing builds lifelong character. Try again next round!
                </p>
              </div>
            )}

            {/* ✅ Next Button Added Here */}
            <button
              onClick={handleNext}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentIndex < debates.length - 1 ? "Next Debate ➡️" : "Finish 🏁"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateRightVsPopular;
