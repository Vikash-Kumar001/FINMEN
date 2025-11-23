import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(false);

  const questionData = [
    {
      id: 1,
      messages: [
        { id: 1, text: "Don’t Trust Free Offers!", emoji: "🚫", color: "from-red-500 to-orange-400" },
        { id: 2, text: "Think Before You Click!", emoji: "🧠", color: "from-blue-400 to-purple-400" },
        { id: 3, text: "Stop! Check the Source!", emoji: "🛑", color: "from-yellow-400 to-red-400" },
        { id: 4, text: "Report Fake Links!", emoji: "📢", color: "from-green-400 to-teal-400" },
        { id: 5, text: "Stay Smart Online!", emoji: "💡", color: "from-indigo-400 to-pink-400" },
      ],
      designs: [
        { id: 1, name: "Caution Tape", emoji: "⚠️" },
        { id: 2, name: "Stop Sign", emoji: "🛑" },
        { id: 3, name: "Alert Box", emoji: "📣" },
        { id: 4, name: "Shield Frame", emoji: "🛡️" },
        { id: 5, name: "Bold Banner", emoji: "🎨" },
      ],
    },
    {
      id: 2,
      messages: [
        { id: 1, text: "Pause Before You Share!", emoji: "⏸️", color: "from-blue-400 to-cyan-400" },
        { id: 2, text: "Check Facts, Not Just Feeds!", emoji: "📱", color: "from-purple-400 to-blue-500" },
        { id: 3, text: "Be a Truth Seeker!", emoji: "✨", color: "from-pink-400 to-orange-400" },
        { id: 4, text: "Share Only What’s Real!", emoji: "📡", color: "from-green-400 to-emerald-400" },
        { id: 5, text: "Spot the Fake!", emoji: "🔍", color: "from-yellow-400 to-orange-400" },
      ],
      designs: [
        { id: 1, name: "Verified Tag", emoji: "✅" },
        { id: 2, name: "Media Shield", emoji: "🛡️" },
        { id: 3, name: "Cyber Grid", emoji: "💻" },
        { id: 4, name: "Info Banner", emoji: "📰" },
        { id: 5, name: "Smart Frame", emoji: "💡" },
      ],
    },
    {
      id: 3,
      messages: [
        { id: 1, text: "Think Twice, Post Once!", emoji: "🤔", color: "from-orange-400 to-pink-500" },
        { id: 2, text: "Don’t Spread Rumors!", emoji: "🙊", color: "from-red-400 to-rose-400" },
        { id: 3, text: "Read Before Sharing!", emoji: "📖", color: "from-indigo-400 to-purple-400" },
        { id: 4, text: "Be a Digital Detective!", emoji: "🕵️‍♀️", color: "from-teal-400 to-green-400" },
        { id: 5, text: "Stay Alert, Stay Safe!", emoji: "⚡", color: "from-yellow-400 to-lime-400" },
      ],
      designs: [
        { id: 1, name: "Detective Frame", emoji: "🕵️‍♂️" },
        { id: 2, name: "News Block", emoji: "📰" },
        { id: 3, name: "Smart Card", emoji: "💳" },
        { id: 4, name: "Safety Shield", emoji: "🛡️" },
        { id: 5, name: "Alert Glow", emoji: "💥" },
      ],
    },
    {
      id: 4,
      messages: [
        { id: 1, text: "Use Strong Passwords!", emoji: "🔒", color: "from-purple-400 to-indigo-500" },
        { id: 2, text: "Stay Logged Out on Shared PCs!", emoji: "🖥️", color: "from-blue-400 to-cyan-400" },
        { id: 3, text: "Update Your Apps Regularly!", emoji: "⚙️", color: "from-orange-400 to-yellow-400" },
        { id: 4, text: "Don’t Share OTPs!", emoji: "📲", color: "from-pink-400 to-red-400" },
        { id: 5, text: "Be a Cyber Guardian!", emoji: "🛡️", color: "from-green-400 to-teal-400" },
      ],
      designs: [
        { id: 1, name: "Secure Frame", emoji: "🔐" },
        { id: 2, name: "Lock Banner", emoji: "🔏" },
        { id: 3, name: "Digital Shield", emoji: "🛡️" },
        { id: 4, name: "Cyber Glow", emoji: "💫" },
        { id: 5, name: "Padlock Panel", emoji: "🧱" },
      ],
    },
    {
      id: 5,
      messages: [
        { id: 1, text: "Be Kind Online!", emoji: "🤝", color: "from-pink-400 to-purple-400" },
        { id: 2, text: "Spread Positivity!", emoji: "🌈", color: "from-orange-400 to-yellow-400" },
        { id: 3, text: "Respect Others’ Opinions!", emoji: "🗣️", color: "from-green-400 to-lime-400" },
        { id: 4, text: "Think Before You Type!", emoji: "⌨️", color: "from-blue-400 to-indigo-400" },
        { id: 5, text: "Cyber Respect Matters!", emoji: "💬", color: "from-cyan-400 to-blue-400" },
      ],
      designs: [
        { id: 1, name: "Smile Frame", emoji: "😊" },
        { id: 2, name: "Heart Banner", emoji: "❤️" },
        { id: 3, name: "Kindness Glow", emoji: "✨" },
        { id: 4, name: "Chat Frame", emoji: "💬" },
        { id: 5, name: "Peace Panel", emoji: "✌️" },
      ],
    },
  ];

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);

  const handleMessageSelect = (msgId) => setSelectedMessage(msgId);
  const handleDesignSelect = (designId) => setSelectedDesign(designId);

  const handleCreatePoster = () => {
    if (selectedMessage && selectedDesign) {
      showCorrectAnswerFeedback(5, false);
      const currentQ = questionData[currentQuestion];
      setAnswers((prev) => [
        ...prev,
        {
          question: currentQ.id,
          msg: currentQ.messages.find((m) => m.id === selectedMessage),
          design: currentQ.designs.find((d) => d.id === selectedDesign),
        },
      ]);
      setSelectedMessage(null);
      setSelectedDesign(null);
      if (currentQuestion < 4) {
        setTimeout(() => setCurrentQuestion((prev) => prev + 1), 600);
      } else {
        setBadgeEarned(true);
        setTimeout(() => setShowResult(true), 600);
      }
    }
  };

  const handleNext = () => navigate("/student/dcos/kids/chat-trick-story");

  const q = questionData[currentQuestion];
  const selectedMsg = q.messages.find((m) => m.id === selectedMessage);
  const selectedDsgn = q.designs.find((d) => d.id === selectedDesign);

  return (
    <GameShell
      title="Poster Task"
      subtitle="Create 5 Cyber Safety Posters"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={badgeEarned ? 5 : 0}
      gameId="dcos-kids-47"
      gameType="creative"
      totalLevels={100}
      currentLevel={47}
      showConfetti={showResult}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      {!showResult ? (
        <div className="space-y-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-white text-xl font-bold mb-4">
            {currentQuestion + 1}. Choose a Poster Message
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {q.messages.map((msg) => (
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

          <h3 className="text-white text-xl font-bold mb-4">Choose a Design Style</h3>
          <div className="grid grid-cols-5 gap-3 mb-6">
            {q.designs.map((design) => (
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

          {selectedMessage && selectedDesign && (
            <div className="mb-6">
              <h3 className="text-white text-xl font-bold mb-4">Preview Your Poster</h3>
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
      ) : (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-4">🏅 Great Work!</h2>
          <p className="text-yellow-400 text-2xl font-bold mb-4">
            🎖️ You earned the "Truth Defender" Badge!
          </p>
          <p className="text-white/70 text-sm mb-4">
            You completed all 5 poster tasks and created amazing cyber safety awareness posters!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {answers.map((a) => (
              <div
                key={a.question}
                className={`rounded-xl p-6 bg-gradient-to-br ${a.msg.color} flex flex-col items-center border-4 border-white`}
              >
                <div className="text-5xl mb-2">{a.design.emoji}</div>
                <div className="text-white font-bold text-center mb-2 text-lg">
                  {a.msg.text}
                </div>
                <div className="text-4xl">{a.msg.emoji}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default PosterTask;
