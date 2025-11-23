import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfDilemmas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [connections, setConnections] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // 🧩 5 Sets of moral puzzles
  const puzzleSets = [
    {
      title: "Match Values to Outcomes",
      startItems: [
        { id: 1, text: "Honesty", emoji: "✨" },
        { id: 2, text: "Cheating", emoji: "😏" },
        { id: 3, text: "Helping", emoji: "🤝" },
        { id: 4, text: "Lying", emoji: "🤥" },
        { id: 5, text: "Sharing", emoji: "🍎" },
      ],
      endItems: [
        { id: 1, text: "Good", emoji: "🌟" },
        { id: 2, text: "Wrong", emoji: "⚠️" },
        { id: 3, text: "Good", emoji: "🌟" },
        { id: 4, text: "Wrong", emoji: "⚠️" },
        { id: 5, text: "Good", emoji: "🌟" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 },
      ],
      feedback: "Honesty leads to good, cheating leads to wrong, and helping or sharing leads to good.",
    },
    {
      title: "Match Actions to Results",
      startItems: [
        { id: 1, text: "Bullying", emoji: "😡" },
        { id: 2, text: "Apologizing", emoji: "🙏" },
        { id: 3, text: "Stealing", emoji: "👜" },
        { id: 4, text: "Respecting", emoji: "🙌" },
        { id: 5, text: "Helping Elderly", emoji: "👵" },
      ],
      endItems: [
        { id: 1, text: "Wrong", emoji: "⚠️" },
        { id: 2, text: "Good", emoji: "🌟" },
        { id: 3, text: "Wrong", emoji: "⚠️" },
        { id: 4, text: "Good", emoji: "🌟" },
        { id: 5, text: "Good", emoji: "🌟" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 },
      ],
      feedback: "Respect, kindness, and apologies bring good; bullying and stealing are wrong.",
    },
    {
      title: "Match Behaviors to Consequences",
      startItems: [
        { id: 1, text: "Being Rude", emoji: "😤" },
        { id: 2, text: "Being Polite", emoji: "😊" },
        { id: 3, text: "Disobeying", emoji: "🙅‍♂️" },
        { id: 4, text: "Obeying Rules", emoji: "📘" },
        { id: 5, text: "Encouraging Others", emoji: "💪" },
      ],
      endItems: [
        { id: 1, text: "Wrong", emoji: "⚠️" },
        { id: 2, text: "Good", emoji: "🌟" },
        { id: 3, text: "Wrong", emoji: "⚠️" },
        { id: 4, text: "Good", emoji: "🌟" },
        { id: 5, text: "Good", emoji: "🌟" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 },
      ],
      feedback: "Good manners and following rules are right; rudeness and disobedience are wrong.",
    },
    {
      title: "Match Choices to Reactions",
      startItems: [
        { id: 1, text: "Teasing", emoji: "😜" },
        { id: 2, text: "Encouraging", emoji: "🌼" },
        { id: 3, text: "Sharing Toys", emoji: "🧸" },
        { id: 4, text: "Ignoring", emoji: "😶" },
        { id: 5, text: "Helping Teacher", emoji: "👩‍🏫" },
      ],
      endItems: [
        { id: 1, text: "Wrong", emoji: "⚠️" },
        { id: 2, text: "Good", emoji: "🌟" },
        { id: 3, text: "Good", emoji: "🌟" },
        { id: 4, text: "Wrong", emoji: "⚠️" },
        { id: 5, text: "Good", emoji: "🌟" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 },
      ],
      feedback: "Helping, encouraging, and sharing bring joy; teasing or ignoring others hurts feelings.",
    },
    {
      title: "Match Actions to Emotions",
      startItems: [
        { id: 1, text: "Breaking Rules", emoji: "🚫" },
        { id: 2, text: "Helping Friend", emoji: "🤗" },
        { id: 3, text: "Telling Lie", emoji: "🫢" },
        { id: 4, text: "Being Honest", emoji: "🫶" },
        { id: 5, text: "Cheating in Exam", emoji: "📄" },
      ],
      endItems: [
        { id: 1, text: "Wrong", emoji: "⚠️" },
        { id: 2, text: "Good", emoji: "🌟" },
        { id: 3, text: "Wrong", emoji: "⚠️" },
        { id: 4, text: "Good", emoji: "🌟" },
        { id: 5, text: "Wrong", emoji: "⚠️" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 },
      ],
      feedback: "Honesty and helping are good; lying, cheating, and breaking rules are wrong.",
    },
  ];

  const currentPuzzle = puzzleSets[currentSet];

  const handleStartClick = (startId) => setSelectedStart(startId);

  const handleEndClick = (endId) => {
    if (!selectedStart) return;
    if (connections.find((c) => c.start === selectedStart || c.end === endId)) return;

    const newConnections = [...connections, { start: selectedStart, end: endId }];
    setConnections(newConnections);
    setSelectedStart(null);

    if (newConnections.length === 5) {
      const allCorrect = newConnections.every((conn) =>
        currentPuzzle.correctPairs.some((pair) => pair.start === conn.start && pair.end === conn.end)
      );

      if (allCorrect) {
        showCorrectAnswerFeedback(5, true);
        setCoins((prev) => prev + 5);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setConnections([]);
    setSelectedStart(null);
    setShowResult(false);
  };

  const handleNextSet = () => {
    if (currentSet < puzzleSets.length - 1) {
      setConnections([]);
      setSelectedStart(null);
      setShowResult(false);
      setCurrentSet(currentSet + 1);
    } else {
      navigate("/student/moral-values/kids/friends-secret-story");
    }
  };

  const isConnected = (id, type) =>
    connections.some((c) => (type === "start" ? c.start === id : c.end === id));

  return (
    <GameShell
      title="Puzzle of Dilemmas"
      subtitle="Match Values to Outcomes"
      onNext={handleNextSet}
      nextEnabled={showResult}
      showGameOver={showResult && currentSet === puzzleSets.length - 1}
      score={coins}
      gameId="moral-kids-94"
      gameType="educational"
      totalLevels={100}
      currentLevel={94}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              {currentPuzzle.title}
            </h3>
            <p className="text-white/70 text-sm mb-6 text-center">
              Click a value, then click its matching outcome
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Values</h4>
                {currentPuzzle.startItems.map((item) => (
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
                {currentPuzzle.endItems.map((item) => (
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
                Connections: {connections.length}/5
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              🎉 Great Work!
            </h2>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center">{currentPuzzle.feedback}</p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              +5 Coins Earned 🪙
            </p>
            <button
              onClick={handleNextSet}
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentSet < puzzleSets.length - 1 ? "Next Puzzle ➡️" : "Finish Game 🎯"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfDilemmas;
