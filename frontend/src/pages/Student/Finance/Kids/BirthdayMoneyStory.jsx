import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BirthdayMoneyStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [choice, setChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const handleChoice = (selectedChoice) => {
    setChoice(selectedChoice);
    setShowResult(true);
    
    if (selectedChoice === "save") {
      setCoins(5);
      showCorrectAnswerFeedback(5, true);
    }
  };

  const handleNext = () => {
    navigate("/student/finance/kids/poster-saving-habit");
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChoice(null);
    setCoins(0);
    resetFeedback();
  };

  return (
    <GameShell
      title="Birthday Money Story"
      subtitle="It's your birthday! What do you do with the gift money?"
      coins={coins}
      currentLevel={5}
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={showResult && choice === "save"}
      showGameOver={showResult && choice === "save"}
      score={coins}
      gameId="finance-kids-5"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-6">
                It's your birthday and you received ₹50 from your relatives. What would you like to do?
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice("save")}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="text-2xl mb-2">🏦</div>
                  <h3 className="font-bold text-xl mb-2">Save Some</h3>
                  <p className="text-white/90">Put ₹30 in savings for something bigger later</p>
                </button>
                
                <button
                  onClick={() => handleChoice("spend")}
                  className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="text-2xl mb-2">🛍️</div>
                  <h3 className="font-bold text-xl mb-2">Spend All</h3>
                  <p className="text-white/90">Buy toys and treats right now with all ₹50</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {choice === "save" ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Smart Choice!</h3>
                <p className="text-white/90 text-lg mb-4">
                  Great decision! Saving ₹30 means you can buy something bigger later.
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+5 Coins</span>
                </div>
                <p className="text-white/80">
                  You're learning to balance enjoying today with planning for tomorrow!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Think Again!</h3>
                <p className="text-white/90 text-lg mb-4">
                  Spending all your money feels good now, but saving some helps you get bigger rewards later!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try choosing to save some money for later.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BirthdayMoneyStory;