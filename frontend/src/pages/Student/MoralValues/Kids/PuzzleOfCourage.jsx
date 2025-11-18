import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfCourage = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // === QUESTIONS DATA ===
  const questions = [
    {
      title: "Match Actions to Outcomes",
      startItems: [
        { id: 1, text: "Helping Friend", emoji: "🤝" },
        { id: 2, text: "Teasing Someone", emoji: "😈" },
      ],
      endItems: [
        { id: 1, text: "Brave", emoji: "💪" },
        { id: 2, text: "Weak", emoji: "😐" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
      hint: "Helping friends shows courage. Teasing others shows weakness."
    },
    {
      title: "Match Actions to Outcomes",
      startItems: [
        { id: 1, text: "Standing Up to Bully", emoji: "✊" },
        { id: 2, text: "Ignoring Wrongdoing", emoji: "🙈" },
      ],
      endItems: [
        { id: 1, text: "Brave", emoji: "💪" },
        { id: 2, text: "Weak", emoji: "😐" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
      hint: "Standing up shows courage; ignoring wrong shows fear."
    },
    {
      title: "Match Actions to Outcomes",
      startItems: [
        { id: 1, text: "Admitting Mistake", emoji: "🙋‍♂️" },
        { id: 2, text: "Blaming Others", emoji: "👎" },
      ],
      endItems: [
        { id: 1, text: "Brave", emoji: "💪" },
        { id: 2, text: "Weak", emoji: "😐" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
      hint: "Owning mistakes takes courage; blaming others is weak."
    },
    {
      title: "Match Actions to Outcomes",
      startItems: [
        { id: 1, text: "Helping Elderly Cross Road", emoji: "🧓🤲" },
        { id: 2, text: "Ignoring Needy", emoji: "🚶" },
      ],
      endItems: [
        { id: 1, text: "Brave", emoji: "💪" },
        { id: 2, text: "Weak", emoji: "😐" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
      hint: "Helping those in need is a brave and kind act."
    },
    {
      title: "Match Actions to Outcomes",
      startItems: [
        { id: 1, text: "Telling Truth", emoji: "🗣️" },
        { id: 2, text: "Lying to Escape", emoji: "😶‍🌫️" },
      ],
      endItems: [
        { id: 1, text: "Brave", emoji: "💪" },
        { id: 2, text: "Weak", emoji: "😐" },
      ],
      correctPairs: [
        { start: 1, end: 1 },
        { start: 2, end: 2 },
      ],
      hint: "Honesty is bravery; lying shows fear."
    }
  ];

  const currentData = questions[currentQuestion];

  // === LOGIC ===
  const handleStartClick = (startId) => {
    setSelectedStart(startId);
  };

  const handleEndClick = (endId) => {
    if (!selectedStart) return;
    if (connections.find(c => c.start === selectedStart || c.end === endId)) return;

    const newConnections = [...connections, { start: selectedStart, end: endId }];
    setConnections(newConnections);
    setSelectedStart(null);

    if (newConnections.length === currentData.startItems.length) {
      const allCorrect = newConnections.every(conn =>
        currentData.correctPairs.some(pair => pair.start === conn.start && pair.end === conn.end)
      );

      if (allCorrect) {
        showCorrectAnswerFeedback(2, true);
        setCoins(2);
        setTotalCoins(prev => prev + 2);
      }
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setConnections([]);
      setSelectedStart(null);
      setShowResult(false);
      setCoins(0);
      setCurrentQuestion(prev => prev + 1);
    } else {
      navigate("/student/moral-values/kids/confess-story");
    }
  };

  const handleTryAgain = () => {
    setConnections([]);
    setSelectedStart(null);
    setShowResult(false);
    setCoins(0);
  };

  const isConnected = (id, type) => {
    return connections.some(c => (type === "start" ? c.start === id : c.end === id));
  };

  return (
    <GameShell
      title="Puzzle of Courage"
      subtitle={`Level ${currentQuestion + 1} of 5`}
      score={totalCoins}
      gameId="moral-kids-54"
      gameType="educational"
      totalLevels={100}
      currentLevel={54}
      showConfetti={showResult && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              {currentData.title}
            </h3>
            <p className="text-white/70 text-sm mb-6 text-center">
              Click an action, then click its matching outcome
            </p>

            <div className="grid grid-cols-2 gap-8">
              {/* Start Side */}
              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Actions</h4>
                {currentData.startItems.map(item => (
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

              {/* End Side */}
              <div className="space-y-3">
                <h4 className="text-white font-bold text-center mb-3">Outcomes</h4>
                {currentData.endItems.map(item => (
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
                Connections: {connections.length}/{currentData.startItems.length}
              </p>
            </div>

            <div className="mt-4 text-center text-white/70 text-sm">
              💡 Hint: {currentData.hint}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {coins > 0 ? "🎉 Great Job!" : "❌ Not Quite Right"}
            </h2>

            {coins > 0 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{currentData.hint}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +{coins} Coins 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestion < questions.length - 1 ? "Next Puzzle ➡️" : "Finish Game 🎯"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Remember: Brave actions → Brave outcomes. Try again!
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

        <div className="text-center text-white/70 text-sm mt-6">
          Progress: {currentQuestion + 1}/5 | Total Coins: {totalCoins} 🪙
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleOfCourage;
