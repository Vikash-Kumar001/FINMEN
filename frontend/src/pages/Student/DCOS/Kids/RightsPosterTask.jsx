import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RightsPosterTask = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // ✅ 5 Poster tasks
  const posterTasks = [
    {
      id: 1,
      title: "Privacy Poster",
      subtitle: "Create a poster about online privacy!",
      messages: [
        { id: 1, text: "Respect Privacy – Always Ask First!", emoji: "🔐", color: "from-blue-400 to-purple-400" },
        { id: 2, text: "Think Before You Share!", emoji: "💭", color: "from-green-400 to-teal-400" },
        { id: 3, text: "Keep Secrets Safe!", emoji: "🤫", color: "from-pink-400 to-red-400" },
      ],
    },
    {
      id: 2,
      title: "Cyber Kindness Poster",
      subtitle: "Design a poster about being kind online!",
      messages: [
        { id: 1, text: "Spread Positivity, Not Hate!", emoji: "💖", color: "from-pink-400 to-purple-400" },
        { id: 2, text: "Kind Words = Strong Community!", emoji: "🌈", color: "from-blue-400 to-indigo-400" },
        { id: 3, text: "Be the Light Online!", emoji: "✨", color: "from-yellow-400 to-orange-400" },
      ],
    },
    {
      id: 3,
      title: "Safe Sharing Poster",
      subtitle: "Remind everyone to share safely online!",
      messages: [
        { id: 1, text: "Think Before Posting!", emoji: "💭", color: "from-green-400 to-lime-400" },
        { id: 2, text: "Private Info Stays Private!", emoji: "🔒", color: "from-blue-400 to-cyan-400" },
        { id: 3, text: "Ask Before You Share!", emoji: "🗣️", color: "from-orange-400 to-red-400" },
      ],
    },
    {
      id: 4,
      title: "Respect Rights Poster",
      subtitle: "Promote digital rights and respect for all!",
      messages: [
        { id: 1, text: "My Data, My Choice!", emoji: "🧠", color: "from-indigo-400 to-purple-400" },
        { id: 2, text: "Respect Everyone’s Privacy!", emoji: "🌐", color: "from-teal-400 to-cyan-400" },
        { id: 3, text: "Equal Access for All!", emoji: "⚖️", color: "from-yellow-400 to-orange-400" },
      ],
    },
    {
      id: 5,
      title: "Awareness Poster",
      subtitle: "Encourage friends to report and stay safe!",
      messages: [
        { id: 1, text: "Report Scams Immediately!", emoji: "🚨", color: "from-red-400 to-rose-400" },
        { id: 2, text: "Tell a Trusted Adult!", emoji: "👨‍👩‍👧", color: "from-green-400 to-emerald-400" },
        { id: 3, text: "Stay Alert Online!", emoji: "👀", color: "from-blue-400 to-indigo-400" },
      ],
    },
  ];

  const designs = [
    { id: 1, name: "Privacy Shield", emoji: "🛡️" },
    { id: 2, name: "Lock Symbol", emoji: "🔒" },
    { id: 3, name: "Safe Circle", emoji: "🌀" },
    { id: 4, name: "Digital Fence", emoji: "🌐" },
    { id: 5, name: "Confidential Tag", emoji: "📜" },
  ];

  const [currentTask, setCurrentTask] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(false);

  const currentPoster = posterTasks[currentTask];
  const selectedMsg = currentPoster.messages.find((m) => m.id === selectedMessage);
  const selectedDsgn = designs.find((d) => d.id === selectedDesign);

  const handleMessageSelect = (msgId) => setSelectedMessage(msgId);
  const handleDesignSelect = (designId) => setSelectedDesign(designId);

  const handleCreatePoster = () => {
    if (selectedMessage && selectedDesign) {
      const newCompleted = [...completedTasks, currentPoster.id];
      setCompletedTasks(newCompleted);
      if (newCompleted.length === posterTasks.length) {
        setBadgeEarned(true);
        showCorrectAnswerFeedback(5, true);
        setTimeout(() => setShowResult(true), 600);
      } else {
        setSelectedMessage(null);
        setSelectedDesign(null);
        setCurrentTask((prev) => prev + 1);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/journal-private-info");
  };

  return (
    <GameShell
      title="Rights Poster Task"
      subtitle="Design 5 Creative Posters about Digital Rights & Privacy"
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      badgeEarned={badgeEarned}
      gameId="dcos-kids-57"
      gameType="creative"
      totalLevels={100}
      currentLevel={57}
      showConfetti={showResult}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-2xl font-bold mb-2">
                Task {currentPoster.id} of {posterTasks.length}: {currentPoster.title}
              </h3>
              <p className="text-white/70 mb-4">{currentPoster.subtitle}</p>

              <h4 className="text-white text-lg font-bold mb-3">1. Choose Message</h4>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {currentPoster.messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => handleMessageSelect(msg.id)}
                    className={`rounded-xl p-4 transition-all bg-gradient-to-br ${msg.color} ${
                      selectedMessage === msg.id ? "ring-4 ring-white" : ""
                    }`}
                  >
                    <div className="text-3xl mb-1">{msg.emoji}</div>
                    <div className="text-white font-bold text-sm">{msg.text}</div>
                  </button>
                ))}
              </div>

              <h4 className="text-white text-lg font-bold mb-3">2. Choose Design</h4>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
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
                  <h4 className="text-white text-lg font-bold mb-3">3. Poster Preview</h4>
                  <div
                    className={`rounded-xl p-8 bg-gradient-to-br ${selectedMsg.color} min-h-[200px] flex flex-col items-center justify-center border-4 border-white`}
                  >
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
                    ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                    : "bg-gray-500/50 cursor-not-allowed"
                }`}
              >
                {currentTask === posterTasks.length - 1 ? "Finish Posters 🎉" : "Create Poster! 🎨"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">🏅 Fantastic Work!</h2>
            <p className="text-yellow-400 text-2xl font-bold mb-4">
              You designed all 5 Digital Rights Posters! 🖼️
            </p>
            <p className="text-white/70 text-sm mb-4">
              Amazing creativity — you earned the <strong>Privacy Respect Champion Badge!</strong>
            </p>
            <p className="text-white/60 text-sm">Keep spreading awareness about online respect and safety!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RightsPosterTask;
