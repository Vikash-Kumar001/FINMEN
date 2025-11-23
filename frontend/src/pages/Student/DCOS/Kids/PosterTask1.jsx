import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterTask1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentTask, setCurrentTask] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // 🎨 Each task is a different poster challenge
  const posterTasks = [
    {
      id: 1,
      title: "Think Before You Post!",
      messages: [
        { id: 1, text: "Think Before You Post!", emoji: "💭", color: "from-purple-400 to-pink-400" },
        { id: 2, text: "Would You Say It Face to Face?", emoji: "🗣️", color: "from-blue-400 to-cyan-400" },
        { id: 3, text: "Pause. Reflect. Post!", emoji: "⏸️", color: "from-orange-400 to-yellow-400" },
      ],
    },
    {
      id: 2,
      title: "Spread Positivity Online!",
      messages: [
        { id: 1, text: "Kind Words Cost Nothing 💬", emoji: "💖", color: "from-pink-400 to-red-400" },
        { id: 2, text: "Be a Digital Helper!", emoji: "🦸‍♀️", color: "from-blue-400 to-indigo-400" },
        { id: 3, text: "Lift Others, Don’t Bring Them Down", emoji: "🤝", color: "from-green-400 to-teal-400" },
      ],
    },
    {
      id: 3,
      title: "Respect Privacy!",
      messages: [
        { id: 1, text: "Ask Before You Share!", emoji: "📸", color: "from-yellow-400 to-orange-400" },
        { id: 2, text: "Private = Personal 🔒", emoji: "🔒", color: "from-purple-400 to-blue-400" },
        { id: 3, text: "Your Friends’ Info Isn’t Yours to Post", emoji: "👫", color: "from-teal-400 to-green-400" },
      ],
    },
    {
      id: 4,
      title: "Cyber Safety Poster",
      messages: [
        { id: 1, text: "Stay Smart. Stay Safe Online!", emoji: "🛡️", color: "from-indigo-400 to-blue-500" },
        { id: 2, text: "Think Before You Click!", emoji: "🖱️", color: "from-orange-400 to-red-400" },
        { id: 3, text: "Don’t Share Passwords!", emoji: "🔑", color: "from-green-400 to-emerald-400" },
      ],
    },
    {
      id: 5,
      title: "Digital Citizenship Poster",
      messages: [
        { id: 1, text: "Be a Responsible Digital Citizen!", emoji: "🌍", color: "from-blue-400 to-cyan-400" },
        { id: 2, text: "Online Respect = Real Respect", emoji: "🤗", color: "from-pink-400 to-red-400" },
        { id: 3, text: "Think Smart. Post Smart!", emoji: "🧠", color: "from-purple-400 to-indigo-400" },
      ],
    },
  ];

  const designs = [
    { id: 1, name: "Light Bulb Idea", emoji: "💡" },
    { id: 2, name: "Chat Bubble", emoji: "💬" },
    { id: 3, name: "Globe Design", emoji: "🌍" },
    { id: 4, name: "Camera Frame", emoji: "📸" },
    { id: 5, name: "Heart Frame", emoji: "❤️" },
  ];

  const current = posterTasks[currentTask];

  const handleMessageSelect = (msgId) => setSelectedMessage(msgId);
  const handleDesignSelect = (designId) => setSelectedDesign(designId);

  const handleCreatePoster = () => {
    if (selectedMessage && selectedDesign) {
      showCorrectAnswerFeedback(5, false);
      setCoins((prev) => prev + 5);
      setTimeout(() => setShowResult(true), 500);
    }
  };

  const handleNext = () => {
    if (currentTask < posterTasks.length - 1) {
      setCurrentTask(currentTask + 1);
      setSelectedMessage(null);
      setSelectedDesign(null);
      setShowResult(false);
    } else {
      navigate("/student/dcos/kids/journal-of-posts");
    }
  };

  const selectedMsg = current.messages.find((m) => m.id === selectedMessage);
  const selectedDsgn = designs.find((d) => d.id === selectedDesign);

  return (
    <GameShell
      title={`Poster Task ${currentTask + 1}`}
      subtitle={current.title}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={currentTask === posterTasks.length - 1 && showResult}
      score={coins}
      gameId="dcos-kids-67"
      gameType="creative"
      totalLevels={100}
      currentLevel={67}
      showConfetti={showResult}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-4">
                1️⃣ Choose Your Poster Message
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {current.messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => handleMessageSelect(msg.id)}
                    className={`border-3 rounded-xl p-4 transition-all bg-gradient-to-br ${msg.color} ${
                      selectedMessage === msg.id ? "ring-4 ring-white" : ""
                    }`}
                  >
                    <div className="text-4xl mb-2">{msg.emoji}</div>
                    <div className="text-white font-bold text-sm text-center">{msg.text}</div>
                  </button>
                ))}
              </div>

              <h3 className="text-white text-xl font-bold mb-4">
                2️⃣ Choose Poster Design
              </h3>
              <div className="grid grid-cols-5 gap-3 mb-6">
                {designs.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => handleDesignSelect(design.id)}
                    className={`border-2 rounded-xl p-3 transition-all ${
                      selectedDesign === design.id
                        ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                        : "bg-white/20 border-white/40 hover:bg-white/30"
                    }`}
                  >
                    <div className="text-3xl mb-1">{design.emoji}</div>
                    <div className="text-white text-xs text-center">{design.name}</div>
                  </button>
                ))}
              </div>

              {selectedMessage && selectedDesign && (
                <div className="mb-6">
                  <h3 className="text-white text-xl font-bold mb-4">3️⃣ Preview Poster</h3>
                  <div
                    className={`rounded-xl p-8 bg-gradient-to-br ${selectedMsg.color} min-h-[200px] flex flex-col items-center justify-center border-4 border-white`}
                  >
                    <div className="text-6xl mb-4">{selectedDsgn.emoji}</div>
                    <div className="text-white text-2xl font-bold text-center mb-2">
                      {selectedMsg.text}
                    </div>
                    <div className="text-5xl">{selectedMsg.emoji}</div>
                  </div>
                </div>
              )}

              <button
                onClick={handleCreatePoster}
                disabled={!selectedMessage || !selectedDesign}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedMessage && selectedDesign
                    ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                    : "bg-gray-500/50 cursor-not-allowed"
                }`}
              >
                Create Poster! 🎨
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">🌟 Awesome Poster!</h2>
            <div className="mb-6">
              <div
                className={`rounded-xl p-8 bg-gradient-to-br ${selectedMsg.color} min-h-[200px] flex flex-col items-center justify-center border-4 border-white`}
              >
                <div className="text-6xl mb-4">{selectedDsgn.emoji}</div>
                <div className="text-white text-2xl font-bold text-center mb-2">
                  {selectedMsg.text}
                </div>
                <div className="text-5xl">{selectedMsg.emoji}</div>
              </div>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-4 text-center">
              +5 Coins Earned! 🪙
            </p>
            <p className="text-white/70 text-sm text-center mb-6">
              Great job! Your creative poster inspires safe and kind online behavior.
            </p>
            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentTask < posterTasks.length - 1 ? "Next Poster →" : "Finish 🏁"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterTask1;
