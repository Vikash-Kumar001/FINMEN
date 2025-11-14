import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BalancePosterTask = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const messages = [
    [
      { id: 1, text: "Balance Study, Play & Rest!", emoji: "⚖️", color: "from-green-400 to-blue-400" },
      { id: 2, text: "Learn Hard, Play Smart, Sleep Well!", emoji: "🌙", color: "from-purple-400 to-indigo-400" },
      { id: 3, text: "A Healthy Mind Needs Balance!", emoji: "🧠", color: "from-orange-400 to-yellow-400" },
      { id: 4, text: "Study + Play + Sleep = Success!", emoji: "🏆", color: "from-pink-400 to-red-400" },
      { id: 5, text: "Time for Books, Games & Dreams!", emoji: "📚", color: "from-cyan-400 to-teal-400" },
    ],
    [
      { id: 1, text: "Play Outside, Stay Bright!", emoji: "🌳", color: "from-lime-400 to-green-400" },
      { id: 2, text: "Outdoor Time = Happy Mind!", emoji: "😄", color: "from-sky-400 to-teal-400" },
      { id: 3, text: "Run, Jump, Laugh, Repeat!", emoji: "🏃‍♀️", color: "from-yellow-400 to-orange-400" },
      { id: 4, text: "Sunshine Boosts Your Brain!", emoji: "☀️", color: "from-orange-300 to-red-300" },
      { id: 5, text: "Nature is the Best Playground!", emoji: "🌿", color: "from-green-400 to-emerald-400" },
    ],
    [
      { id: 1, text: "Eat Smart, Feel Strong!", emoji: "🍎", color: "from-red-400 to-pink-400" },
      { id: 2, text: "Healthy Food = Happy Mood!", emoji: "🥗", color: "from-green-400 to-yellow-400" },
      { id: 3, text: "Choose Fruits Over Fries!", emoji: "🍓", color: "from-orange-400 to-amber-400" },
      { id: 4, text: "Drink Water, Be Cool!", emoji: "💧", color: "from-cyan-400 to-blue-400" },
      { id: 5, text: "Stay Fit, Eat Right!", emoji: "🏋️", color: "from-indigo-400 to-purple-400" },
    ],
    [
      { id: 1, text: "Be Kind, Shine Bright!", emoji: "💖", color: "from-pink-400 to-rose-400" },
      { id: 2, text: "Kindness is Cool!", emoji: "🕊️", color: "from-blue-400 to-teal-400" },
      { id: 3, text: "Help Others, Feel Better!", emoji: "🤝", color: "from-yellow-400 to-orange-400" },
      { id: 4, text: "Small Acts = Big Impact!", emoji: "🌟", color: "from-purple-400 to-violet-400" },
      { id: 5, text: "Kind Hearts Win Always!", emoji: "❤️", color: "from-red-400 to-amber-400" },
    ],
    [
      { id: 1, text: "Sleep Early, Rise Fresh!", emoji: "🛌", color: "from-indigo-400 to-blue-400" },
      { id: 2, text: "Dream Big, Rest Well!", emoji: "🌙", color: "from-purple-400 to-pink-400" },
      { id: 3, text: "Good Sleep = Good Day!", emoji: "☀️", color: "from-yellow-400 to-orange-400" },
      { id: 4, text: "Recharge Your Brain Tonight!", emoji: "🔋", color: "from-green-400 to-cyan-400" },
      { id: 5, text: "Rest More, Stress Less!", emoji: "😴", color: "from-sky-400 to-teal-400" },
    ],
  ];

  const designs = [
    { id: 1, name: "Balance Scale", emoji: "⚖️" },
    { id: 2, name: "Clock Circle", emoji: "⏰" },
    { id: 3, name: "Smiling Sun", emoji: "🌞" },
    { id: 4, name: "Peace Symbol", emoji: "☮️" },
  ];

  const handleMessageSelect = (msgId) => setSelectedMessage(msgId);
  const handleDesignSelect = (designId) => setSelectedDesign(designId);

  const handleCreatePoster = () => {
    if (selectedMessage && selectedDesign) {
      showCorrectAnswerFeedback(0, false);
      setTimeout(() => {
        if (currentQuestion < 4) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedMessage(null);
          setSelectedDesign(null);
        } else {
          setShowResult(true);
          setBadgeEarned(true);
        }
      }, 600);
    }
  };

  const handleNext = () => navigate("/student/dcos/kids/outdoor-fun-story");

  const selectedMsg = messages[currentQuestion].find((m) => m.id === selectedMessage);
  const selectedDsgn = designs.find((d) => d.id === selectedDesign);

  return (
    <GameShell
      title="Balance Poster Task"
      subtitle={`Create Poster ${currentQuestion + 1} of 5`}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      gameId="dcos-kids-26"
      gameType="creative"
      totalLevels={100}
      currentLevel={26}
      showConfetti={showResult}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-4">
              {currentQuestion + 1}. Choose Poster Message
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {messages[currentQuestion].map((msg) => (
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

            <h3 className="text-white text-xl font-bold mb-4">Choose Design Style</h3>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {designs.map((design) => (
                <button
                  key={design.id}
                  onClick={() => handleDesignSelect(design.id)}
                  className={`border-2 rounded-xl p-3 transition-all ${
                    selectedDesign === design.id
                      ? "bg-blue-500/50 border-blue-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-3xl mb-1">{design.emoji}</div>
                  <div className="text-white text-xs">{design.name}</div>
                </button>
              ))}
            </div>

            {selectedMessage && selectedDesign && (
              <div className="mb-6">
                <h3 className="text-white text-xl font-bold mb-4">Preview Poster</h3>
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
              {currentQuestion < 4 ? "Next Poster 🎨" : "Finish Posters 🏁"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">🌟 Amazing Work!</h2>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              🏅 You earned the Balance Creator Badge!
            </p>
            <p className="text-white/70 text-sm">
              You created 5 wonderful balance posters showing study, play, kindness, food, and rest!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BalancePosterTask;
