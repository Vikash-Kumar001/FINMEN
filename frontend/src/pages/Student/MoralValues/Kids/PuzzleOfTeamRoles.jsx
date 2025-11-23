import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfTeamRoles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [connections, setConnections] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 🧩 All 5 puzzles data
  const puzzles = [
    {
      id: 1,
      title: "Team Roles (Football)",
      startItems: [
        { id: 1, text: "Goalkeeper", emoji: "🧤" },
        { id: 2, text: "Captain", emoji: "🎖️" },
        { id: 3, text: "Player", emoji: "⚽" },
        { id: 4, text: "Coach", emoji: "📋" },
        { id: 5, text: "Supporter", emoji: "📣" },
      ],
      endItems: [
        { id: 1, text: "Saves", emoji: "🛡️" },
        { id: 2, text: "Leads", emoji: "🏆" },
        { id: 3, text: "Supports", emoji: "🤝" },
        { id: 4, text: "Guides", emoji: "📌" },
        { id: 5, text: "Cheers", emoji: "🎉" },
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
      id: 2,
      title: "School Team",
      startItems: [
        { id: 1, text: "Teacher", emoji: "👩‍🏫" },
        { id: 2, text: "Student", emoji: "🎒" },
        { id: 3, text: "Principal", emoji: "🏫" },
        { id: 4, text: "Janitor", emoji: "🧹" },
        { id: 5, text: "Parent", emoji: "👨‍👩‍👧" },
      ],
      endItems: [
        { id: 1, text: "Teaches", emoji: "📘" },
        { id: 2, text: "Learns", emoji: "🧠" },
        { id: 3, text: "Leads School", emoji: "📢" },
        { id: 4, text: "Cleans", emoji: "🧼" },
        { id: 5, text: "Encourages", emoji: "💬" },
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
      title: "Hospital Team",
      startItems: [
        { id: 1, text: "Doctor", emoji: "👩‍⚕️" },
        { id: 2, text: "Nurse", emoji: "💉" },
        { id: 3, text: "Patient", emoji: "🧍‍♂️" },
        { id: 4, text: "Receptionist", emoji: "🖋️" },
        { id: 5, text: "Pharmacist", emoji: "💊" },
      ],
      endItems: [
        { id: 1, text: "Treats", emoji: "❤️‍🩹" },
        { id: 2, text: "Assists", emoji: "🤝" },
        { id: 3, text: "Follows Advice", emoji: "📋" },
        { id: 4, text: "Registers", emoji: "📝" },
        { id: 5, text: "Provides Medicine", emoji: "🏥" },
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
      id: 4,
      title: "Movie Crew",
      startItems: [
        { id: 1, text: "Director", emoji: "🎬" },
        { id: 2, text: "Actor", emoji: "🎭" },
        { id: 3, text: "Camera Operator", emoji: "📸" },
        { id: 4, text: "Editor", emoji: "💻" },
        { id: 5, text: "Producer", emoji: "💼" },
      ],
      endItems: [
        { id: 1, text: "Guides Film", emoji: "📽️" },
        { id: 2, text: "Performs", emoji: "🎤" },
        { id: 3, text: "Records", emoji: "🎥" },
        { id: 4, text: "Cuts & Polishes", emoji: "✂️" },
        { id: 5, text: "Funds", emoji: "💰" },
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
      title: "Community Helpers",
      startItems: [
        { id: 1, text: "Police", emoji: "👮" },
        { id: 2, text: "Firefighter", emoji: "🚒" },
        { id: 3, text: "Postman", emoji: "📬" },
        { id: 4, text: "Doctor", emoji: "🏥" },
        { id: 5, text: "Farmer", emoji: "🌾" },
      ],
      endItems: [
        { id: 1, text: "Protects", emoji: "🛡️" },
        { id: 2, text: "Saves", emoji: "🔥" },
        { id: 3, text: "Delivers Mail", emoji: "✉️" },
        { id: 4, text: "Heals", emoji: "❤️" },
        { id: 5, text: "Grows Food", emoji: "🥦" },
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

  const currentData = puzzles[currentPuzzle];

  const handleStartClick = (startId) => {
    setSelectedStart(startId);
  };

  const handleEndClick = (endId) => {
    if (!selectedStart) return;
    if (connections.find(c => c.start === selectedStart || c.end === endId)) return;

    const newConnections = [...connections, { start: selectedStart, end: endId }];
    setConnections(newConnections);
    setSelectedStart(null);

    if (newConnections.length === 5) {
      const allCorrect = newConnections.every(conn =>
        currentData.correctPairs.some(pair => pair.start === conn.start && pair.end === conn.end)
      );

      setShowResult(true);

      if (allCorrect) {
        showCorrectAnswerFeedback(5, true);
        setCoins(prev => prev + 5);
        // Auto-next after 2s
        setTimeout(() => {
          if (currentPuzzle < puzzles.length - 1) {
            setCurrentPuzzle(prev => prev + 1);
            setConnections([]);
            setShowResult(false);
            resetFeedback();
          } else {
            navigate("/student/moral-values/kids/classroom-story1");
          }
        }, 2000);
      }
    }
  };

  const handleTryAgain = () => {
    setConnections([]);
    setSelectedStart(null);
    setShowResult(false);
  };

  const isConnected = (id, type) =>
    connections.some(c => (type === "start" ? c.start === id : c.end === id));

  return (
    <GameShell
      title={`Puzzle of Team Roles (${currentData.title})`}
      subtitle={`Match roles to actions – Puzzle ${currentPuzzle + 1}/5`}
      score={coins}
      gameId="moral-kids-64"
      gameType="educational"
      totalLevels={100}
      currentLevel={64 + currentPuzzle}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              {currentData.title}
            </h3>
            <p className="text-white/70 text-sm mb-6 text-center">
              Click a role, then click its matching action
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Roles</h4>
                {currentData.startItems.map(item => (
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
                <h4 className="text-white font-bold text-center mb-3">Actions</h4>
                {currentData.endItems.map(item => (
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
                Connections: {connections.length}/5
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              🎉 Great Job!
            </h2>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              +5 Coins Earned! 🪙
            </p>
            <p className="text-white/80">
              You’ve completed {currentPuzzle + 1} of 5 puzzles!
            </p>
            <p className="text-white/60 text-sm mt-2">
              {currentPuzzle + 1 < puzzles.length
                ? "Next puzzle loading..."
                : "All puzzles completed!"}
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfTeamRoles;
