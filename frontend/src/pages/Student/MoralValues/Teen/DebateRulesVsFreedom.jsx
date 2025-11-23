import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateRulesVsFreedom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [argument, setArgument] = useState("");
  const [rebuttal, setRebuttal] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } =
    useGameFeedback();

  // Show only 5 debate questions
  const debates = [
    {
      topic: "Do rules kill freedom or create order?",
      positions: [
        { id: 1, position: "Rules limit freedom", emoji: "🚫", isCorrect: false },
        { id: 2, position: "Rules create order", emoji: "✅", isCorrect: true },
      ],
    },
    {
      topic: "Are traffic rules restrictive or protective?",
      positions: [
        { id: 1, position: "Restrictive", emoji: "🚷", isCorrect: false },
        { id: 2, position: "Protective", emoji: "🛡️", isCorrect: true },
      ],
    },
    {
      topic: "School rules: boredom or guidance?",
      positions: [
        { id: 1, position: "Boring", emoji: "😴", isCorrect: false },
        { id: 2, position: "Guidance", emoji: "🎯", isCorrect: true },
      ],
    },
    {
      topic: "Workplace rules: unnecessary or structure?",
      positions: [
        { id: 1, position: "Unnecessary", emoji: "❌", isCorrect: false },
        { id: 2, position: "Structure", emoji: "🏢", isCorrect: true },
      ],
    },
    {
      topic: "Rules at home: restriction or harmony?",
      positions: [
        { id: 1, position: "Restriction", emoji: "🔒", isCorrect: false },
        { id: 2, position: "Harmony", emoji: "🏡", isCorrect: true },
      ],
    },
  ];

  const handleSubmit = () => {
    if (
      selectedPosition &&
      argument.trim().length >= 30 &&
      rebuttal.trim().length >= 20
    ) {
      const currentDebate = debates[currentQuestion];
      if (currentDebate.positions.find(p => p.id === selectedPosition)?.isCorrect) {
        showCorrectAnswerFeedback(10, true);
        setCoins(coins + 10);
      }
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < debates.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedPosition(null);
      setArgument("");
      setRebuttal("");
      setShowFeedback(false);
    } else {
      navigate("/student/moral-values/teen/journal-discipline");
    }
  };

  const selectedPos = debates[currentQuestion].positions.find(
    (p) => p.id === selectedPosition
  );

  return (
    <GameShell
      title="Debate: Rules vs Freedom"
      subtitle="Understanding Order"
      score={coins}
      totalLevels={100}
      currentLevel={36}
      gameId="moral-teen-36"
      gameType="moral"
      backPath="/games/moral-values/teens"
      flashPoints={flashPoints}
      showConfetti={showFeedback && selectedPos?.isCorrect}
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">🎤</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Debate {currentQuestion + 1} of {debates.length}
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl font-semibold text-center">
                {debates[currentQuestion].topic}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {debates[currentQuestion].positions.map((pos) => (
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

            <textarea
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Your Argument (min 30 chars)"
              className="w-full h-24 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white mb-4 resize-none"
            />
            <textarea
              value={rebuttal}
              onChange={(e) => setRebuttal(e.target.value)}
              placeholder="Your Rebuttal (min 20 chars)"
              className="w-full h-20 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white mb-4 resize-none"
            />

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
              Submit Debate
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedPos?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedPos?.isCorrect ? "🏆 Great Thinking!" : "💭 Try Again!"}
            </h2>
            <p className="text-white/80 mb-4">
              {selectedPos?.isCorrect
                ? "Rules help create fairness and safety while preserving freedom."
                : "Remember — rules exist to balance freedom with responsibility."}
            </p>
            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion === debates.length - 1
                ? "Finish Debate"
                : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateRulesVsFreedom;
