import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateEqualVsFair = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [argument, setArgument] = useState("");
  const [rebuttal, setRebuttal] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // 🧩 5 Debate Topics for Equal vs Fair
  const debates = [
    {
      topic: "Is treating everyone the same always fair?",
      positions: [
        { id: 1, position: "Yes, equal means fair", emoji: "⚖️", isCorrect: false },
        { id: 2, position: "No, fairness can mean giving based on need", emoji: "🎯", isCorrect: true }
      ]
    },
    {
      topic: "Should all students get the same resources, even if some need more help?",
      positions: [
        { id: 1, position: "Yes, same for everyone", emoji: "📚", isCorrect: false },
        { id: 2, position: "No, extra help for those who need it is fair", emoji: "💡", isCorrect: true }
      ]
    },
    {
      topic: "If two players practice differently, should they get equal rewards?",
      positions: [
        { id: 1, position: "Yes, equality first", emoji: "🏅", isCorrect: false },
        { id: 2, position: "No, reward effort and performance fairly", emoji: "🔥", isCorrect: true }
      ]
    },
    {
      topic: "In a family, should all siblings get the same allowance regardless of chores?",
      positions: [
        { id: 1, position: "Yes, equal treatment", emoji: "💰", isCorrect: false },
        { id: 2, position: "No, fair means based on contribution", emoji: "🧹", isCorrect: true }
      ]
    },
    {
      topic: "At school, should teachers give everyone the same grade for trying?",
      positions: [
        { id: 1, position: "Yes, equality matters", emoji: "📝", isCorrect: false },
        { id: 2, position: "No, fairness rewards effort and skill", emoji: "🏆", isCorrect: true }
      ]
    }
  ];

  const handleSubmit = () => {
    const currentDebate = debates[currentQuestion];
    if (selectedPosition === 2 && argument.trim().length >= 30 && rebuttal.trim().length >= 20) {
      showCorrectAnswerFeedback(10, true);
      setCoins(coins + 10);
      setShowFeedback(true);
    } else if (selectedPosition && argument.trim().length >= 30 && rebuttal.trim().length >= 20) {
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
      navigate("/student/moral-values/teen/journal-fairness");
    }
  };

  const selectedPos = debates[currentQuestion].positions.find(p => p.id === selectedPosition);

  return (
    <GameShell
      title="Debate: Equal vs Fair"
      subtitle="Understanding Real Fairness"
      onNext={handleNext}
      nextEnabled={showFeedback && selectedPos?.isCorrect}
      showGameOver={showFeedback && selectedPos?.isCorrect}
      score={coins}
      gameId="moral-teen-46"
      gameType="moral"
      totalLevels={100}
      currentLevel={46}
      showConfetti={showFeedback && selectedPos?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">⚖️</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Debate Topic</h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl font-semibold text-center">{debates[currentQuestion].topic}</p>
            </div>

            <h3 className="text-white font-bold mb-4">1. Choose Your Position</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {debates[currentQuestion].positions.map(pos => (
                <button
                  key={pos.id}
                  onClick={() => setSelectedPosition(pos.id)}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    selectedPosition === pos.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-3xl mb-2">{pos.emoji}</div>
                  <div className="text-white font-semibold text-sm text-center">{pos.position}</div>
                </button>
              ))}
            </div>

            <h3 className="text-white font-bold mb-2">2. Build Your Argument (min 30 chars)</h3>
            <textarea
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Explain why fairness is not always equality..."
              className="w-full h-24 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{argument.length}/200</div>

            <h3 className="text-white font-bold mb-2">3. Prepare Your Rebuttal (min 20 chars)</h3>
            <textarea
              value={rebuttal}
              onChange={(e) => setRebuttal(e.target.value)}
              placeholder="Counter the equality-only viewpoint..."
              className="w-full h-20 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={150}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{rebuttal.length}/150</div>

            <button
              onClick={handleSubmit}
              disabled={!selectedPosition || argument.trim().length < 30 || rebuttal.trim().length < 20}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedPosition && argument.trim().length >= 30 && rebuttal.trim().length >= 20
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Debate
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedPos?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedPos?.isCorrect ? "🏆 Fairness Expert!" : "Think Deeper..."}
            </h2>

            {selectedPos?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great point! Equality gives everyone the same thing, but fairness means giving people what they truly need. 
                    Real justice considers effort, context, and individual needs — not just sameness.
                  </p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 mb-4">
                  <p className="text-white/80 text-sm mb-1">Your Argument:</p>
                  <p className="text-white italic">"{argument}"</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 10 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Equal treatment isn't always fair. Fairness looks at each person's needs and efforts. 
                    True justice balances both equality and compassion.
                  </p>
                </div>
                <p className="text-white/70 text-center">Try again with a thoughtful argument!</p>
              </>
            )}

            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateEqualVsFair;
