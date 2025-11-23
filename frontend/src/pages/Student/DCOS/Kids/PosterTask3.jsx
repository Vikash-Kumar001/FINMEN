import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterTask3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Words Can Hurt or Heal 💬",
      subtitle: "Create a poster promoting kind words!",
    },
    {
      id: 2,
      title: "Respect Everyone 🌍",
      subtitle: "Make a poster encouraging respect for all cultures.",
    },
    {
      id: 3,
      title: "Online Kindness 💻",
      subtitle: "Design a poster about being kind online.",
    },
    {
      id: 4,
      title: "Think Before You Post 💭",
      subtitle: "Create a poster reminding others to post wisely.",
    },
    {
      id: 5,
      title: "Help Others Shine ✨",
      subtitle: "Design a poster encouraging teamwork and positivity.",
    },
  ];

  const messages = [
    { id: 1, text: "Words Can Hurt or Heal 💬", emoji: "❤️", color: "from-pink-400 to-red-400" },
    { id: 2, text: "Kind Words Build Bridges 🌉", emoji: "🤝", color: "from-green-400 to-teal-400" },
    { id: 3, text: "Speak Respect, Not Regret 🗣️", emoji: "🌟", color: "from-blue-400 to-purple-400" },
    { id: 4, text: "Encourage, Don’t Mock 🌻", emoji: "😊", color: "from-yellow-400 to-orange-400" },
    { id: 5, text: "Your Words Matter 💌", emoji: "💫", color: "from-purple-400 to-pink-400" },
  ];

  const designs = [
    { id: 1, name: "Speech Bubble", emoji: "💭" },
    { id: 2, name: "Heart Frame", emoji: "💖" },
    { id: 3, name: "Rainbow Text", emoji: "🌈" },
    { id: 4, name: "Quote Box", emoji: "🗯️" },
    { id: 5, name: "Peace Banner", emoji: "🕊️" },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);

  const handleMessageSelect = (msgId) => {
    setSelectedMessage(msgId);
  };

  const handleDesignSelect = (designId) => {
    setSelectedDesign(designId);
  };

  const handleCreatePoster = () => {
    if (selectedMessage && selectedDesign) {
      showCorrectAnswerFeedback(1, true);

      const next = currentQuestion + 1;
      const updated = [...completed, currentQuestion];

      if (next < questions.length) {
        setTimeout(() => {
          setCompleted(updated);
          setCurrentQuestion(next);
          setSelectedMessage(null);
          setSelectedDesign(null);
        }, 800);
      } else {
        setTimeout(() => {
          setEarnedBadge(true);
          setShowResult(true);
        }, 800);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/story-of-difference");
  };

  const selectedMsg = messages.find((m) => m.id === selectedMessage);
  const selectedDsgn = designs.find((d) => d.id === selectedDesign);
  const q = questions[currentQuestion];

  return (
    <GameShell
      title="Poster Task"
      subtitle="Words Can Hurt or Heal"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={earnedBadge ? 1 : 0}
      gameId="dcos-kids-86"
      gameType="creative"
      totalLevels={100}
      currentLevel={86}
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
              <h3 className="text-white text-2xl font-bold mb-2 text-center">
                Poster {currentQuestion + 1} of {questions.length}
              </h3>
              <p className="text-white/80 text-center mb-6">{q.subtitle}</p>

              <h3 className="text-white text-xl font-bold mb-4">1. Choose Poster Message</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {messages.map((msg) => (
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

              <h3 className="text-white text-xl font-bold mb-4">2. Choose Poster Design</h3>
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

              {selectedMessage && selectedDesign && (
                <div className="mb-6">
                  <h3 className="text-white text-xl font-bold mb-4">3. Preview Poster</h3>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">🌟 Wonderful Posters!</h2>

            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center">
              <div className="text-5xl mb-2">🏅</div>
              <p className="text-white text-2xl font-bold">Kindness Poster Badge!</p>
            </div>

            <p className="text-white/70 text-sm mt-4">
              You completed all 5 kindness posters spreading positivity and empathy. Well done!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterTask3;
