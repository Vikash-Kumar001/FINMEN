import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfSelfControl = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [connections, setConnections] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [round, setRound] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // 5 sets of puzzles (Rounds)
  const puzzles = [
    {
      startItems: [
        { id: 1, text: "Discipline", emoji: "💪" },
        { id: 2, text: "Laziness", emoji: "🛋️" },
        { id: 3, text: "Consistency", emoji: "📅" },
        { id: 4, text: "Procrastination", emoji: "⏰" },
        { id: 5, text: "Focus", emoji: "🎯" }
      ],
      endItems: [
        { id: 1, text: "Success", emoji: "🏆" },
        { id: 2, text: "Failure", emoji: "💔" },
        { id: 3, text: "Achievement", emoji: "🥇" },
        { id: 4, text: "Missed Goals", emoji: "❌" },
        { id: 5, text: "Progress", emoji: "📈" }
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
      startItems: [
        { id: 1, text: "Patience", emoji: "🧘" },
        { id: 2, text: "Anger", emoji: "😡" },
        { id: 3, text: "Calmness", emoji: "🌊" },
        { id: 4, text: "Impulsiveness", emoji: "⚡" },
        { id: 5, text: "Self-Control", emoji: "🧠" }
      ],
      endItems: [
        { id: 1, text: "Peace", emoji: "☮️" },
        { id: 2, text: "Regret", emoji: "😞" },
        { id: 3, text: "Harmony", emoji: "🎵" },
        { id: 4, text: "Mistakes", emoji: "❗" },
        { id: 5, text: "Balance", emoji: "⚖️" }
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
      startItems: [
        { id: 1, text: "Honesty", emoji: "🤝" },
        { id: 2, text: "Cheating", emoji: "🚫" },
        { id: 3, text: "Truth", emoji: "💬" },
        { id: 4, text: "Integrity", emoji: "💎" },
        { id: 5, text: "Lying", emoji: "😶" }
      ],
      endItems: [
        { id: 1, text: "Trust", emoji: "🫱🏻‍🫲🏽" },
        { id: 2, text: "Loss of Respect", emoji: "😔" },
        { id: 3, text: "Confidence", emoji: "🌟" },
        { id: 4, text: "Strong Character", emoji: "🏗️" },
        { id: 5, text: "Guilt", emoji: "😢" }
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
      startItems: [
        { id: 1, text: "Respect", emoji: "🙏" },
        { id: 2, text: "Rudeness", emoji: "😤" },
        { id: 3, text: "Politeness", emoji: "😊" },
        { id: 4, text: "Kindness", emoji: "💖" },
        { id: 5, text: "Empathy", emoji: "💞" }
      ],
      endItems: [
        { id: 1, text: "Mutual Care", emoji: "🤗" },
        { id: 2, text: "Conflict", emoji: "⚔️" },
        { id: 3, text: "Good Manners", emoji: "🌼" },
        { id: 4, text: "Helping Others", emoji: "🤝" },
        { id: 5, text: "Understanding", emoji: "🫶" }
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
      startItems: [
        { id: 1, text: "Hard Work", emoji: "💼" },
        { id: 2, text: "Excuses", emoji: "🙄" },
        { id: 3, text: "Persistence", emoji: "🚀" },
        { id: 4, text: "Distraction", emoji: "📱" },
        { id: 5, text: "Dedication", emoji: "🔥" }
      ],
      endItems: [
        { id: 1, text: "Achievement", emoji: "🏅" },
        { id: 2, text: "Failure", emoji: "💔" },
        { id: 3, text: "Success", emoji: "🏆" },
        { id: 4, text: "Lost Focus", emoji: "😵‍💫" },
        { id: 5, text: "Growth", emoji: "🌱" }
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

  const currentPuzzle = puzzles[round];

  const handleStartClick = (startId) => setSelectedStart(startId);

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
        showCorrectAnswerFeedback(3, true);
        setCoins(prev => prev + 3);
      }

      setShowResult(true);
    }
  };

  const handleNextRound = () => {
    if (round < puzzles.length - 1) {
      setRound(prev => prev + 1);
      setConnections([]);
      setSelectedStart(null);
      setShowResult(false);
    } else {
      navigate("/student/moral-values/teen/late-night-party-story");
    }
  };

  const isConnected = (id, type) =>
    connections.some(c => (type === "start" ? c.start === id : c.end === id));

  return (
    <GameShell
      title="Puzzle of Self-Control"
      subtitle={`Round ${round + 1} of ${puzzles.length}`}
      onNext={handleNextRound}
      nextEnabled={showResult}
      showGameOver={showResult && round === puzzles.length - 1}
      score={coins}
      gameId="moral-teen-34"
      gameType="moral"
      totalLevels={100}
      currentLevel={34}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              Match the actions with their outcomes
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Actions</h4>
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
                <h4 className="text-white font-bold text-center mb-3">Outcomes</h4>
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
            <p className="text-center text-white/70 text-sm mt-4">
              Connections: {connections.length}/{currentPuzzle.correctPairs.length}
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Round {round + 1} Complete! 🎯
            </h2>
            <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
              You earned 3 Coins! 🪙
            </p>
            <button
              onClick={handleNextRound}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {round < puzzles.length - 1 ? "Next Round" : "Finish Puzzle"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfSelfControl;
