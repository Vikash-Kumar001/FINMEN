import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafetyPoster = () => {
  const navigate = useNavigate();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const messages = [
    { id: 1, text: "Don't share your password!", emoji: "🔒", color: "from-red-400 to-pink-400" },
    { id: 2, text: "Stranger Danger Online!", emoji: "⚠️", color: "from-orange-400 to-red-400" },
    { id: 3, text: "Keep Personal Info Private!", emoji: "🛡️", color: "from-blue-400 to-purple-400" },
    { id: 4, text: "Ask Parent Before Clicking!", emoji: "👨‍👩‍👧", color: "from-green-400 to-teal-400" }
  ];

  const designs = [
    { id: 1, name: "Bold Border", emoji: "📢" },
    { id: 2, name: "Stop Sign", emoji: "🛑" },
    { id: 3, name: "Shield", emoji: "🛡️" },
    { id: 4, name: "Warning", emoji: "⚠️" }
  ];

  const handleMessageSelect = (msgId) => {
    setSelectedMessage(msgId);
  };

  const handleDesignSelect = (designId) => {
    setSelectedDesign(designId);
  };

  const handleCreatePoster = () => {
    if (selectedMessage && selectedDesign) {
      showCorrectAnswerFeedback(3, false);
      setCoins(3);
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/family-rules-story");
  };

  const selectedMsg = messages.find(m => m.id === selectedMessage);
  const selectedDsgn = designs.find(d => d.id === selectedDesign);

  return (
    <GameShell
      title="Safety Poster Task"
      subtitle="Create Your Safety Poster"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-6"
      gameType="educational"
      totalLevels={20}
      currentLevel={6}
      showConfetti={showResult}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-4">1. Choose Safety Message</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {messages.map(msg => (
                  <button
                    key={msg.id}
                    onClick={() => handleMessageSelect(msg.id)}
                    className={`border-3 rounded-xl p-4 transition-all bg-gradient-to-br ${msg.color} ${
                      selectedMessage === msg.id ? 'ring-4 ring-white' : ''
                    }`}
                  >
                    <div className="text-4xl mb-2">{msg.emoji}</div>
                    <div className="text-white font-bold text-sm">{msg.text}</div>
                  </button>
                ))}
              </div>

              <h3 className="text-white text-xl font-bold mb-4">2. Choose Design Style</h3>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {designs.map(design => (
                  <button
                    key={design.id}
                    onClick={() => handleDesignSelect(design.id)}
                    className={`border-2 rounded-xl p-3 transition-all ${
                      selectedDesign === design.id
                        ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <div className="text-3xl mb-1">{design.emoji}</div>
                    <div className="text-white text-xs">{design.name}</div>
                  </button>
                ))}
              </div>

              {selectedMessage && selectedDesign && (
                <div className="mb-6">
                  <h3 className="text-white text-xl font-bold mb-4">3. Preview Poster</h3>
                  <div className={`rounded-xl p-8 bg-gradient-to-br ${selectedMsg.color} min-h-[200px] flex flex-col items-center justify-center border-4 border-white`}>
                    <div className="text-6xl mb-4">{selectedDsgn.emoji}</div>
                    <div className="text-white text-2xl font-bold text-center mb-2">{selectedMsg.text}</div>
                    <div className="text-5xl">{selectedMsg.emoji}</div>
                  </div>
                </div>
              )}

              <button
                onClick={handleCreatePoster}
                disabled={!selectedMessage || !selectedDesign}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedMessage && selectedDesign
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Create Poster! 🎨
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">🎉 Great Poster!</h2>
            <div className="mb-6">
              <div className={`rounded-xl p-8 bg-gradient-to-br ${selectedMsg.color} min-h-[200px] flex flex-col items-center justify-center border-4 border-white`}>
                <div className="text-6xl mb-4">{selectedDsgn.emoji}</div>
                <div className="text-white text-2xl font-bold text-center mb-2">{selectedMsg.text}</div>
                <div className="text-5xl">{selectedMsg.emoji}</div>
              </div>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              You earned 3 Coins! 🪙
            </p>
            <p className="text-white/70 text-sm">
              Display this poster at home to remember online safety rules!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SafetyPoster;

