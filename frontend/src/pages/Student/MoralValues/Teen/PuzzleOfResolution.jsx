import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfResolution = () => {
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
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // 🧩 Define multiple puzzles (each with different sets)
  const puzzles = [
    {
      id: 1,
      title: "Conflict Resolution",
      startItems: [
        { id: 1, text: "Talk", emoji: "💬" },
        { id: 2, text: "Violence", emoji: "⚔️" },
        { id: 3, text: "Listen", emoji: "👂" },
        { id: 4, text: "Blame", emoji: "😠" },
        { id: 5, text: "Forgive", emoji: "🤝" }
      ],
      endItems: [
        { id: 1, text: "Solution", emoji: "🌈" },
        { id: 2, text: "Problem", emoji: "💢" },
        { id: 3, text: "Peace", emoji: "🕊️" },
        { id: 4, text: "Conflict", emoji: "🔥" },
        { id: 5, text: "Healing", emoji: "💖" }
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 }
      ],
    },
    {
      id: 2,
      title: "Teamwork Connections",
      startItems: [
        { id: 1, text: "Help", emoji: "🤝" },
        { id: 2, text: "Ignore", emoji: "🙈" },
        { id: 3, text: "Share", emoji: "📤" },
        { id: 4, text: "Respect", emoji: "🙏" },
        { id: 5, text: "Argue", emoji: "⚡" },
      ],
      endItems: [
        { id: 1, text: "Success", emoji: "🏆" },
        { id: 2, text: "Failure", emoji: "❌" },
        { id: 3, text: "Bond", emoji: "💞" },
        { id: 4, text: "Harmony", emoji: "🎶" },
        { id: 5, text: "Disunity", emoji: "💔" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 },
      ],
    },
    {
      id: 3,
      title: "Kindness Actions",
      startItems: [
        { id: 1, text: "Help Elderly", emoji: "👵" },
        { id: 2, text: "Donate", emoji: "🎁" },
        { id: 3, text: "Smile", emoji: "😊" },
        { id: 4, text: "Tease", emoji: "😜" },
        { id: 5, text: "Encourage", emoji: "💬" },
      ],
      endItems: [
        { id: 1, text: "Joy", emoji: "🌞" },
        { id: 2, text: "Support", emoji: "💪" },
        { id: 3, text: "Gratitude", emoji: "🙏" },
        { id: 4, text: "Hurt", emoji: "💔" },
        { id: 5, text: "Hope", emoji: "🌱" },
      ],
      correctPairs: [
        { start: 1, end: 3 },
        { start: 2, end: 1 },
        { start: 3, end: 2 },
        { start: 4, end: 4 },
        { start: 5, end: 5 },
      ],
    },
    {
      id: 4,
      title: "Digital Responsibility",
      startItems: [
        { id: 1, text: "Report Abuse", emoji: "🚨" },
        { id: 2, text: "Cyberbully", emoji: "💻😡" },
        { id: 3, text: "Verify Facts", emoji: "🔍" },
        { id: 4, text: "Share Rumors", emoji: "📱🌀" },
        { id: 5, text: "Support Victims", emoji: "💞" },
      ],
      endItems: [
        { id: 1, text: "Safe Internet", emoji: "🛡️" },
        { id: 2, text: "Harm", emoji: "💢" },
        { id: 3, text: "Truth", emoji: "✅" },
        { id: 4, text: "Misinformation", emoji: "❌" },
        { id: 5, text: "Empathy", emoji: "💖" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 },
      ],
    },
    {
      id: 5,
      title: "Honesty Choices",
      startItems: [
        { id: 1, text: "Tell Truth", emoji: "🗣️" },
        { id: 2, text: "Lie", emoji: "🤥" },
        { id: 3, text: "Admit Mistake", emoji: "🙏" },
        { id: 4, text: "Cheat", emoji: "🃏" },
        { id: 5, text: "Apologize", emoji: "💧" },
      ],
      endItems: [
        { id: 1, text: "Trust", emoji: "🤝" },
        { id: 2, text: "Doubt", emoji: "❓" },
        { id: 3, text: "Respect", emoji: "🌟" },
        { id: 4, text: "Guilt", emoji: "😞" },
        { id: 5, text: "Forgiveness", emoji: "💗" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 },
      ],
    },
    {
      id: 6,
      title: "Eco Responsibility",
      startItems: [
        { id: 1, text: "Plant Trees", emoji: "🌳" },
        { id: 2, text: "Waste Water", emoji: "🚿💦" },
        { id: 3, text: "Recycle", emoji: "♻️" },
        { id: 4, text: "Pollute", emoji: "🏭" },
        { id: 5, text: "Save Energy", emoji: "💡" },
      ],
      endItems: [
        { id: 1, text: "Fresh Air", emoji: "🌤️" },
        { id: 2, text: "Shortage", emoji: "🚱" },
        { id: 3, text: "Clean Earth", emoji: "🌍" },
        { id: 4, text: "Damage", emoji: "💥" },
        { id: 5, text: "Sustainability", emoji: "🌱" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 },
      ],
    },
  ];

  const puzzle = puzzles[currentPuzzle];

  const handleStartClick = (id) => setSelectedStart(id);

  const handleEndClick = (endId) => {
    if (!selectedStart) return;

    if (connections.find(c => c.start === selectedStart || c.end === endId)) return;

    const newConnections = [...connections, { start: selectedStart, end: endId }];
    setConnections(newConnections);
    setSelectedStart(null);

    if (newConnections.length === 5) {
      const allCorrect = newConnections.every(conn =>
        puzzle.correctPairs.some(pair => pair.start === conn.start && pair.end === conn.end)
      );

      if (allCorrect) {
        showCorrectAnswerFeedback(5, true);
        setCoins(prev => prev + 5);
      }

      if (currentPuzzle < puzzles.length - 1) {
        setTimeout(() => {
          setConnections([]);
          setCurrentPuzzle(prev => prev + 1);
        }, 1200);
      } else {
        setShowResult(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/friend-group-story");
  };

  return (
    <GameShell
      title="Puzzle of Resolution"
      subtitle={puzzle.title}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-teen-84"
      gameType="moral"
      totalLevels={100}
      currentLevel={84}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      {!showResult ? (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
          <h3 className="text-white text-xl font-bold mb-4 text-center">
            Match actions to correct outcomes ({currentPuzzle + 1}/6)
          </h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-white font-bold text-center mb-3">Actions</h4>
              {puzzle.startItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleStartClick(item.id)}
                  disabled={connections.some(c => c.start === item.id)}
                  className={`w-full border-2 rounded-xl p-6 transition-all ${
                    connections.some(c => c.start === item.id)
                      ? "bg-green-500/30 border-green-400"
                      : selectedStart === item.id
                      ? "bg-blue-500/50 border-blue-300 ring-2 ring-white"
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
              {puzzle.endItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleEndClick(item.id)}
                  disabled={connections.some(c => c.end === item.id)}
                  className={`w-full border-2 rounded-xl p-6 transition-all ${
                    connections.some(c => c.end === item.id)
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

          <div className="mt-6 bg-blue-500/20 rounded-lg p-3 text-center text-white/80 text-sm">
            Connections: {connections.length}/5
          </div>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            🌈 All Puzzles Solved!
          </h2>
          <p className="text-white text-center mb-6">
            Amazing! You connected all the right values — peace, honesty, kindness, teamwork, and responsibility!
          </p>
          <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
            You earned {coins} Coins! 🪙
          </p>
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 py-3 rounded-xl text-white font-bold hover:opacity-90 transition"
          >
            Continue
          </button>
        </div>
      )}
    </GameShell>
  );
};

export default PuzzleOfResolution;
