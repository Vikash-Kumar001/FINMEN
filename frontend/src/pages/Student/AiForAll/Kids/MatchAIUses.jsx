import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MatchAIUses = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    { id: 1, name: "Self-driving", emoji: "🚗", match: "Car" },
    { id: 2, name: "Face recognition", emoji: "📱", match: "Phone unlock" },
    { id: 3, name: "Speech recognition", emoji: "🎙️", match: "Virtual assistant" },
    { id: 4, name: "Recommendation system", emoji: "📺", match: "Netflix" },
    { id: 5, name: "Translation AI", emoji: "🌐", match: "Text translation" }
  ];

  const targets = [
    { name: "Car", emoji: "🚗" },
    { name: "Phone unlock", emoji: "📱" },
    { name: "Virtual assistant", emoji: "🎙️" },
    { name: "Netflix", emoji: "📺" },
    { name: "Text translation", emoji: "🌐" }
  ];

  const handleDrop = (item, target) => {
    const isCorrect = item.match === target.name;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setMatches(prev => [...prev, { ...item, selected: target.name }]);

    if (matches.length + 1 === items.length) {
      setTimeout(() => setShowResult(true), 500);
    }
  };

  const handleTryAgain = () => {
    setMatches([]);
    setScore(0);
    setCoins(0);
    setShowResult(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/sorting-animals");
  };

  return (
    <GameShell
      title="Match AI Uses"
      subtitle={`Match ${matches.length + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 4}
      showGameOver={showResult && score >= 4}
      score={coins}
      gameId="ai-kids-23"
      gameType="ai"
      totalLevels={100}
      currentLevel={23}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Drag the AI tool to its correct use!
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-4">AI Tools</h4>
                <div className="space-y-4">
                  {items.map(item => !matches.find(m => m.id === item.id) && (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", item.id)}
                      className="bg-purple-500/30 p-4 rounded-xl text-white font-bold cursor-move select-none flex items-center justify-center gap-2"
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Uses</h4>
                <div className="space-y-4">
                  {targets.map(target => (
                    <div
                      key={target.name}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const id = parseInt(e.dataTransfer.getData("text/plain"));
                        const item = items.find(i => i.id === id);
                        handleDrop(item, target);
                      }}
                      className="bg-blue-500/30 p-4 rounded-xl text-white font-bold min-h-[50px] flex items-center justify-center gap-2"
                    >
                      <span className="text-2xl">{target.emoji}</span>
                      <span>{target.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {score >= 4 ? "🎉 AI Master!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You matched {score} out of {items.length} correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI is used in many real-life applications. Matching helps you learn where AI appears in everyday life!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold">
              {score >= 4 ? "You earned 5 Coins! 🪙" : "Score 4 or more to earn coins!"}
            </p>
            {score < 4 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MatchAIUses;
