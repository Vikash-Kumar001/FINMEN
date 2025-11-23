import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleActsOfKindness = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [connections, setConnections] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [shuffledEnds, setShuffledEnds] = useState([]);

  // All 5 puzzles
  const questions = [
    {
      title: "Acts of Kindness",
      actions: [
        { id: 1, text: "Sharing", emoji: "🤲" },
        { id: 2, text: "Helping", emoji: "🤝" },
        { id: 3, text: "Teasing", emoji: "😈" },
        { id: 4, text: "Ignoring", emoji: "🙅" },
        { id: 5, text: "Complimenting", emoji: "💖" }
      ],
      outcomes: [
        { id: 1, text: "Smile", emoji: "😊" },
        { id: 2, text: "Tears", emoji: "😢" },
        { id: 3, text: "Happiness", emoji: "😄" },
        { id: 4, text: "Sadness", emoji: "😔" },
        { id: 5, text: "Joy", emoji: "✨" }
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 3 },
        { start: 3, end: 2 },
        { start: 4, end: 4 },
        { start: 5, end: 5 }
      ]
    },
    {
      title: "Good Habits",
      actions: [
        { id: 1, text: "Brushing", emoji: "🪥" },
        { id: 2, text: "Sleeping Late", emoji: "🌙" },
        { id: 3, text: "Exercising", emoji: "🏃" },
        { id: 4, text: "Skipping Meals", emoji: "🍔" },
        { id: 5, text: "Washing Hands", emoji: "🖐️" }
      ],
      outcomes: [
        { id: 1, text: "Healthy Teeth", emoji: "😁" },
        { id: 2, text: "Tiredness", emoji: "😴" },
        { id: 3, text: "Energy", emoji: "⚡" },
        { id: 4, text: "Weakness", emoji: "🥱" },
        { id: 5, text: "Cleanliness", emoji: "🧼" }
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 }
      ]
    },
    {
      title: "School Life",
      actions: [
        { id: 1, text: "Studying", emoji: "📚" },
        { id: 2, text: "Fighting", emoji: "👊" },
        { id: 3, text: "Helping Teacher", emoji: "🍎" },
        { id: 4, text: "Cheating", emoji: "🙊" },
        { id: 5, text: "Listening", emoji: "👂" }
      ],
      outcomes: [
        { id: 1, text: "Good Marks", emoji: "🏅" },
        { id: 2, text: "Punishment", emoji: "🚫" },
        { id: 3, text: "Respect", emoji: "🙏" },
        { id: 4, text: "Shame", emoji: "😔" },
        { id: 5, text: "Knowledge", emoji: "💡" }
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 }
      ]
    },
    {
      title: "Environmental Acts",
      actions: [
        { id: 1, text: "Planting Trees", emoji: "🌱" },
        { id: 2, text: "Littering", emoji: "🗑️" },
        { id: 3, text: "Recycling", emoji: "♻️" },
        { id: 4, text: "Wasting Water", emoji: "💧" },
        { id: 5, text: "Saving Energy", emoji: "💡" }
      ],
      outcomes: [
        { id: 1, text: "Fresh Air", emoji: "🌤️" },
        { id: 2, text: "Dirty Roads", emoji: "🪣" },
        { id: 3, text: "Clean Earth", emoji: "🌍" },
        { id: 4, text: "Shortage", emoji: "🚱" },
        { id: 5, text: "Sustainability", emoji: "🔋" }
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 }
      ]
    },
    {
      title: "Team Spirit",
      actions: [
        { id: 1, text: "Cooperating", emoji: "🤝" },
        { id: 2, text: "Arguing", emoji: "🗣️" },
        { id: 3, text: "Encouraging", emoji: "👏" },
        { id: 4, text: "Helping Teammate", emoji: "💪" },
        { id: 5, text: "Blaming", emoji: "👎" }
      ],
      outcomes: [
        { id: 1, text: "Victory", emoji: "🏆" },
        { id: 2, text: "Failure", emoji: "❌" },
        { id: 3, text: "Motivation", emoji: "🔥" },
        { id: 4, text: "Team Bond", emoji: "🤗" },
        { id: 5, text: "Sadness", emoji: "😞" }
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 }
      ]
    }
  ];

  const current = questions[currentQuestion];

  // Shuffle outcomes every time question changes
  useEffect(() => {
    setShuffledEnds([...current.outcomes].sort(() => Math.random() - 0.5));
  }, [currentQuestion]);

  const handleStartClick = (startId) => {
    setSelectedStart(startId);
  };

  const handleEndClick = (endId) => {
    if (!selectedStart) return;
    if (connections.find(c => c.start === selectedStart || c.end === endId)) return;

    const newConnections = [...connections, { start: selectedStart, end: endId }];
    setConnections(newConnections);
    setSelectedStart(null);

    if (newConnections.length === current.actions.length) {
      const allCorrect = newConnections.every(conn =>
        current.correctPairs.some(pair => pair.start === conn.start && pair.end === conn.end)
      );

      if (allCorrect) {
        showCorrectAnswerFeedback(5, true);
        setCoins(5);
      } else {
        setCoins(0);
      }
      setShowResult(true);
    }
  };

  const handleNextPuzzle = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setConnections([]);
      setSelectedStart(null);
      setShowResult(false);
      setCoins(0);
    } else {
      navigate("/student/moral-values/kids/animal-storyy");
    }
  };

  const isConnected = (id, type) =>
    connections.some(c => type === "start" ? c.start === id : c.end === id);

  return (
    <GameShell
      title={`Puzzle ${currentQuestion + 1}: ${current.title}`}
      subtitle="Match Actions to Outcomes"
      score={coins}
      gameId="moral-kids-24"
      gameType="educational"
      totalLevels={100}
      currentLevel={24 + currentQuestion}
      showConfetti={showResult && coins > 0}
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              Connect each action to its outcome
            </h3>
            <div className="grid grid-cols-2 gap-8">
              {/* Actions */}
              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Actions</h4>
                {current.actions.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleStartClick(item.id)}
                    disabled={isConnected(item.id, "start")}
                    className={`w-full border-2 rounded-xl p-6 transition-all ${
                      isConnected(item.id, "start")
                        ? "bg-green-500/30 border-green-400"
                        : selectedStart === item.id
                        ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                        : "bg-white/20 border-white/40 hover:bg-white/30"
                    }`}
                  >
                    <div className="text-5xl mb-2">{item.emoji}</div>
                    <div className="text-white font-semibold text-lg">{item.text}</div>
                  </button>
                ))}
              </div>

              {/* Outcomes */}
              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Outcomes</h4>
                {shuffledEnds.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleEndClick(item.id)}
                    disabled={isConnected(item.id, "end")}
                    className={`w-full border-2 rounded-xl p-6 transition-all ${
                      isConnected(item.id, "end")
                        ? "bg-green-500/30 border-green-400"
                        : "bg-white/20 border-white/40 hover:bg-white/30"
                    }`}
                  >
                    <div className="text-5xl mb-2">{item.emoji}</div>
                    <div className="text-white font-semibold text-lg">{item.text}</div>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-white/80 text-sm text-center mt-4">
              Connections: {connections.length}/{current.actions.length}
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {coins > 0 ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-4">🎉 Perfect!</h2>
                <p className="text-yellow-400 text-2xl font-bold mb-6">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-white mb-4">Not Quite Right 😅</h2>
                <p className="text-white/70 mb-6">
                  Try again to get all matches correct!
                </p>
              </>
            )}

            {/* ✅ Add Next Button */}
            <button
              onClick={handleNextPuzzle}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              {currentQuestion < questions.length - 1 ? "Next Puzzle ➡️" : "Finish Game 🎯"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleActsOfKindness;
