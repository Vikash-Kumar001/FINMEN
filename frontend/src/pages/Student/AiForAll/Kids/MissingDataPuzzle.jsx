import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MissingDataPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      question: "Robot wants to make a fruit salad but a fruit is missing:",
      sequence: ["🍎", "🍌", "❓"],
      correct: "🍇",
      options: ["🍇", "🥕", "🥨"]
    },
    {
      id: 2,
      question: "Robot is sorting animals, but one is missing:",
      sequence: ["🐶", "🐱", "❓"],
      correct: "🐭",
      options: ["🐭", "🐔", "🐟"]
    },
    {
      id: 3,
      question: "Robot is completing shapes, but data is missing:",
      sequence: ["🔺", "🔵", "❓"],
      correct: "⬛",
      options: ["⬛", "⭐", "🔶"]
    },
    {
      id: 4,
      question: "Robot wants a full meal, but something is missing:",
      sequence: ["🍔", "🍟", "❓"],
      correct: "🥤",
      options: ["🥤", "🍩", "🌮"]
    },
    {
      id: 5,
      question: "Robot is making a weather chart, but info is missing:",
      sequence: ["☀️", "🌧️", "❓"],
      correct: "🌈",
      options: ["🌈", "❄️", "⚡"]
    }
  ];

  const currentPuzzleData = puzzles[currentPuzzle];

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
  };

  const handleConfirm = () => {
    const isCorrect = selectedChoice === currentPuzzleData.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedChoice(null);

    if (currentPuzzle < puzzles.length - 1) {
      setTimeout(() => {
        setCurrentPuzzle(prev => prev + 1);
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
    setCurrentPuzzle(0);
    setSelectedChoice(null);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/train-ai-with-sounds"); // change path as needed
  };

  return (
    <GameShell
      title="Missing Data Puzzle"
      score={coins}
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 4}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && score >= 4}
      
      gameId="ai-kids-63"
      gameType="ai"
      totalLevels={100}
      currentLevel={63}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              {currentPuzzleData.question}
            </h3>

            <div className="bg-blue-500/20 rounded-lg p-6 mb-6">
              <div className="flex justify-center items-center gap-4">
                {currentPuzzleData.sequence.map((item, idx) => (
                  <div key={idx} className="text-6xl">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">Fill the missing info:</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {currentPuzzleData.options.map((option, idx) => (
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
              {score >= 4 ? "✅ Data Detective!" : "🔍 Almost There!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You completed {score} out of {puzzles.length} puzzles correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                🤖 AI cannot give correct answers without complete data. You helped the robot think better by adding missing info!
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

export default MissingDataPuzzle;
