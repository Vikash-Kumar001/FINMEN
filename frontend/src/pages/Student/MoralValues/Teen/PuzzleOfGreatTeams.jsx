import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfGreatTeams = () => {
  const navigate = useNavigate();
  const [currentMatch, setCurrentMatch] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const matches = [
    { concept: "Wright Brothers", definition: "Airplane", isCorrect: true },
    { concept: "Cricket Team", definition: "Victory", isCorrect: true },
    { concept: "Avengers", definition: "Saving the World", isCorrect: true },
    { concept: "Bees", definition: "Making Honey Together", isCorrect: true },
    { concept: "Musicians", definition: "Creating Harmony", isCorrect: true },
  ];

  const currentData = matches[currentMatch];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (selectedChoice === 1) {
      showCorrectAnswerFeedback(1, true);
      setCoins((prev) => prev + 1);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentMatch < matches.length - 1) {
      setCurrentMatch((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      // All puzzles completed
      navigate("/student/moral-values/teen/leadership-story");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Puzzle: Great Teams"
      subtitle="Understanding Teamwork"
      score={coins}
      gameId="moral-teen-64"
      gameType="moral"
      totalLevels={100}
      currentLevel={64}
      showConfetti={showFeedback && selectedChoice === 1}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">🤝</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Match the Team with Their Achievement
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6 text-center">
              <p className="text-white text-xl font-semibold">
                {currentData.concept}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {matches.map((m, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(index === currentMatch ? 1 : 0)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedChoice === (index === currentMatch ? 1 : 0)
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-white font-semibold text-lg text-center">
                    {m.definition}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={selectedChoice === null}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoice !== null
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Match
            </button>

            <p className="text-center text-white/70 mt-4">
              Puzzle {currentMatch + 1} of {matches.length}
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">🤝</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoice === 1 ? "🌟 Correct Match!" : "❌ Oops! Try Again!"}
            </h2>

            {selectedChoice === 1 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! {currentData.concept} achieved {currentData.definition} together —
                    teamwork brings success! 🌟
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold mb-6">
                  +1 Coin Earned! 🪙
                </p>
                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentMatch === matches.length - 1 ? "Finish Puzzle" : "Next →"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Teamwork means unity and goal-sharing — try again to find the right match!
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

export default PuzzleOfGreatTeams;
