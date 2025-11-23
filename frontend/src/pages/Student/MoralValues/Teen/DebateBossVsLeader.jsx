import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateBossVsLeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [argument, setArgument] = useState("");
  const [rebuttal, setRebuttal] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const rounds = [
    {
      id: 1,
      topic: "A boss commands, a leader inspires — which is better?",
      options: [
        { id: 1, text: "Commanding shows authority", emoji: "🗣️", isCorrect: false },
        { id: 2, text: "Inspiring motivates lasting results", emoji: "🌟", isCorrect: true },
      ],
      correctMessage:
        "True! A leader inspires others to achieve shared goals, while a boss merely issues orders.",
      wrongMessage: "Commanding creates fear, not respect. Inspiration builds loyalty.",
    },
    {
      id: 2,
      topic: "Should a leader take credit or share it?",
      options: [
        { id: 1, text: "Take full credit for control", emoji: "👑", isCorrect: false },
        { id: 2, text: "Share credit with the team", emoji: "🤝", isCorrect: true },
      ],
      correctMessage:
        "Exactly! True leaders uplift their team and celebrate everyone’s contributions.",
      wrongMessage: "Taking all the credit weakens trust. Leaders grow others, not their own ego.",
    },
    {
      id: 3,
      topic: "When mistakes happen, what should a leader do?",
      options: [
        { id: 1, text: "Blame others quickly", emoji: "⚠️", isCorrect: false },
        { id: 2, text: "Take responsibility and guide", emoji: "🧭", isCorrect: true },
      ],
      correctMessage:
        "Perfect! Accountability earns respect. Leaders fix problems, not find scapegoats.",
      wrongMessage: "Blame divides teams — leadership means guiding through challenges.",
    },
    {
      id: 4,
      topic: "A boss uses fear; a leader uses respect — agree?",
      options: [
        { id: 1, text: "Yes, respect motivates more", emoji: "💎", isCorrect: true },
        { id: 2, text: "No, fear keeps control", emoji: "😠", isCorrect: false },
      ],
      correctMessage:
        "Correct! Respect builds long-term loyalty and creativity — fear only limits growth.",
      wrongMessage: "Fear might control behavior, but it destroys innovation and trust.",
    },
    {
      id: 5,
      topic: "Final thought — Is a boss the same as a leader?",
      options: [
        { id: 1, text: "Yes, both manage people", emoji: "📋", isCorrect: false },
        { id: 2, text: "No, a leader serves and empowers", emoji: "🚀", isCorrect: true },
      ],
      correctMessage:
        "Exactly! A true leader serves their team, guiding them with empathy and vision.",
      wrongMessage: "Management and leadership differ — leaders serve, not control.",
    },
  ];

  const current = rounds[currentRound];

  const handleSubmit = () => {
    const selected = current.options.find((opt) => opt.id === selectedPosition);
    if (!selected) return;

    if (selected.isCorrect && argument.trim().length >= 30 && rebuttal.trim().length >= 20) {
      showCorrectAnswerFeedback(2, true);
      setCoins((prev) => prev + 2);
      setShowFeedback(true);
    } else if (argument.trim().length >= 30 && rebuttal.trim().length >= 20) {
      setShowFeedback(true);
    }
  };

  const handleNextRound = () => {
    if (currentRound < rounds.length - 1) {
      setCurrentRound((prev) => prev + 1);
      setSelectedPosition(null);
      setArgument("");
      setRebuttal("");
      setShowFeedback(false);
      resetFeedback();
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/journal-leadership");
  };

  return (
    <GameShell
      title="Debate: Boss vs Leader"
      subtitle="Understanding Leadership"
      onNext={handleNext}
      nextEnabled={showFeedback && currentRound === rounds.length - 1}
      showGameOver={showFeedback && currentRound === rounds.length - 1}
      score={coins}
      gameId="moral-teen-76"
      gameType="moral"
      totalLevels={100}
      currentLevel={76}
      showConfetti={showFeedback && current.options[selectedPosition - 1]?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">🧠</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Debate Round {currentRound + 1}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-lg font-semibold text-center">{current.topic}</p>
            </div>

            <h3 className="text-white font-bold mb-3">1. Choose Your Position</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {current.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedPosition(opt.id)}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    selectedPosition === opt.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-3xl mb-2">{opt.emoji}</div>
                  <div className="text-white font-semibold text-sm">{opt.text}</div>
                </button>
              ))}
            </div>

            <h3 className="text-white font-bold mb-2">2. Build Your Argument (min 30 chars)</h3>
            <textarea
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Provide reasoning or evidence..."
              className="w-full h-24 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{argument.length}/200</div>

            <h3 className="text-white font-bold mb-2">3. Prepare Your Rebuttal (min 20 chars)</h3>
            <textarea
              value={rebuttal}
              onChange={(e) => setRebuttal(e.target.value)}
              placeholder="Counter the opposing idea..."
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
              Submit Round
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">
              {current.options.find((o) => o.id === selectedPosition)?.emoji}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {current.options.find((o) => o.id === selectedPosition)?.isCorrect
                ? "🏆 Great Leadership Insight!"
                : "Think Like a True Leader..."}
            </h2>

            {current.options.find((o) => o.id === selectedPosition)?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{current.correctMessage}</p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 mb-4">
                  <p className="text-white/80 text-sm mb-1">Your Argument:</p>
                  <p className="text-white italic">"{argument}"</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 2 Coins! 🪙
                </p>
                {currentRound < rounds.length - 1 && (
                  <button
                    onClick={handleNextRound}
                    className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Next Round
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{current.wrongMessage}</p>
                </div>
                <button
                  onClick={handleNextRound}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Round
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateBossVsLeader;
