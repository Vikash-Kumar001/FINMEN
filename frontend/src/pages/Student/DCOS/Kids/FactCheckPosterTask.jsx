import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FactCheckPosterTask = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);

  const handleMessageSelect = (msgId) => setSelectedMessage(msgId);
  const handleDesignSelect = (designId) => setSelectedDesign(designId);

  const handleCreatePoster = () => {
    if (selectedMessage && selectedDesign) {
      showCorrectAnswerFeedback(5, false);
      setCoins((prev) => prev + 1);
      setTimeout(() => {
        if (currentStep < 4) {
          setCurrentStep((prev) => prev + 1);
          setSelectedMessage(null);
          setSelectedDesign(null);
        } else {
          setShowResult(true);
        }
      }, 700);
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/journal-of-truth1");
  };

  // 5 poster question sets
  const posterTasks = [
    {
      title: "Create a Poster on 'Fact-Checking Online News'",
      messages: [
        { id: 1, text: "Check Before You Share!", emoji: "🔍", color: "from-blue-500 to-cyan-400" },
        { id: 2, text: "Think Twice, Share Wise!", emoji: "💡", color: "from-yellow-400 to-orange-400" },
        { id: 3, text: "Fake News? Verify First!", emoji: "📰", color: "from-purple-500 to-indigo-400" },
        { id: 4, text: "Pause Before You Post!", emoji: "⏸️", color: "from-green-400 to-emerald-500" },
        { id: 5, text: "Truth Travels, Lies Don’t!", emoji: "🌐", color: "from-pink-500 to-red-400" },
      ],
    },
    {
      title: "Create a Poster on 'Online Kindness & Respect'",
      messages: [
        { id: 1, text: "Spread Kindness, Not Hate!", emoji: "❤️", color: "from-pink-400 to-rose-500" },
        { id: 2, text: "Think Before You Type!", emoji: "💭", color: "from-indigo-400 to-purple-500" },
        { id: 3, text: "Be Respectful Online!", emoji: "🤝", color: "from-blue-400 to-cyan-400" },
        { id: 4, text: "Words Can Heal!", emoji: "🌸", color: "from-green-400 to-teal-500" },
        { id: 5, text: "Choose Peace Over Drama!", emoji: "☮️", color: "from-yellow-400 to-orange-500" },
      ],
    },
    {
      title: "Create a Poster on 'Cyber Safety Awareness'",
      messages: [
        { id: 1, text: "Stay Smart, Stay Safe!", emoji: "🧠", color: "from-blue-500 to-indigo-400" },
        { id: 2, text: "Keep Passwords Private!", emoji: "🔒", color: "from-gray-500 to-slate-400" },
        { id: 3, text: "Think Before You Click!", emoji: "⚠️", color: "from-yellow-400 to-orange-400" },
        { id: 4, text: "Report, Don’t Ignore!", emoji: "📢", color: "from-red-500 to-pink-500" },
        { id: 5, text: "Be Cyber Smart!", emoji: "💻", color: "from-green-400 to-teal-500" },
      ],
    },
    {
      title: "Create a Poster on 'Digital Balance & Screen Time'",
      messages: [
        { id: 1, text: "Unplug to Recharge!", emoji: "🔋", color: "from-green-400 to-lime-400" },
        { id: 2, text: "Life Beyond Screens!", emoji: "🌳", color: "from-teal-400 to-emerald-400" },
        { id: 3, text: "Screen Smart, Live More!", emoji: "📱", color: "from-blue-400 to-purple-400" },
        { id: 4, text: "Take a Digital Detox!", emoji: "🌅", color: "from-orange-400 to-pink-400" },
        { id: 5, text: "Balance Online & Offline!", emoji: "⚖️", color: "from-indigo-400 to-cyan-400" },
      ],
    },
    {
      title: "Create a Poster on 'Privacy Protection Online'",
      messages: [
        { id: 1, text: "Privacy is Power!", emoji: "🔐", color: "from-purple-500 to-pink-400" },
        { id: 2, text: "Think Before You Share Info!", emoji: "🤫", color: "from-blue-500 to-cyan-400" },
        { id: 3, text: "Lock Your Data!", emoji: "🧱", color: "from-red-500 to-orange-400" },
        { id: 4, text: "Protect What Matters!", emoji: "🛡️", color: "from-green-500 to-emerald-400" },
        { id: 5, text: "Guard Your Digital Self!", emoji: "👤", color: "from-yellow-400 to-orange-400" },
      ],
    },
  ];

  // Design options same across all
  const designs = [
    { id: 1, name: "Magnifying Glass", emoji: "🔍" },
    { id: 2, name: "Verified Badge", emoji: "✅" },
    { id: 3, name: "Caution Sign", emoji: "⚠️" },
    { id: 4, name: "News Banner", emoji: "📰" },
    { id: 5, name: "Shield of Truth", emoji: "🛡️" },
  ];

  const currentTask = posterTasks[currentStep];
  const selectedMsg = currentTask.messages.find((m) => m.id === selectedMessage);
  const selectedDsgn = designs.find((d) => d.id === selectedDesign);

  return (
    <GameShell
      title="Fact-Check Poster Series"
      subtitle="Create 5 Creative Digital Posters!"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-37"
      gameType="educational"
      totalLevels={100}
      currentLevel={37}
      showConfetti={showResult}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-4">
                {currentStep + 1}. {currentTask.title}
              </h3>

              {/* Message Selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {currentTask.messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => handleMessageSelect(msg.id)}
                    className={`border-3 rounded-xl p-4 transition-all bg-gradient-to-br ${msg.color} ${
                      selectedMessage === msg.id ? "ring-4 ring-white" : ""
                    }`}
                  >
                    <div className="text-4xl mb-2">{msg.emoji}</div>
                    <div className="text-white font-bold text-sm">
                      {msg.text}
                    </div>
                  </button>
                ))}
              </div>

              {/* Design Selection */}
              <h3 className="text-white text-xl font-bold mb-4">
                Choose Design Style
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
                    <div className="text-white text-xs">{design.name}</div>
                  </button>
                ))}
              </div>

              {/* Poster Preview */}
              {selectedMessage && selectedDesign && (
                <div className="mb-6">
                  <h3 className="text-white text-xl font-bold mb-4">
                    Preview Poster
                  </h3>
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
                {currentStep < 4 ? "Create Poster! 🎨" : "Finish Poster Series! 🏁"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">🌟 Amazing Work!</h2>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              You created 5 posters and earned 5 Coins! 🪙
            </p>
            <p className="text-white/70 text-sm">
              You’ve mastered responsible digital creativity. Keep inspiring others! 💡
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FactCheckPosterTask;
