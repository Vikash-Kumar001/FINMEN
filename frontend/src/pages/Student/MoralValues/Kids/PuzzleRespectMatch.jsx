import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleRespectMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [connections, setConnections] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      title: "Puzzle 1: Respect Match",
      startItems: [
        { id: 1, text: "Listen", emoji: "👂" },
        { id: 2, text: "Mock", emoji: "😈" },
      ],
      endItems: [
        { id: 1, text: "Respect", emoji: "🙏" },
        { id: 2, text: "Hurt", emoji: "💔" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
      message:
        "Listening shows respect, and mocking hurts people. Always choose kindness!",
    },
    {
      title: "Puzzle 2: Kindness Chain",
      startItems: [
        { id: 1, text: "Help", emoji: "🤝" },
        { id: 2, text: "Ignore", emoji: "🙈" },
      ],
      endItems: [
        { id: 1, text: "Care", emoji: "💖" },
        { id: 2, text: "Lonely", emoji: "😢" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
      message: "Helping builds care; ignoring makes others feel lonely.",
    },
    {
      title: "Puzzle 3: Honesty Path",
      startItems: [
        { id: 1, text: "Tell Truth", emoji: "🗣️" },
        { id: 2, text: "Lie", emoji: "🤥" },
      ],
      endItems: [
        { id: 1, text: "Trust", emoji: "🤝" },
        { id: 2, text: "Trouble", emoji: "⚠️" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
      message: "Honesty creates trust; lying leads to trouble.",
    },
    {
      title: "Puzzle 4: Sharing Spirit",
      startItems: [
        { id: 1, text: "Share", emoji: "🍫" },
        { id: 2, text: "Take All", emoji: "😬" },
      ],
      endItems: [
        { id: 1, text: "Friends", emoji: "🧑‍🤝‍🧑" },
        { id: 2, text: "Selfish", emoji: "🙄" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
      message: "Sharing brings friends; taking all makes you selfish.",
    },
    {
      title: "Puzzle 5: Online Behavior",
      startItems: [
        { id: 1, text: "Post Kindly", emoji: "💬" },
        { id: 2, text: "Insult Online", emoji: "💢" },
      ],
      endItems: [
        { id: 1, text: "Positive Space", emoji: "🌈" },
        { id: 2, text: "Toxic Space", emoji: "☠️" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
      message: "Kind posts make the internet positive. Insults create toxicity.",
    },
  ];

  const current = puzzles[currentPuzzle];

  const handleStartClick = (startId) => {
    setSelectedStart(startId);
  };

  const handleEndClick = (endId) => {
    if (!selectedStart) return;
    if (connections.find((c) => c.start === selectedStart || c.end === endId)) return;

    const newConnections = [...connections, { start: selectedStart, end: endId }];
    setConnections(newConnections);
    setSelectedStart(null);

    if (newConnections.length === 2) {
      const allCorrect = newConnections.every((conn) =>
        current.correctPairs.some(
          (pair) => pair.start === conn.start && pair.end === conn.end
        )
      );
      if (allCorrect) {
        showCorrectAnswerFeedback(5, true);
        setCoins(5);
        setTotalCoins((prev) => prev + 5);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setConnections([]);
    setSelectedStart(null);
    setShowResult(false);
    setCoins(0);
  };

  const handleNextPuzzle = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle((prev) => prev + 1);
      setConnections([]);
      setSelectedStart(null);
      setShowResult(false);
      setCoins(0);
    } else {
      setShowResult(true);
      setCurrentPuzzle(puzzles.length); // End
    }
  };

  const handleFinish = () => {
    navigate("/student/moral-values/kids/teacher-greeting-story");
  };

  const isConnected = (id, type) => {
    return connections.some((c) => (type === "start" ? c.start === id : c.end === id));
  };

  return (
    <GameShell
      title={currentPuzzle < puzzles.length ? current.title : "All Puzzles Complete!"}
      subtitle="Connect Actions to Outcomes"
      onNext={handleFinish}
      nextEnabled={currentPuzzle === puzzles.length}
      showGameOver={currentPuzzle === puzzles.length}
      score={totalCoins}
      gameId="moral-kids-14"
      gameType="educational"
      totalLevels={20}
      currentLevel={14}
      showConfetti={showResult && coins > 0}
      maxScore={20} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {currentPuzzle === puzzles.length ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">🎉 Amazing Job!</h2>
            <p className="text-white mb-4">
              You completed all 5 puzzles and earned a total of{" "}
              <span className="text-yellow-400 font-bold">{totalCoins} Coins 🪙</span>!
            </p>
            <button
              onClick={handleFinish}
              className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Continue
            </button>
          </div>
        ) : !showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              Connect each action to its outcome
            </h3>
            <p className="text-white/70 text-sm mb-6 text-center">
              Click an action, then click its matching outcome
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Actions</h4>
                {current.startItems.map((item) => (
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
                <h4 className="text-white font-bold text-center mb-3">Outcomes</h4>
                {current.endItems.map((item) => (
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
                Connections: {connections.length}/2
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {coins > 0 ? "🎉 Perfect Match!" : "Not Quite Right"}
            </h2>

            {coins > 0 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{current.message}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
                <button
                  onClick={handleNextPuzzle}
                  className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Puzzle →
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Remember the correct pairs and try again!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleRespectMatch;
