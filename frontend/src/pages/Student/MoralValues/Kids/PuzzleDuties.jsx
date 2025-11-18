import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleDuties = () => {
  const navigate = useNavigate();
  const [level, setLevel] = useState(0);
  const [connections, setConnections] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // ✅ All 5 mini puzzles
  const puzzles = [
    {
      startItems: [
        { id: 1, text: "Homework", emoji: "📚" },
        { id: 2, text: "Cleaning Room", emoji: "🧹" },
        { id: 3, text: "Feeding Dog", emoji: "🐶" }
      ],
      endItems: [
        { id: 1, text: "Student", emoji: "👩‍🎓" },
        { id: 2, text: "Self", emoji: "🧑" },
        { id: 3, text: "Owner", emoji: "🐕" }
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 }
      ]
    },
    {
      startItems: [
        { id: 1, text: "Taking out Trash", emoji: "🗑️" },
        { id: 2, text: "Washing Dishes", emoji: "🍽️" },
        { id: 3, text: "Watering Plants", emoji: "🌿" }
      ],
      endItems: [
        { id: 1, text: "Family", emoji: "👪" },
        { id: 2, text: "Self", emoji: "🧑" },
        { id: 3, text: "Gardener", emoji: "🪴" }
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 }
      ]
    },
    {
      startItems: [
        { id: 1, text: "Feeding Cat", emoji: "🐱" },
        { id: 2, text: "Helping Mom Cook", emoji: "👩‍🍳" },
        { id: 3, text: "Arranging Books", emoji: "📖" }
      ],
      endItems: [
        { id: 1, text: "Owner", emoji: "🐾" },
        { id: 2, text: "Family", emoji: "👪" },
        { id: 3, text: "Student", emoji: "👩‍🎓" }
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 }
      ]
    },
    {
      startItems: [
        { id: 1, text: "Making Bed", emoji: "🛏️" },
        { id: 2, text: "Feeding Fish", emoji: "🐠" },
        { id: 3, text: "Helping Sibling Study", emoji: "📘" }
      ],
      endItems: [
        { id: 1, text: "Self", emoji: "🧑" },
        { id: 2, text: "Owner", emoji: "🐟" },
        { id: 3, text: "Family", emoji: "👨‍👩‍👧" }
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 }
      ]
    },
    {
      startItems: [
        { id: 1, text: "Helping Grandpa Walk", emoji: "👴" },
        { id: 2, text: "Folding Clothes", emoji: "👕" },
        { id: 3, text: "Brushing Teeth", emoji: "🪥" }
      ],
      endItems: [
        { id: 1, text: "Family", emoji: "👪" },
        { id: 2, text: "Self", emoji: "🧑" },
        { id: 3, text: "Self", emoji: "🧑" }
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 }
      ]
    }
  ];

  const currentPuzzle = puzzles[level];

  const handleStartClick = (startId) => {
    setSelectedStart(startId);
  };

  const handleEndClick = (endId) => {
    if (!selectedStart) return;

    if (connections.find(c => c.start === selectedStart || c.end === endId)) return;

    const newConnections = [...connections, { start: selectedStart, end: endId }];
    setConnections(newConnections);
    setSelectedStart(null);

    if (newConnections.length === currentPuzzle.correctPairs.length) {
      const allCorrect = newConnections.every(conn =>
        currentPuzzle.correctPairs.some(pair => pair.start === conn.start && pair.end === conn.end)
      );

      if (allCorrect) {
        showCorrectAnswerFeedback(2, true);
        setTimeout(() => {
          if (level < puzzles.length - 1) {
            // next level
            setLevel((prev) => prev + 1);
            setConnections([]);
            setSelectedStart(null);
          } else {
            // final puzzle complete
            setCoins(10);
            setShowResult(true);
          }
        }, 1000);
      } else {
        setShowResult(true);
      }
    }
  };

  const handleTryAgain = () => {
    setConnections([]);
    setSelectedStart(null);
    setShowResult(false);
    setCoins(0);
    setLevel(0);
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/chores-story");
  };

  const isConnected = (id, type) => {
    return connections.some(c => type === 'start' ? c.start === id : c.end === id);
  };

  return (
    <GameShell
      title="Puzzle: Duties Match"
      subtitle="Connect Duties to the Right Person"
      onNext={handleNext}
      nextEnabled={showResult && coins > 0}
      showGameOver={showResult && coins > 0}
      score={coins}
      gameId="moral-kids-34"
      gameType="educational"
      totalLevels={100}
      currentLevel={34}
      showConfetti={showResult && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              Level {level + 1} of {puzzles.length} — Connect the Duty!
            </h3>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Duties</h4>
                {currentPuzzle.startItems.map(item => (
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

              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Persons</h4>
                {currentPuzzle.endItems.map(item => (
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

            <div className="mt-6 bg-blue-500/20 rounded-lg p-3">
              <p className="text-white/80 text-sm text-center">
                Connections: {connections.length}/{currentPuzzle.correctPairs.length}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">🎉 Duties Master!</h2>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center">
                Excellent work! You matched all duties correctly across all puzzles.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned 10 Coins! 🪙
            </p>
            <button
              onClick={handleNext}
              className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Next Activity ➡️
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleDuties;
