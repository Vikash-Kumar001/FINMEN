import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfGratitude = () => {
  const navigate = useNavigate();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [connections, setConnections] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // 🧩 All 5 puzzles
  const puzzles = [
    {
      id: 1,
      title: "Thanks & Feelings",
      startItems: [
        { id: 1, text: "Thanks", emoji: "🙏" },
        { id: 2, text: "Ignore", emoji: "🙈" },
      ],
      endItems: [
        { id: 1, text: "Smile", emoji: "😊" },
        { id: 2, text: "Hurt", emoji: "💔" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
    },
    {
      id: 2,
      title: "Helping Hand",
      startItems: [
        { id: 1, text: "Say Thank You", emoji: "🤝" },
        { id: 2, text: "Stay Silent", emoji: "😶" },
      ],
      endItems: [
        { id: 1, text: "Happy Helper", emoji: "😄" },
        { id: 2, text: "Disappointed", emoji: "😞" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
    },
    {
      id: 3,
      title: "Gift Reaction",
      startItems: [
        { id: 1, text: "Say 'Wow, thanks!'", emoji: "🎁" },
        { id: 2, text: "Say 'You didn’t have to'", emoji: "🙃" },
      ],
      endItems: [
        { id: 1, text: "Giver feels happy", emoji: "😊" },
        { id: 2, text: "Giver feels sad", emoji: "😔" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
    },
    {
      id: 4,
      title: "Team Support",
      startItems: [
        { id: 1, text: "Appreciate teammates", emoji: "🏅" },
        { id: 2, text: "Take all credit", emoji: "😏" },
      ],
      endItems: [
        { id: 1, text: "Team feels valued", emoji: "🤗" },
        { id: 2, text: "Team feels ignored", emoji: "😕" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
    },
    {
      id: 5,
      title: "Home Help",
      startItems: [
        { id: 1, text: "Say thanks to parents", emoji: "👨‍👩‍👧" },
        { id: 2, text: "Take it for granted", emoji: "😐" },
      ],
      endItems: [
        { id: 1, text: "Parents feel loved", emoji: "💖" },
        { id: 2, text: "Parents feel unappreciated", emoji: "💭" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
    },
  ];

  const current = puzzles[currentPuzzle];

  const handleStartClick = (startId) => setSelectedStart(startId);

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
      } else {
        setCoins(0);
      }
      setShowResult(true);
    }
  };

  const handleNextPuzzle = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setConnections([]);
      setSelectedStart(null);
      setShowResult(false);
      setCoins(0);
      setCurrentPuzzle(currentPuzzle + 1);
    } else {
      navigate("/student/moral-values/teen/service-story");
    }
  };

  const isConnected = (id, type) =>
    connections.some((c) => (type === "start" ? c.start === id : c.end === id));

  return (
    <GameShell
      title="Puzzle of Gratitude"
      subtitle={`Round ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNextPuzzle}
      nextEnabled={showResult}
      showGameOver={showResult && currentPuzzle === puzzles.length - 1}
      score={totalCoins}
      gameId="moral-teen-14"
      gameType="moral"
      totalLevels={20}
      currentLevel={14}
      showConfetti={showResult && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              {current.title}
            </h3>
            <p className="text-white/70 text-sm mb-6 text-center">
              Connect each action to its correct feeling
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
              {coins > 0 ? "🎉 Perfect Understanding!" : "Not Quite Right"}
            </h2>

            {coins > 0 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! Gratitude connects good actions with positive
                    feelings. Keep spreading kindness!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +5 Coins Earned! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Review your matches — gratitude brings smiles, not sadness.
                    Try again!
                  </p>
                </div>
              </>
            )}

            <button
              onClick={handleNextPuzzle}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentPuzzle < puzzles.length - 1 ? "Next Puzzle ➜" : "Finish 🎉"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfGratitude;
