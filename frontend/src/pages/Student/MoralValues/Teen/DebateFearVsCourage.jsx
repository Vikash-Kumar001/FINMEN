import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateFearVsCourage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [argument, setArgument] = useState("");
  const [rebuttal, setRebuttal] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // 🔹 5 debate questions (mini-topics)
  const debateQuestions = [
    {
      id: 1,
      topic: "Is courage the absence of fear?",
      correctAnswer: 2,
      options: [
        { id: 1, position: "Yes — courageous people feel no fear", emoji: "😌", isCorrect: false },
        { id: 2, position: "No — courage means acting despite fear", emoji: "🦁", isCorrect: true },
      ],
    },
    {
      id: 2,
      topic: "Can fear make us stronger?",
      correctAnswer: 2,
      options: [
        { id: 1, position: "No — fear only weakens us", emoji: "😨", isCorrect: false },
        { id: 2, position: "Yes — it teaches resilience and awareness", emoji: "💪", isCorrect: true },
      ],
    },
    {
      id: 3,
      topic: "Is it brave to admit your fear?",
      correctAnswer: 2,
      options: [
        { id: 1, position: "No — brave people hide fear", emoji: "🤐", isCorrect: false },
        { id: 2, position: "Yes — honesty is real bravery", emoji: "❤️", isCorrect: true },
      ],
    },
    {
      id: 4,
      topic: "Do courageous people take reckless risks?",
      correctAnswer: 2,
      options: [
        { id: 1, position: "Yes — courage means taking any risk", emoji: "🔥", isCorrect: false },
        { id: 2, position: "No — courage includes wisdom and safety", emoji: "🧠", isCorrect: true },
      ],
    },
    {
      id: 5,
      topic: "Can fear guide us to do the right thing?",
      correctAnswer: 2,
      options: [
        { id: 1, position: "No — fear blocks right choices", emoji: "🚫", isCorrect: false },
        { id: 2, position: "Yes — fear can warn and guide wisely", emoji: "🧭", isCorrect: true },
      ],
    },
  ];

  const currentQ = debateQuestions[selectedQuestionIndex];

  const handleSubmit = () => {
    const correct = selectedPosition === currentQ.correctAnswer;
    if (correct && argument.trim().length >= 30 && rebuttal.trim().length >= 20) {
      showCorrectAnswerFeedback(10, true);
      setCoins(coins + 2); // +2 coins per correct question
      setShowFeedback(true);
    } else if (selectedPosition && argument.trim().length >= 30 && rebuttal.trim().length >= 20) {
      setShowFeedback(true);
    }
  };

  const handleNextQuestion = () => {
    if (selectedQuestionIndex < debateQuestions.length - 1) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
      setSelectedPosition(null);
      setArgument("");
      setRebuttal("");
      setShowFeedback(false);
    } else {
      navigate("/student/moral-values/teen/courage-journal1");
    }
  };

  const selectedPos = currentQ.options.find((p) => p.id === selectedPosition);

  const isLastQuestion = selectedQuestionIndex === debateQuestions.length - 1;

  return (
    <GameShell
      title="Debate: Fear vs Courage"
      subtitle="Understanding True Courage"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={isLastQuestion && showFeedback}
      score={coins}
      gameId="moral-teen-56"
      gameType="moral"
      totalLevels={100}
      currentLevel={56}
      showConfetti={isLastQuestion && showFeedback}
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
              Debate {selectedQuestionIndex + 1} of 5
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl font-semibold text-center">{currentQ.topic}</p>
            </div>

            <h3 className="text-white font-bold mb-4">1. Choose Your Position</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {currentQ.options.map((pos) => (
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

            <h3 className="text-white font-bold mb-2">2. Build Your Argument (min 30 chars)</h3>
            <textarea
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Provide your reasoning..."
              className="w-full h-24 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">
              {argument.length}/200
            </div>

            <h3 className="text-white font-bold mb-2">3. Prepare Your Rebuttal (min 20 chars)</h3>
            <textarea
              value={rebuttal}
              onChange={(e) => setRebuttal(e.target.value)}
              placeholder="Counter the opposing view..."
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
              Submit Debate
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedPos.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedPos.isCorrect ? "💪 True Courage!" : "Reconsider That..."}
            </h2>

            {selectedPos.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! Courage isn't about being fearless. It's about taking action
                    even when you're scared — that's what makes it powerful.
                  </p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 mb-4">
                  <p className="text-white/80 text-sm mb-1">Your Argument:</p>
                  <p className="text-white italic">"{argument}"</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                  +2 Coins Earned! 🪙
                </p>

                <button
                  onClick={handleNextQuestion}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {isLastQuestion ? "Finish Game 🎯" : "Next Question ➡️"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Courage doesn’t mean ignoring fear — it’s about facing it wisely.
                    Reflect and try again with a deeper perspective.
                  </p>
                </div>
                <button
                  onClick={() => setShowFeedback(false)}
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

export default DebateFearVsCourage;
