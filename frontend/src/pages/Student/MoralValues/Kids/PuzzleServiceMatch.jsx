import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleServiceMatch = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // 🧩 10 Puzzle Sets (each with 5 pairs)
  const puzzleSets = [
    {
      title: "Service Match",
      start: [
        { id: 1, text: "Volunteer", emoji: "🙋" },
        { id: 2, text: "Doctor", emoji: "🩺" },
        { id: 3, text: "Soldier", emoji: "🪖" },
        { id: 4, text: "Teacher", emoji: "📚" },
        { id: 5, text: "Firefighter", emoji: "🚒" },
      ],
      end: [
        { id: 1, text: "Help", emoji: "🤝" },
        { id: 2, text: "Care", emoji: "❤️" },
        { id: 3, text: "Protect", emoji: "🛡️" },
        { id: 4, text: "Teach", emoji: "👩‍🏫" },
        { id: 5, text: "Rescue", emoji: "🔥" },
      ],
    },
    {
      title: "Community Roles",
      start: [
        { id: 1, text: "Police", emoji: "👮" },
        { id: 2, text: "Nurse", emoji: "👩‍⚕️" },
        { id: 3, text: "Farmer", emoji: "👨‍🌾" },
        { id: 4, text: "Chef", emoji: "👨‍🍳" },
        { id: 5, text: "Artist", emoji: "🎨" },
      ],
      end: [
        { id: 1, text: "Law", emoji: "⚖️" },
        { id: 2, text: "Heal", emoji: "💊" },
        { id: 3, text: "Grow", emoji: "🌾" },
        { id: 4, text: "Cook", emoji: "🍲" },
        { id: 5, text: "Create", emoji: "🖌️" },
      ],
    },
    {
      title: "Environment Helpers",
      start: [
        { id: 1, text: "Gardener", emoji: "🌱" },
        { id: 2, text: "Recycler", emoji: "♻️" },
        { id: 3, text: "Cleaner", emoji: "🧹" },
        { id: 4, text: "Animal Saver", emoji: "🐾" },
        { id: 5, text: "Tree Planter", emoji: "🌳" },
      ],
      end: [
        { id: 1, text: "Plants", emoji: "🌿" },
        { id: 2, text: "Reuse", emoji: "🔄" },
        { id: 3, text: "Neat", emoji: "✨" },
        { id: 4, text: "Rescue", emoji: "🐕" },
        { id: 5, text: "Green", emoji: "🍃" },
      ],
    },
    {
      title: "Kind Acts",
      start: [
        { id: 1, text: "Share", emoji: "🤲" },
        { id: 2, text: "Smile", emoji: "😊" },
        { id: 3, text: "Help", emoji: "🫶" },
        { id: 4, text: "Listen", emoji: "👂" },
        { id: 5, text: "Thank", emoji: "🙏" },
      ],
      end: [
        { id: 1, text: "Food", emoji: "🍎" },
        { id: 2, text: "Friend", emoji: "🧑‍🤝‍🧑" },
        { id: 3, text: "Need", emoji: "❤️" },
        { id: 4, text: "Others", emoji: "🗣️" },
        { id: 5, text: "Help", emoji: "🎁" },
      ],
    },
    {
      title: "Good Habits",
      start: [
        { id: 1, text: "Wake Up", emoji: "⏰" },
        { id: 2, text: "Eat Healthy", emoji: "🥗" },
        { id: 3, text: "Exercise", emoji: "🏃" },
        { id: 4, text: "Study", emoji: "📖" },
        { id: 5, text: "Sleep Early", emoji: "🌙" },
      ],
      end: [
        { id: 1, text: "On Time", emoji: "🕒" },
        { id: 2, text: "Strong", emoji: "💪" },
        { id: 3, text: "Fit", emoji: "🏅" },
        { id: 4, text: "Smart", emoji: "🧠" },
        { id: 5, text: "Fresh", emoji: "🌄" },
      ],
    },
    {
      title: "Respect & Care",
      start: [
        { id: 1, text: "Respect Elders", emoji: "👵" },
        { id: 2, text: "Care for Animals", emoji: "🐶" },
        { id: 3, text: "Help Friends", emoji: "🤝" },
        { id: 4, text: "Obey Parents", emoji: "👨‍👩‍👧" },
        { id: 5, text: "Be Kind", emoji: "💖" },
      ],
      end: [
        { id: 1, text: "Wisdom", emoji: "📜" },
        { id: 2, text: "Love", emoji: "❤️" },
        { id: 3, text: "Trust", emoji: "🤗" },
        { id: 4, text: "Discipline", emoji: "🎓" },
        { id: 5, text: "Peace", emoji: "🕊️" },
      ],
    },
    {
      title: "School Values",
      start: [
        { id: 1, text: "Arrive Early", emoji: "🚌" },
        { id: 2, text: "Complete Homework", emoji: "✏️" },
        { id: 3, text: "Respect Teachers", emoji: "👩‍🏫" },
        { id: 4, text: "Play Fair", emoji: "⚽" },
        { id: 5, text: "Clean Desk", emoji: "🧽" },
      ],
      end: [
        { id: 1, text: "Punctual", emoji: "⏱️" },
        { id: 2, text: "Prepared", emoji: "📚" },
        { id: 3, text: "Polite", emoji: "🙇" },
        { id: 4, text: "Honest", emoji: "🤝" },
        { id: 5, text: "Neat", emoji: "🧴" },
      ],
    },
    {
      title: "Helping at Home",
      start: [
        { id: 1, text: "Wash Dishes", emoji: "🍽️" },
        { id: 2, text: "Fold Clothes", emoji: "👕" },
        { id: 3, text: "Feed Pets", emoji: "🐱" },
        { id: 4, text: "Water Plants", emoji: "💧" },
        { id: 5, text: "Clean Room", emoji: "🧹" },
      ],
      end: [
        { id: 1, text: "Tidy", emoji: "✨" },
        { id: 2, text: "Organized", emoji: "📦" },
        { id: 3, text: "Healthy", emoji: "🥰" },
        { id: 4, text: "Green", emoji: "🌿" },
        { id: 5, text: "Fresh", emoji: "🍃" },
      ],
    },
    {
      title: "Friendship Values",
      start: [
        { id: 1, text: "Listen", emoji: "👂" },
        { id: 2, text: "Support", emoji: "🫶" },
        { id: 3, text: "Celebrate", emoji: "🎉" },
        { id: 4, text: "Forgive", emoji: "🤍" },
        { id: 5, text: "Encourage", emoji: "🌟" },
      ],
      end: [
        { id: 1, text: "Stories", emoji: "📖" },
        { id: 2, text: "Hard Times", emoji: "💪" },
        { id: 3, text: "Success", emoji: "🏆" },
        { id: 4, text: "Mistakes", emoji: "💬" },
        { id: 5, text: "Dreams", emoji: "✨" },
      ],
    },
    {
      title: "World Helpers",
      start: [
        { id: 1, text: "Scientist", emoji: "🔬" },
        { id: 2, text: "Engineer", emoji: "⚙️" },
        { id: 3, text: "Inventor", emoji: "💡" },
        { id: 4, text: "Explorer", emoji: "🧭" },
        { id: 5, text: "Doctor", emoji: "🩺" },
      ],
      end: [
        { id: 1, text: "Discover", emoji: "🌍" },
        { id: 2, text: "Build", emoji: "🏗️" },
        { id: 3, text: "Create", emoji: "🧠" },
        { id: 4, text: "Find", emoji: "🔎" },
        { id: 5, text: "Heal", emoji: "💊" },
      ],
    },
  ];

  const currentPuzzle = puzzleSets[currentSet];

  const handleStartClick = (startId) => setSelectedStart(startId);

  const handleEndClick = (endId) => {
    if (!selectedStart) return;

    if (connections.find((c) => c.start === selectedStart || c.end === endId)) return;

    const newConnections = [...connections, { start: selectedStart, end: endId }];
    setConnections(newConnections);
    setSelectedStart(null);

    if (newConnections.length === 5) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
      setTimeout(() => {
        if (currentSet < puzzleSets.length - 1) {
          setConnections([]);
          setCurrentSet((prev) => prev + 1);
        } else {
          setShowResult(true);
        }
      }, 1000);
    }
  };

  const handleNext = () => navigate("/student/moral-values/kids/school-cleanup-story");

  const isConnected = (id, type) => connections.some((c) => (type === "start" ? c.start === id : c.end === id));

  return (
    <GameShell
      title={`Puzzle ${currentSet + 1}: ${currentPuzzle.title}`}
      subtitle="Connect matching pairs"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="moral-kids-74"
      gameType="educational"
      totalLevels={100}
      currentLevel={74}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              {currentPuzzle.title}: Match all pairs
            </h3>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Left Side</h4>
                {currentPuzzle.start.map((item) => (
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
                <h4 className="text-white font-bold text-center mb-3">Right Side</h4>
                {currentPuzzle.end.map((item) => (
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

            <div className="mt-6 bg-blue-500/20 rounded-lg p-3 text-center text-white/80 text-sm">
              Connections: {connections.length}/5
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">🎉 Amazing Work!</h2>
            <p className="text-white text-center mb-4">
              You completed all 10 matching puzzles! You truly understand service, kindness, and teamwork.
            </p>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              Total Coins Earned: {coins} 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleServiceMatch;
