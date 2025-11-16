import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleSystemMatch = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState({});
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const leftItems = [
    { id: "ovaries", text: "Ovaries", emoji: "🥚" },
    { id: "uterus", text: "Uterus", emoji: "🤰" },
    { id: "hormones", text: "Hormones", emoji: "⚗️" }
  ];

  const rightItems = [
    { id: "eggs", text: "Eggs", emoji: "🥚" },
    { id: "growth", text: "Growth", emoji: "📈" },
    { id: "changes", text: "Changes", emoji: "🔄" }
  ];

  const correctMatches = {
    ovaries: "eggs",
    uterus: "growth",
    hormones: "changes"
  };

  const handleMatch = (leftId, rightId) => {
    if (matchedPairs.includes(leftId) || matchedPairs.includes(rightId)) return;
    
    const newMatches = { ...matches, [leftId]: rightId };
    setMatches(newMatches);
    
    // Check if all matches are correct
    const allMatched = Object.keys(newMatches).length === leftItems.length;
    if (allMatched) {
      const isAllCorrect = Object.entries(newMatches).every(
        ([left, right]) => correctMatches[left] === right
      );
      
      setIsCorrect(isAllCorrect);
      setGameCompleted(true);
      setShowFeedback(true);
      
      if (isAllCorrect) {
        showCorrectAnswerFeedback(1, true);
      }
    }
  };

  const handleReset = () => {
    setMatches({});
    setMatchedPairs([]);
    setShowFeedback(false);
    setIsCorrect(false);
    setGameCompleted(false);
  };

  const handleNext = () => {
    navigate("/student/health-female/teens/period-pain-story");
  };

  return (
    <GameShell
      title="Puzzle: System Match"
      subtitle="Match reproductive system parts with their functions"
      onNext={handleNext}
      nextEnabled={gameCompleted}
      showGameOver={gameCompleted}
      score={isCorrect ? 5 : 0}
      gameId="health-female-teen-34"
      gameType="health-female"
      totalLevels={40}
      currentLevel={34}
      showConfetti={isCorrect && gameCompleted}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 34 of 40</span>
            <span className="text-yellow-400 font-bold">Coins: {isCorrect ? 5 : 0}</span>
          </div>

          <p className="text-white text-lg mb-6 text-center">
            Match each reproductive system part with its correct function
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - system parts */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-center mb-4">System Parts</h3>
              {leftItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 cursor-pointer transition-all duration-300 ${
                    matchedPairs.includes(item.id)
                      ? "border-green-400 bg-green-500/20"
                      : "border-white/30 hover:border-purple-400"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-white font-medium">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Middle column - arrows */}
            <div className="flex flex-col justify-center items-center space-y-6">
              <div className="w-12 h-12 flex items-center justify-center">
                <span className="text-3xl">→</span>
              </div>
              <div className="w-12 h-12 flex items-center justify-center">
                <span className="text-3xl">→</span>
              </div>
              <div className="w-12 h-12 flex items-center justify-center">
                <span className="text-3xl">→</span>
              </div>
            </div>

            {/* Right column - functions */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-center mb-4">Functions</h3>
              {rightItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 cursor-pointer transition-all duration-300 ${
                    matchedPairs.includes(item.id)
                      ? "border-green-400 bg-green-500/20"
                      : "border-white/30 hover:border-purple-400"
                  }`}
                  onClick={() => {
                    // Find the first unmatched left item and create a match
                    const unmatchedLeft = leftItems.find(
                      (leftItem) => !matchedPairs.includes(leftItem.id)
                    );
                    if (unmatchedLeft) {
                      handleMatch(unmatchedLeft.id, item.id);
                      setMatchedPairs([...matchedPairs, unmatchedLeft.id, item.id]);
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-white font-medium">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showFeedback && (
            <div className={`mt-6 p-4 rounded-xl ${isCorrect ? "bg-green-500/20 border border-green-400" : "bg-red-500/20 border border-red-400"}`}>
              <div className="flex items-center space-x-3">
                {isCorrect ? (
                  <span className="text-green-400 text-2xl">✓</span>
                ) : (
                  <span className="text-red-400 text-2xl">✗</span>
                )}
                <div>
                  <h4 className={`font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                    {isCorrect ? "Excellent! All matches are correct!" : "Some matches need correction."}
                  </h4>
                  <p className="text-white/80 mt-1">
                    {isCorrect
                      ? "You've correctly matched all reproductive system parts with their functions."
                      : "Review the correct matches: Ovaries → Eggs, Uterus → Growth, Hormones → Changes."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={handleReset}
              className="bg-white/20 hover:bg-white/30 text-white py-2 px-6 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
            >
              <span>Reset Puzzle</span>
            </button>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PuzzleSystemMatch;