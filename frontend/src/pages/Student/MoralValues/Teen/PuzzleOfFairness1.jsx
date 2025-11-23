import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfFairness1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // 🧩 5 Puzzle Questions
  const matches = [
    { concept: "Equality", definition: "Justice" },
    { concept: "Bullying", definition: "Injustice" },
    { concept: "Cheating", definition: "Unfairness" },
    { concept: "Sharing", definition: "Fairness" },
    { concept: "Favoritism", definition: "Injustice" },
  ];

  const options = ["Justice", "Injustice", "Fairness", "Unfairness", "Kindness"];

  const handleConfirm = () => {
    const current = matches[currentQuestion];
    if (selectedOption === current.definition) {
      setCoins((prev) => prev + 1);
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentQuestion < matches.length - 1) {
      // Go to next question
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // All done
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setCoins(0);
    setScore(0);
    setShowResult(false);
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/bully-story2");
  };

  const current = matches[currentQuestion];

  return (
    <GameShell
      title="Puzzle of Fairness"
      score={coins}
      subtitle="Match Fair and Unfair Situations"
      onNext={handleNext}
      nextEnabled={showResult && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && coins > 0}
      
      gameId="moral-teen-44"
      gameType="moral"
      totalLevels={100}
      currentLevel={44}
      showConfetti={showResult && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">⚖️</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Question {currentQuestion + 1} of {matches.length}
            </h2>
            <p className="text-white text-lg mb-6">
              Match <span className="font-bold text-yellow-300">{current.concept}</span> with its correct meaning:
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(opt)}
                  className={`px-4 py-2 rounded-xl text-white font-medium transition-all ${
                    selectedOption === opt
                      ? "bg-purple-500/70 border border-white/60"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedOption}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedOption
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Puzzle Complete!
            </h2>
            <p className="text-white/90 text-lg mb-6">
              You got {score} out of {matches.length} correct.
            </p>

            {coins > 0 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Excellent work! You understand that fairness means justice,
                    equality, and standing up against cheating or favoritism.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold">
                  You earned {coins} Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Try again! Fairness means standing up for equality and justice.
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default PuzzleOfFairness1;
