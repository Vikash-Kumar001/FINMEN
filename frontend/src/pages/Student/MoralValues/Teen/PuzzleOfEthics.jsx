import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfEthics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const matches = [
    { id: 1, concept: "Fairness", definition: "Justice and equality", isCorrect: true },
    { id: 2, concept: "Stealing", definition: "Wrong and unfair", isCorrect: true },
    { id: 3, concept: "Honesty", definition: "Telling the truth", isCorrect: true },
    { id: 4, concept: "Respect", definition: "Treating others kindly", isCorrect: true },
    { id: 5, concept: "Cheating", definition: "Dishonest and unethical", isCorrect: true },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const handleMatch = (matchId) => {
    setSelectedMatch(matchId);
  };

  const handleConfirm = () => {
    const match = matches.find((m) => m.id === selectedMatch);

    if (match && match.isCorrect) {
      showCorrectAnswerFeedback(1, false);
      setCorrectCount((prev) => prev + 1);
    }

    if (currentIndex < matches.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedMatch(null);
    } else {
      const accuracy = ((correctCount + (match?.isCorrect ? 1 : 0)) / matches.length) * 100;
      if (accuracy >= 70) {
        showCorrectAnswerFeedback(5, true);
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedMatch(null);
    setShowResult(false);
    setCoins(0);
    setCurrentIndex(0);
    setCorrectCount(0);
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/peer-pressure-story1");
  };

  const currentMatch = matches[currentIndex];

  return (
    <GameShell
      title="Puzzle of Ethics"
      score={coins}
      subtitle="Match actions to ethical meanings"
      onNext={handleNext}
      nextEnabled={showResult && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && coins > 0}
      
      gameId="moral-teen-94"
      gameType="moral"
      totalLevels={100}
      currentLevel={94}
      showConfetti={showResult && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">⚖️</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Match the concept with the correct meaning
            </h2>
            <p className="text-white/70 text-center mb-6">
              ({currentIndex + 1} of {matches.length})
            </p>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl font-semibold text-center">
                {currentMatch.concept} means...
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {matches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => handleMatch(match.id)}
                  disabled={match.id !== currentMatch.id}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedMatch === match.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-white font-semibold text-lg text-center">
                    {match.definition}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedMatch}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedMatch
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Match
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">⚖️</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {coins > 0 ? "🌟 Ethical Genius!" : "Keep Practicing!"}
            </h2>
            <p className="text-white/80 mb-6">
              You matched {correctCount} out of {matches.length} correctly.
            </p>

            {coins > 0 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    Amazing! Ethics guide fairness, honesty, and respect in life.
                    Choosing right over wrong builds justice and trust.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">
                    Try again! Ethics help you know right from wrong and make fair choices.
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

export default PuzzleOfEthics;
