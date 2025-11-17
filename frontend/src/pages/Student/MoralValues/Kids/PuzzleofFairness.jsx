import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleofFairness = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // ✅ 5 Puzzle Questions
  const puzzles = [
    {
      id: 1,
      title: "Fair Play",
      startItems: [
        { id: 1, text: "Sharing", emoji: "🤝" },
        { id: 2, text: "Cheating", emoji: "😈" },
        { id: 3, text: "Waiting Turn", emoji: "⏳" },
        { id: 4, text: "Skipping Line", emoji: "🏃‍♂️" },
        { id: 5, text: "Taking Turns", emoji: "🎲" },
      ],
      endItems: [
        { id: 1, text: "Friends Happy", emoji: "😊" },
        { id: 2, text: "Friends Angry", emoji: "😡" },
        { id: 3, text: "Everyone Smiles", emoji: "😄" },
        { id: 4, text: "People Upset", emoji: "😠" },
        { id: 5, text: "Fun Together", emoji: "🎉" },
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
      title: "Honest Choices",
      startItems: [
        { id: 1, text: "Telling the Truth", emoji: "💬" },
        { id: 2, text: "Lying to Friends", emoji: "🤥" },
        { id: 3, text: "Admitting Mistake", emoji: "😔" },
        { id: 4, text: "Hiding Truth", emoji: "🙈" },
        { id: 5, text: "Being Honest", emoji: "💎" },
      ],
      endItems: [
        { id: 1, text: "Trusted by All", emoji: "🤗" },
        { id: 2, text: "Lost Trust", emoji: "💔" },
        { id: 3, text: "Respect Gained", emoji: "👏" },
        { id: 4, text: "Friends Upset", emoji: "😞" },
        { id: 5, text: "Proud Feeling", emoji: "🌟" },
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
      id: 3,
      title: "Helping Hands",
      startItems: [
        { id: 1, text: "Helping Elderly", emoji: "🧓" },
        { id: 2, text: "Ignoring Others", emoji: "🙄" },
        { id: 3, text: "Sharing Food", emoji: "🍱" },
        { id: 4, text: "Mocking Others", emoji: "😏" },
        { id: 5, text: "Volunteering", emoji: "🙌" },
      ],
      endItems: [
        { id: 1, text: "Smiles Everywhere", emoji: "😊" },
        { id: 2, text: "Sad Faces", emoji: "😞" },
        { id: 3, text: "Happy Friends", emoji: "😄" },
        { id: 4, text: "People Hurt", emoji: "💔" },
        { id: 5, text: "Community Love", emoji: "❤️" },
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
      id: 4,
      title: "Teamwork Spirit",
      startItems: [
        { id: 1, text: "Working Together", emoji: "🤝" },
        { id: 2, text: "Blaming Others", emoji: "😠" },
        { id: 3, text: "Encouraging Teammates", emoji: "💪" },
        { id: 4, text: "Doing All Alone", emoji: "🙅‍♀️" },
        { id: 5, text: "Celebrating Wins", emoji: "🎉" },
      ],
      endItems: [
        { id: 1, text: "Project Success", emoji: "🏆" },
        { id: 2, text: "Arguments", emoji: "⚡" },
        { id: 3, text: "Motivated Team", emoji: "🔥" },
        { id: 4, text: "Overworked", emoji: "😩" },
        { id: 5, text: "Happy Team", emoji: "😁" },
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
      id: 5,
      title: "Respect for All",
      startItems: [
        { id: 1, text: "Listening to Others", emoji: "👂" },
        { id: 2, text: "Interrupting", emoji: "🙊" },
        { id: 3, text: "Saying Thank You", emoji: "🙏" },
        { id: 4, text: "Ignoring Elders", emoji: "🙈" },
        { id: 5, text: "Being Polite", emoji: "🙂" },
      ],
      endItems: [
        { id: 1, text: "Better Understanding", emoji: "💬" },
        { id: 2, text: "Arguments", emoji: "😡" },
        { id: 3, text: "Good Impression", emoji: "🌟" },
        { id: 4, text: "Disrespect", emoji: "🚫" },
        { id: 5, text: "Strong Bonds", emoji: "🤗" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 5 },
      ],
    },
  ];

  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [connections, setConnections] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [completedPuzzles, setCompletedPuzzles] = useState(0);

  const handleStartClick = (startId) => setSelectedStart(startId);

  const handleEndClick = (endId) => {
    const puzzle = puzzles[currentPuzzle];
    if (!selectedStart) return;
    if (connections.find(c => c.start === selectedStart || c.end === endId)) return;

    const newConnections = [...connections, { start: selectedStart, end: endId }];
    setConnections(newConnections);
    setSelectedStart(null);

    if (newConnections.length === puzzle.startItems.length) {
      const allCorrect = newConnections.every(conn =>
        puzzle.correctPairs.some(pair => pair.start === conn.start && pair.end === conn.end)
      );

      setShowResult(true);
      if (allCorrect) {
        setCoins(prev => prev + 5);
        showCorrectAnswerFeedback(5, true);
        setTimeout(() => {
          if (currentPuzzle < puzzles.length - 1) {
            setCurrentPuzzle(currentPuzzle + 1);
            setConnections([]);
            setShowResult(false);
            setCompletedPuzzles(prev => prev + 1);
          } else {
            setCompletedPuzzles(puzzles.length);
          }
        }, 2500);
      }
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/lost-wallet-story");
  };

  const isConnected = (id, type) =>
    connections.some(c => (type === "start" ? c.start === id : c.end === id));

  const puzzle = puzzles[currentPuzzle];

  return (
    <GameShell
      title="Puzzle of Fairness"
      subtitle="Connect Actions to Outcomes"
      onNext={handleNext}
      nextEnabled={completedPuzzles === puzzles.length}
      showGameOver={completedPuzzles === puzzles.length}
      score={coins}
      gameId="moral-kids-44"
      gameType="educational"
      totalLevels={100}
      currentLevel={44}
      showConfetti={completedPuzzles === puzzles.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {completedPuzzles === puzzles.length ? (
          <div className="bg-green-500/20 p-8 rounded-2xl text-center text-white font-bold text-2xl">
            🏆 All Puzzles Complete! You’re a Fairness Champion! 💫
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h3 className="text-white text-2xl font-bold mb-4 text-center">
              Puzzle {currentPuzzle + 1}: {puzzle.title}
            </h3>
            <p className="text-white/70 text-sm mb-6 text-center">
              Match the correct actions and outcomes
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Actions</h4>
                {puzzle.startItems.map(item => (
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
                {puzzle.endItems.map(item => (
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

            <div className="mt-6 bg-blue-500/20 rounded-lg p-3 text-center text-white/80 text-sm">
              Connections: {connections.length}/{puzzle.startItems.length}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleofFairness;
