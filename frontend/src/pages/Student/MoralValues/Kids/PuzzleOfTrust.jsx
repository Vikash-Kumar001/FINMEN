import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfTrust = () => {
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

  // ✅ 5 Puzzles
  const puzzles = [
    {
      title: "Truth & Trust",
      startItems: [
        { id: 1, text: "Truth", emoji: "✨" },
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
      explanation:
        "Excellent! Truth leads to trust, and lies lead to trouble. When we tell the truth, people trust us.",
    },
    {
      title: "Respect Puzzle",
      startItems: [
        { id: 1, text: "Respect", emoji: "🙇‍♀️" },
        { id: 2, text: "Rudeness", emoji: "😠" },
      ],
      endItems: [
        { id: 1, text: "Friendship", emoji: "👭" },
        { id: 2, text: "Conflict", emoji: "⚡" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
      explanation:
        "Showing respect builds friendships, but being rude causes conflict. Choose kindness!",
    },
    {
      title: "Kindness Match",
      startItems: [
        { id: 1, text: "Kindness", emoji: "💖" },
        { id: 2, text: "Meanness", emoji: "💢" },
      ],
      endItems: [
        { id: 1, text: "Happiness", emoji: "😊" },
        { id: 2, text: "Loneliness", emoji: "😔" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
      explanation:
        "Kindness spreads joy and makes others happy. Meanness only leads to loneliness.",
    },
    {
      title: "Sharing Puzzle",
      startItems: [
        { id: 1, text: "Sharing", emoji: "🍎" },
        { id: 2, text: "Selfishness", emoji: "🙅‍♂️" },
      ],
      endItems: [
        { id: 1, text: "Joy", emoji: "🌈" },
        { id: 2, text: "Sadness", emoji: "☁️" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
      explanation:
        "Sharing spreads joy and makes the world brighter. Selfishness brings sadness.",
    },
    {
      title: "Hard Work Puzzle",
      startItems: [
        { id: 1, text: "Hard Work", emoji: "💪" },
        { id: 2, text: "Laziness", emoji: "😴" },
      ],
      endItems: [
        { id: 1, text: "Success", emoji: "🏆" },
        { id: 2, text: "Failure", emoji: "💤" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
      explanation:
        "Hard work leads to success and pride, but laziness brings failure. Keep trying your best!",
    },
  ];

  const puzzle = puzzles[currentPuzzle];

  const handleStartClick = (startId) => {
    setSelectedStart(startId);
  };

  const handleEndClick = (endId) => {
    if (!selectedStart) return;

    if (connections.find((c) => c.start === selectedStart || c.end === endId)) {
      return;
    }

    const newConnections = [...connections, { start: selectedStart, end: endId }];
    setConnections(newConnections);
    setSelectedStart(null);

    if (newConnections.length === 2) {
      const allCorrect = newConnections.every((conn) =>
        puzzle.correctPairs.some(
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
      setShowResult("gameOver");
    }
  };

  const handleFinish = () => {
    navigate("/student/moral-values/kids/cheating-story");
  };

  const isConnected = (id, type) => {
    return connections.some((c) =>
      type === "start" ? c.start === id : c.end === id
    );
  };

  return (
    <GameShell
      title="Puzzle of Trust"
      subtitle="Match Values to Outcomes"
      onNext={handleFinish}
      nextEnabled={showResult === "gameOver"}
      showGameOver={showResult === "gameOver"}
      score={totalCoins}
      gameId="moral-kids-4"
      gameType="educational"
      totalLevels={20}
      currentLevel={4}
      showConfetti={showResult === "gameOver"}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    
      maxScore={20} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {showResult === "gameOver" ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">Amazing Job!</h2>
            <p className="text-white/80 mb-6">
              You completed all 5 puzzles and learned about trust, respect, and honesty!
            </p>
            <p className="text-yellow-400 text-2xl font-bold">
              Total Coins Earned: {totalCoins} 🪙
            </p>
            <button
              onClick={handleFinish}
              className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Continue
            </button>
          </div>
        ) : !showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              Puzzle {currentPuzzle + 1} of 5: {puzzle.title}
            </h3>
            <p className="text-white/70 text-sm mb-6 text-center">
              Click an action, then click its matching outcome
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Actions</h4>
                {puzzle.startItems.map((item) => (
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
                    <div className="text-white font-semibold text-lg">
                      {item.text}
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Outcomes</h4>
                {puzzle.endItems.map((item) => (
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
                    <div className="text-white font-semibold text-lg">
                      {item.text}
                    </div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              {coins > 0 ? "🎉 Perfect Connections!" : "Not Quite Right"}
            </h2>

            {coins > 0 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{puzzle.explanation}</p>
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
                    Remember the right matches — try again!
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

export default PuzzleOfTrust;
