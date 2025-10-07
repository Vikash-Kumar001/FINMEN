import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PosterSmartShopping = () => {
  const navigate = useNavigate();
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const posters = [
    {
      id: 1,
      title: "Think Before You Spend",
      design: "📝💰",
      message: "Always consider if you really need something before buying it",
      isCorrect: true
    },
    {
      id: 2,
      title: "Save First, Spend Later",
      design: "🏦⏰",
      message: "Put money aside for savings before spending on wants",
      isCorrect: false
    },
    {
      id: 3,
      title: "Make a Shopping List",
      design: "📋🛒",
      message: "Plan purchases ahead of time to avoid impulse buys",
      isCorrect: true
    },
    {
      id: 4,
      title: "Compare Prices",
      design: "🔍📊",
      message: "Look for the best deals before making a purchase",
      isCorrect: true
    },
    {
      id: 5,
      title: "Buy What's on Sale",
      design: "🏷️🎉",
      message: "Wait for discounts to get better value for your money",
      isCorrect: true
    },
    {
      id: 6,
      title: "Spend All You Want",
      design: "💸🛍️",
      message: "Buy anything that catches your eye without thinking",
      isCorrect: false
    }
  ];

  const handlePosterSelect = (poster) => {
    if (showResult) return;
    
    setSelectedPoster(poster);
    
    // If the poster is correct, show feedback
    if (poster.isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
  };

  const handleSubmit = () => {
    if (!selectedPoster) return;
    
    // For this activity, we'll consider it complete if they select a correct poster
    const isCorrect = selectedPoster.isCorrect;
    setFinalScore(isCorrect ? 1 : 0);
    setShowResult(true);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setSelectedPoster(null);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/finance/kids/journal-of-smart-buy");
  };

  return (
    <GameShell
      title="Poster: Smart Shopping"
      subtitle={showResult ? "Activity Complete!" : "Choose the best poster for smart shopping"}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={selectedPoster?.isCorrect ? 1 : 0}
      gameId="finance-kids-poster-smart-shopping"
      gameType="finance"
      totalLevels={10}
      currentLevel={6}
      showConfetti={showResult && selectedPoster?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                Select the best poster that promotes smart shopping habits
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posters.map(poster => (
                  <button
                    key={poster.id}
                    onClick={() => handlePosterSelect(poster)}
                    className={`p-6 rounded-2xl text-left transition-all transform hover:scale-105 ${
                      selectedPoster?.id === poster.id
                        ? "ring-4 ring-yellow-400 bg-gradient-to-br from-purple-600/50 to-pink-600/50"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    <div className="text-4xl mb-3">{poster.design}</div>
                    <h4 className="font-bold text-white text-lg mb-2">{poster.title}</h4>
                    <p className="text-white/90">{poster.message}</p>
                    
                    {selectedPoster?.id === poster.id && (
                      <div className="mt-4 p-3 bg-black/20 rounded-lg">
                        <p className="text-yellow-300 font-bold">
                          {poster.isCorrect ? "✅ Great choice!" : "❌ Not the best option"}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedPoster}
                  className={`py-3 px-8 rounded-full font-bold text-lg transition-all ${
                    selectedPoster
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit Choice
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {selectedPoster?.isCorrect ? (
              <div>
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-white mb-4">Creative Choice!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You selected "{selectedPoster.title}" which promotes smart shopping habits!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>Badge Earned!</span>
                </div>
                <p className="text-white/80">
                  This poster encourages thinking before spending, making shopping lists, 
                  comparing prices, and buying on sale - all smart shopping habits!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">🤔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Think Again!</h3>
                <p className="text-white/90 text-lg mb-4">
                  "{selectedPoster?.title}" doesn't promote the best shopping habits.
                </p>
                <p className="text-white/90 mb-4">
                  Better choices would be posters about thinking before spending, 
                  making shopping lists, comparing prices, or buying on sale.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterSmartShopping;