import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzlePeaceMatch = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // ✅ 5 Matching Questions
  const questions = [
    {
      id: 1,
      title: "Connect actions to peaceful outcomes 🌸",
      startItems: [
        { id: 1, text: "Smile", emoji: "😊" },
        { id: 2, text: "Angry Face", emoji: "😠" },
        { id: 3, text: "Help Others", emoji: "🤝" },
        { id: 4, text: "Shout", emoji: "📢" },
        { id: 5, text: "Share Toys", emoji: "🧸" },
      ],
      endItems: [
        { id: 1, text: "Friendship", emoji: "💞" },
        { id: 2, text: "Fight", emoji: "⚔️" },
        { id: 3, text: "Peace", emoji: "☮️" },
        { id: 4, text: "Noise", emoji: "🔊" },
        { id: 5, text: "Happiness", emoji: "🌈" },
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
      title: "Match kindness acts with their results 💖",
      startItems: [
        { id: 1, text: "Share lunch", emoji: "🍱" },
        { id: 2, text: "Say sorry", emoji: "🙏" },
        { id: 3, text: "Help elder cross road", emoji: "🚶‍♀️" },
        { id: 4, text: "Push others", emoji: "🧍‍♂️💢" },
        { id: 5, text: "Say thank you", emoji: "😊" },
      ],
      endItems: [
        { id: 1, text: "Gratitude", emoji: "💐" },
        { id: 2, text: "Kindness", emoji: "🌸" },
        { id: 3, text: "Respect", emoji: "🤲" },
        { id: 4, text: "Anger", emoji: "😤" },
        { id: 5, text: "Happiness", emoji: "😄" },
      ],
      correctPairs: [
        { start: 1, end: 5 },
        { start: 2, end: 1 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 2 },
      ],
    },
    {
      id: 3,
      title: "Match classroom manners 🏫",
      startItems: [
        { id: 1, text: "Listen quietly", emoji: "👂" },
        { id: 2, text: "Talk loudly", emoji: "📢" },
        { id: 3, text: "Raise hand", emoji: "✋" },
        { id: 4, text: "Help friend", emoji: "🤝" },
        { id: 5, text: "Throw paper", emoji: "🗑️" },
      ],
      endItems: [
        { id: 1, text: "Discipline", emoji: "🎓" },
        { id: 2, text: "Respect", emoji: "🤲" },
        { id: 3, text: "Disturbance", emoji: "😡" },
        { id: 4, text: "Cleanliness", emoji: "🧹" },
        { id: 5, text: "Teamwork", emoji: "🤗" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 3 },
        { start: 3, end: 2 },
        { start: 4, end: 5 },
        { start: 5, end: 4 },
      ],
    },
    {
      id: 4,
      title: "Match nature care actions 🌿",
      startItems: [
        { id: 1, text: "Plant trees", emoji: "🌳" },
        { id: 2, text: "Throw plastic", emoji: "🛍️" },
        { id: 3, text: "Save water", emoji: "💧" },
        { id: 4, text: "Feed birds", emoji: "🕊️" },
        { id: 5, text: "Pollute air", emoji: "🚗💨" },
      ],
      endItems: [
        { id: 1, text: "Clean Earth", emoji: "🌎" },
        { id: 2, text: "Pollution", emoji: "🌫️" },
        { id: 3, text: "Happy Animals", emoji: "🐦" },
        { id: 4, text: "Green Planet", emoji: "🌲" },
        { id: 5, text: "Water Saved", emoji: "💧" },
      ],
      correctPairs: [
        { start: 1, end: 4 },
        { start: 2, end: 2 },
        { start: 3, end: 5 },
        { start: 4, end: 3 },
        { start: 5, end: 2 },
      ],
    },
    {
      id: 5,
      title: "Match friendship behaviors 💞",
      startItems: [
        { id: 1, text: "Help friend", emoji: "🤝" },
        { id: 2, text: "Share food", emoji: "🍎" },
        { id: 3, text: "Ignore friend", emoji: "🙄" },
        { id: 4, text: "Say sorry", emoji: "🙏" },
        { id: 5, text: "Be rude", emoji: "😤" },
      ],
      endItems: [
        { id: 1, text: "Closer bond", emoji: "🤗" },
        { id: 2, text: "Anger", emoji: "💢" },
        { id: 3, text: "Forgiveness", emoji: "🌈" },
        { id: 4, text: "Care", emoji: "💖" },
        { id: 5, text: "Distance", emoji: "🚶‍♂️" },
      ],
      correctPairs: [
        { start: 1, end: 4 },
        { start: 2, end: 1 },
        { start: 3, end: 5 },
        { start: 4, end: 3 },
        { start: 5, end: 2 },
      ],
    },
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [connections, setConnections] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const question = questions[currentQ];

  const handleStartClick = (id) => setSelectedStart(id);

  const handleEndClick = (endId) => {
    if (!selectedStart) return;
    if (connections.find((c) => c.start === selectedStart || c.end === endId)) return;

    const newConnections = [...connections, { start: selectedStart, end: endId }];
    setConnections(newConnections);
    setSelectedStart(null);

    if (newConnections.length === question.startItems.length) {
      const allCorrect = newConnections.every((conn) =>
        question.correctPairs.some(
          (pair) => pair.start === conn.start && pair.end === conn.end
        )
      );

      if (allCorrect) {
        showCorrectAnswerFeedback(1, true);
        setCoins((prev) => prev + 1);
      }
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    setCompletedCount((prev) => prev + 1);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setConnections([]);
      setSelectedStart(null);
      setShowResult(false);
    } else {
      // Game complete
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setConnections([]);
    setSelectedStart(null);
    setShowResult(false);
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/broken-toy-story");
  };

  const isConnected = (id, type) =>
    connections.some((c) => (type === "start" ? c.start === id : c.end === id));

  return (
    <GameShell
      title="Puzzle: Peace Match Series"
      subtitle="Match all 5 puzzles for peace & kindness"
      onNext={handleNext}
      nextEnabled={showResult && currentQ === questions.length - 1}
      showGameOver={showResult && currentQ === questions.length - 1}
      score={coins}
      gameId="moral-kids-84"
      gameType="educational"
      totalLevels={100}
      currentLevel={84}
      showConfetti={showResult && currentQ === questions.length - 1}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult || currentQ < questions.length - 1 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              {question.title}
            </h3>
            <p className="text-white/70 text-sm mb-6 text-center">
              Match {question.startItems.length} pairs correctly
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Start</h4>
                {question.startItems.map((item) => (
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
                <h4 className="text-white font-bold text-center mb-3">End</h4>
                {question.endItems.map((item) => (
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
                Connections: {connections.length}/{question.startItems.length}
              </p>
            </div>

            {showResult && (
              <div className="text-center mt-6">
                <button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQ < questions.length - 1
                    ? "Next Question ➡️"
                    : "View Result 🎉"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              🌈 Amazing Work!
            </h2>
            <p className="text-white/80 mb-4">
              You completed all {questions.length} peace puzzles with kindness!
            </p>
            <p className="text-yellow-400 text-2xl font-bold">
              Total Coins Earned: {coins} 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzlePeaceMatch;
