import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterSavingHabit = () => {
  const navigate = useNavigate();
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const posters = [
    {
      id: 1,
      title: "Save First, Spend Later",
      description: "A poster showing a piggy bank first, then fun activities",
      emoji: "💰→🎉",
      isCorrect: true
    },
    {
      id: 2,
      title: "Spend First, Save Later",
      description: "A poster showing fun activities first, then piggy bank",
      emoji: "🎉→💰",
      isCorrect: false
    },
    {
      id: 3,
      title: "Save Nothing, Just Spend",
      description: "A poster showing only spending activities",
      emoji: "🛍️❌🏦",
      isCorrect: false
    }
  ];

  const handlePosterSelect = (poster) => {
    setSelectedPoster(poster.id);
    
    if (poster.isCorrect) {
      setCoins(5);
      showCorrectAnswerFeedback(5, true);
      
      setTimeout(() => {
        setShowResult(true);
      }, 1000);
    } else {
      // Show result immediately for incorrect
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/finance/kids/journal-of-saving");
  };

  const handleTryAgain = () => {
    setSelectedPoster(null);
    setShowResult(false);
    setCoins(0);
    resetFeedback();
  };

  return (
    <GameShell
      title="Poster: Saving Habit"
      subtitle="Create a poster that promotes good saving habits!"
      coins={coins}
      currentLevel={6}
      totalLevels={10}
      onNext={handleNext}
      nextEnabled={showResult && selectedPoster && posters.find(p => p.id === selectedPoster)?.isCorrect}
      showGameOver={showResult && selectedPoster && posters.find(p => p.id === selectedPoster)?.isCorrect}
      score={coins}
      gameId="finance-kids-6"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-6 text-center">
                Which poster best promotes good saving habits?
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {posters.map(poster => (
                  <button
                    key={poster.id}
                    onClick={() => handlePosterSelect(poster)}
                    className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 ${
                      selectedPoster === poster.id
                        ? "ring-4 ring-yellow-400 bg-gradient-to-r from-blue-500 to-indigo-600"
                        : "bg-gradient-to-r from-green-500 to-emerald-600"
                    }`}
                  >
                    <div className="text-4xl mb-4 text-center">{poster.emoji}</div>
                    <h3 className="font-bold text-xl text-white mb-2 text-center">{poster.title}</h3>
                    <p className="text-white/90 text-center">{poster.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {selectedPoster && posters.find(p => p.id === selectedPoster)?.isCorrect ? (
              <div>
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-white mb-4">Creative Choice!</h3>
                <p className="text-white/90 text-lg mb-4">
                  "Save First, Spend Later" is the best message for building good financial habits!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+5 Coins</span>
                </div>
                <p className="text-white/80">
                  This poster reminds us to save money first before spending on wants!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">🤔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Think About It!</h3>
                <p className="text-white/90 text-lg mb-4">
                  The best saving habit is to save money first, then spend on wants.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Look for the poster that promotes saving before spending.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterSavingHabit;