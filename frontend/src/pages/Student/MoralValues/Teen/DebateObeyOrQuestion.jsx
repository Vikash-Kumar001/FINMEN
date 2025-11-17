import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateObeyOrQuestion = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const debates = [
    {
      id: 1,
      topic: "Does respecting elders mean blind obedience?",
      positions: [
        { id: 1, text: "Yes - never question elders", emoji: "🙇", correct: false },
        { id: 2, text: "No - respect with polite questioning", emoji: "🤝", correct: true },
      ],
    },
    {
      id: 2,
      topic: "Should students always follow rules, even if unfair?",
      positions: [
        { id: 1, text: "Yes - rules are rules", emoji: "📜", correct: false },
        { id: 2, text: "No - question unfair rules respectfully", emoji: "🗣️", correct: true },
      ],
    },
    {
      id: 3,
      topic: "Is it wrong to question teachers in class?",
      positions: [
        { id: 1, text: "Yes - questioning shows disrespect", emoji: "🚫", correct: false },
        { id: 2, text: "No - it helps learning", emoji: "💡", correct: true },
      ],
    },
    {
      id: 4,
      topic: "Should we obey every instruction from authority?",
      positions: [
        { id: 1, text: "Yes - authority is always right", emoji: "👮‍♂️", correct: false },
        { id: 2, text: "No - follow what’s fair and just", emoji: "⚖️", correct: true },
      ],
    },
    {
      id: 5,
      topic: "Is it disrespectful to express disagreement?",
      positions: [
        { id: 1, text: "Yes - disagreement is rude", emoji: "🙊", correct: false },
        { id: 2, text: "No - respectful disagreement builds understanding", emoji: "🕊️", correct: true },
      ],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [argumentsData, setArgumentsData] = useState({});
  const [rebuttals, setRebuttals] = useState({});
  const [coins, setCoins] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const currentDebate = debates[currentIndex];

  const handleSelect = (posId) => {
    setAnswers((prev) => ({ ...prev, [currentDebate.id]: posId }));
  };

  const handleSubmit = () => {
    const arg = argumentsData[currentDebate.id]?.trim() || "";
    const reb = rebuttals[currentDebate.id]?.trim() || "";
    const selected = answers[currentDebate.id];

    if (!selected || arg.length < 30 || reb.length < 20) {
      alert("Please complete all fields before submitting!");
      return;
    }

    const isCorrect = currentDebate.positions.find((p) => p.id === selected)?.correct;
    const earned = isCorrect ? 5 : 0;
    if (isCorrect) showCorrectAnswerFeedback(5, true);

    setCoins((prev) => prev + earned);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < debates.length) {
      setCurrentIndex(currentIndex + 1);
      setShowFeedback(false);
    } else {
      setGameOver(true);
    }
  };

  const handleFinalNext = () => {
    navigate("/student/moral-values/teen/gratitude-story");
  };

  return (
    <GameShell
      title="Debate: Obey or Question"
      subtitle="Respectful Independence"
      onNext={handleFinalNext}
      nextEnabled={gameOver}
      showGameOver={gameOver}
      score={coins}
      gameId="moral-teen-11"
      gameType="moral"
      totalLevels={20}
      currentLevel={11}
      showConfetti={gameOver && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!gameOver ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            {!showFeedback ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                  Debate {currentIndex + 1} of {debates.length}
                </h2>
                <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-xl font-semibold text-center">
                    {currentDebate.topic}
                  </p>
                </div>

                <h3 className="text-white font-bold mb-4 text-center">
                  Choose Your Position
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {currentDebate.positions.map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => handleSelect(pos.id)}
                      className={`border-2 rounded-xl p-4 transition-all ${
                        answers[currentDebate.id] === pos.id
                          ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                          : "bg-white/20 border-white/40 hover:bg-white/30"
                      }`}
                    >
                      <div className="text-3xl mb-2">{pos.emoji}</div>
                      <div className="text-white font-semibold text-sm text-center">
                        {pos.text}
                      </div>
                    </button>
                  ))}
                </div>

                <h3 className="text-white font-bold mb-2">
                  Build Your Argument (min 30 chars)
                </h3>
                <textarea
                  value={argumentsData[currentDebate.id] || ""}
                  onChange={(e) =>
                    setArgumentsData((prev) => ({
                      ...prev,
                      [currentDebate.id]: e.target.value,
                    }))
                  }
                  placeholder="Provide evidence and reasoning..."
                  className="w-full h-24 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
                  maxLength={200}
                />
                <div className="text-white/50 text-sm mb-4 text-right">
                  {(argumentsData[currentDebate.id]?.length || 0)}/200
                </div>

                <h3 className="text-white font-bold mb-2">
                  Prepare Your Rebuttal (min 20 chars)
                </h3>
                <textarea
                  value={rebuttals[currentDebate.id] || ""}
                  onChange={(e) =>
                    setRebuttals((prev) => ({
                      ...prev,
                      [currentDebate.id]: e.target.value,
                    }))
                  }
                  placeholder="Counter the opposing view..."
                  className="w-full h-20 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
                  maxLength={150}
                />
                <div className="text-white/50 text-sm mb-4 text-right">
                  {(rebuttals[currentDebate.id]?.length || 0)}/150
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 transition"
                >
                  Submit Debate
                </button>
              </>
            ) : (
              <>
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {currentDebate.positions.find(
                      (p) => p.id === answers[currentDebate.id]
                    )?.correct
                      ? "🏆 Balanced Thinker!"
                      : "🤔 Reconsider This..."}
                  </h2>
                  <p className="text-white mb-4">
                    {currentDebate.positions.find(
                      (p) => p.id === answers[currentDebate.id]
                    )?.correct
                      ? "Great! Respect and questioning can coexist — you think critically and respectfully."
                      : "Blind obedience can be risky — respect includes thoughtful questioning."}
                  </p>
                  <p className="text-yellow-400 text-xl font-bold mb-6">
                    {currentDebate.positions.find(
                      (p) => p.id === answers[currentDebate.id]
                    )?.correct
                      ? "+5 Coins Earned 🪙"
                      : "No Coins This Round"}
                  </p>
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                  >
                    {currentIndex + 1 < debates.length ? "Next Debate →" : "View Summary"}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">🏁 Debate Summary</h2>
            <p className="text-white/80 mb-6">
              You completed all 5 debates thoughtfully and respectfully!
            </p>
            <p className="text-yellow-400 text-2xl font-bold">
              You earned {coins} Coins! 🪙
            </p>
            {coins === 25 ? (
              <p className="text-green-400 mt-3 font-semibold">
                Perfect Score! You’re a Balanced Thinker 🌟
              </p>
            ) : (
              <p className="text-blue-300 mt-3 font-semibold">
                Great work! Keep practicing respectful reasoning 💬
              </p>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateObeyOrQuestion;
