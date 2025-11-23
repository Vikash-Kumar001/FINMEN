import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SpotThePattern = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentPattern, setCurrentPattern] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const patterns = [
    { id: 1, sequence: ["🔴", "🟦", "🔴", "🟦", "?"], correct: "🔴", options: ["🔴", "🟦", "🟢"] },
    { id: 2, sequence: ["⭐", "⭐", "🌙", "⭐", "⭐", "?"], correct: "🌙", options: ["⭐", "🌙", "☀️"] },
    { id: 3, sequence: ["🍎", "🍌", "🍎", "🍌", "?"], correct: "🍎", options: ["🍎", "🍌", "🍊"] },
    { id: 4, sequence: ["🐶", "🐱", "🐶", "🐱", "?"], correct: "🐶", options: ["🐶", "🐱", "🐭"] },
    { id: 5, sequence: ["1️⃣", "2️⃣", "1️⃣", "2️⃣", "?"], correct: "1️⃣", options: ["1️⃣", "2️⃣", "3️⃣"] }
  ];

  const currentPatternData = patterns[currentPattern];

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
  };

  const handleConfirm = () => {
    const isCorrect = selectedChoice === currentPatternData.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedChoice(null);
    
    if (currentPattern < patterns.length - 1) {
      setTimeout(() => {
        setCurrentPattern(prev => prev + 1);
      }, isCorrect ? 800 : 600);
    } else {
      if (score + (isCorrect ? 1 : 0) >= 4) {
        setCoins(5);
      }
      setScore(prev => prev + (isCorrect ? 1 : 0));
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentPattern(0);
    setSelectedChoice(null);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/cat-or-dog-game");
  };

  return (
    <GameShell
      title="Spot the Pattern"
      score={coins}
      subtitle={`Pattern ${currentPattern + 1} of ${patterns.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 4}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && score >= 4}
      
      gameId="ai-kids-1"
      gameType="ai"
      totalLevels={20}
      currentLevel={1}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">What comes next?</h3>
            
            <div className="bg-blue-500/20 rounded-lg p-6 mb-6">
              <div className="flex justify-center items-center gap-4">
                {currentPatternData.sequence.map((item, idx) => (
                  <div key={idx} className="text-6xl">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">Choose the answer:</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {currentPatternData.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(option)}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    selectedChoice === option
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-6xl">{option}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 4 ? "🎉 Pattern Master!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You found {score} out of {patterns.length} patterns correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI uses pattern recognition to understand the world! You just learned how AI thinks!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 4 ? "You earned 5 Coins! 🪙" : "Get 4 or more correct to earn coins!"}
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

export default SpotThePattern;

