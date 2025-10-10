import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleOfIntegrity = () => {
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const matches = [
    { id: 1, concept: "Integrity", definition: "Doing right even when no one is watching", isCorrect: true },
    { id: 2, concept: "Integrity", definition: "Doing what's popular", isCorrect: false },
    { id: 3, concept: "Integrity", definition: "Following the crowd", isCorrect: false }
  ];

  const handleMatch = (matchId) => {
    setSelectedMatch(matchId);
  };

  const handleConfirm = () => {
    const match = matches.find(m => m.id === selectedMatch);
    
    if (match.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
    }
    
    setShowResult(true);
  };

  const handleTryAgain = () => {
    setSelectedMatch(null);
    setShowResult(false);
    setCoins(0);
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/bribe-simulation");
  };

  const selectedMatchData = matches.find(m => m.id === selectedMatch);

  return (
    <GameShell
      title="Puzzle of Integrity"
      subtitle="Understanding Integrity"
      onNext={handleNext}
      nextEnabled={showResult && coins > 0}
      showGameOver={showResult && coins > 0}
      score={coins}
      gameId="moral-teen-4"
      gameType="moral"
      totalLevels={20}
      currentLevel={4}
      showConfetti={showResult && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">💎</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">What is Integrity?</h2>
            
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl font-semibold text-center">Integrity means...</p>
            </div>

            <div className="space-y-3 mb-6">
              {matches.map(match => (
                <button
                  key={match.id}
                  onClick={() => handleMatch(match.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedMatch === match.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-white font-semibold text-lg text-center">{match.definition}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedMatch}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedMatch
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">💎</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {coins > 0 ? "🌟 Perfect!" : "Not Quite..."}
            </h2>
            
            {coins > 0 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! Integrity means doing the right thing even when no one is watching. 
                    It's about your character and values, not about what's popular or easy. People 
                    with integrity are trusted and respected because their actions match their words!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Integrity isn't about popularity or following the crowd. It's about doing what's 
                    right even when no one is watching. Your character is who you are when alone!
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

export default PuzzleOfIntegrity;

