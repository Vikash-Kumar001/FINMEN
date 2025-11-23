import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterTask2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedPosters, setCompletedPosters] = useState([]);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Create 'Use AI Wisely' Poster",
      messages: [
        { id: 1, text: "Use AI Wisely!", emoji: "🤖", color: "from-purple-400 to-indigo-500" },
        { id: 2, text: "Think Before You Click!", emoji: "🧠", color: "from-blue-400 to-cyan-400" },
        { id: 3, text: "Humans Guide AI!", emoji: "👩‍🏫", color: "from-green-400 to-teal-400" },
        { id: 4, text: "Be Smart, Not Just Smart Bot!", emoji: "⚡", color: "from-pink-400 to-red-400" },
        { id: 5, text: "AI is a Tool, Not a Rule!", emoji: "🛠️", color: "from-yellow-400 to-orange-400" },
      ],
    },
    {
      id: 2,
      title: "Create 'Online Kindness' Poster",
      messages: [
        { id: 1, text: "Spread Positivity!", emoji: "🌈", color: "from-pink-400 to-purple-400" },
        { id: 2, text: "Kind Words Cost Nothing!", emoji: "💬", color: "from-blue-400 to-indigo-500" },
        { id: 3, text: "Be a Digital Friend!", emoji: "🤝", color: "from-green-400 to-teal-400" },
        { id: 4, text: "Pause Before You Post!", emoji: "🧘‍♀️", color: "from-yellow-400 to-orange-400" },
        { id: 5, text: "Make Someone Smile!", emoji: "😊", color: "from-purple-400 to-pink-400" },
      ],
    },
    {
      id: 3,
      title: "Create 'Privacy First' Poster",
      messages: [
        { id: 1, text: "Keep Info Private!", emoji: "🛡️", color: "from-blue-400 to-cyan-400" },
        { id: 2, text: "Passwords are Secrets!", emoji: "🔑", color: "from-green-400 to-emerald-400" },
        { id: 3, text: "Think Before You Share!", emoji: "💭", color: "from-purple-400 to-blue-400" },
        { id: 4, text: "Lock It, Don’t Leak It!", emoji: "🔒", color: "from-red-400 to-pink-400" },
        { id: 5, text: "Privacy = Safety!", emoji: "🧩", color: "from-teal-400 to-blue-500" },
      ],
    },
    {
      id: 4,
      title: "Create 'Digital Balance' Poster",
      messages: [
        { id: 1, text: "Take Screen Breaks!", emoji: "🌿", color: "from-green-400 to-lime-400" },
        { id: 2, text: "Go Outside Daily!", emoji: "☀️", color: "from-yellow-400 to-orange-400" },
        { id: 3, text: "Unplug to Recharge!", emoji: "🔋", color: "from-cyan-400 to-blue-500" },
        { id: 4, text: "Family Time > Screen Time", emoji: "👨‍👩‍👧", color: "from-pink-400 to-purple-400" },
        { id: 5, text: "Tech + Rest = Best!", emoji: "💤", color: "from-purple-400 to-indigo-400" },
      ],
    },
    {
      id: 5,
      title: "Create 'Cyber Smart' Poster",
      messages: [
        { id: 1, text: "Think Before You Click!", emoji: "🧠", color: "from-blue-400 to-cyan-400" },
        { id: 2, text: "Stay Alert Online!", emoji: "⚠️", color: "from-yellow-400 to-orange-400" },
        { id: 3, text: "Report Suspicious Links!", emoji: "🚨", color: "from-red-400 to-pink-400" },
        { id: 4, text: "Be a Smart Netizen!", emoji: "🌐", color: "from-purple-400 to-indigo-400" },
        { id: 5, text: "Cyber Safety = Real Safety!", emoji: "🛡️", color: "from-green-400 to-teal-400" },
      ],
    },
  ];

  const designs = [
    { id: 1, name: "Neon Glow", emoji: "💡" },
    { id: 2, name: "Tech Frame", emoji: "🖼️" },
    { id: 3, name: "Circuit Lines", emoji: "🔌" },
    { id: 4, name: "Brain Wave", emoji: "🧠" },
    { id: 5, name: "Robot Style", emoji: "🤖" },
  ];

  const current = questions[currentIndex];
  const handleMessageSelect = (msgId) => setSelectedMessage(msgId);
  const handleDesignSelect = (designId) => setSelectedDesign(designId);

  const handleCreatePoster = () => {
    if (selectedMessage && selectedDesign) {
      showCorrectAnswerFeedback(5, false);
      setCoins((prev) => prev + 5);
      setTimeout(() => setShowResult(true), 400);
    }
  };

  const handleNextPoster = () => {
    const completed = {
      id: current.id,
      msg: current.messages.find((m) => m.id === selectedMessage),
      design: designs.find((d) => d.id === selectedDesign),
    };
    setCompletedPosters([...completedPosters, completed]);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedMessage(null);
      setSelectedDesign(null);
      setShowResult(false);
    } else {
      navigate("/student/dcos/kids/ai-helper-journal");
    }
  };

  const selectedMsg = current.messages.find((m) => m.id === selectedMessage);
  const selectedDsgn = designs.find((d) => d.id === selectedDesign);

  return (
    <GameShell
      title="Poster Task"
      subtitle={current.title}
      onNext={handleNextPoster}
      nextEnabled={showResult}
      showGameOver={currentIndex === questions.length - 1 && showResult}
      score={coins}
      gameId="dcos-kids-77"
      gameType="creative"
      totalLevels={100}
      currentLevel={77}
      showConfetti={showResult}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-4">
                {currentIndex + 1}. {current.title}
              </h3>

              {/* Message selection */}
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
                    <div className="text-white font-bold text-sm">{msg.text}</div>
                  </button>
                ))}
              </div>

              {/* Design selection */}
              <h3 className="text-white text-xl font-bold mb-4">Choose Design Style</h3>
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
                    <div className="text-white text-xs">{design.name}</div>
                  </button>
                ))}
              </div>

              {/* Poster preview */}
              {selectedMessage && selectedDesign && (
                <div className="mb-6">
                  <h3 className="text-white text-xl font-bold mb-4">Poster Preview</h3>
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

              {/* Create button */}
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">🌟 Poster Complete!</h2>
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
            <p className="text-yellow-400 text-2xl font-bold mb-4">You earned 5 Coins! 🪙</p>
            <p className="text-white/70 text-sm mb-6">
              Great job! Poster {currentIndex + 1} of 5 completed.
            </p>

            {/* ✅ Next Poster Button */}
            <button
              onClick={handleNextPoster}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition"
            >
              {currentIndex < questions.length - 1 ? "Next Poster ➡️" : "Finish Game 🎯"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterTask2;
