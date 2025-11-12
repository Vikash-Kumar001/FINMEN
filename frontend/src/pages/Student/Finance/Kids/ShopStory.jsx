import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ShopStory = () => {
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
    navigate("/student/finance/kids/reflex-money-choice");
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChoice(null);
    setCoins(0);
    resetFeedback();
  };

  return (
    <GameShell
      title="Shop Story"
      subtitle="You see candy in the shop. What do you choose?"
      coins={coins}
      currentLevel={8}
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={showResult && choice === "save"}
      showGameOver={showResult && choice === "save"}
      score={coins}
      gameId="finance-kids-8"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-6">
                You're walking home from school and see your favorite candy in the shop window. 
                You have ₹10 in your pocket. You've been saving ₹5 each week for a toy that costs ₹50. 
                You've saved ₹20 so far. What do you do?
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleChoice("save")}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="text-2xl mb-2">🏦</div>
                  <h3 className="font-bold text-xl mb-2">Save for Toy</h3>
                  <p className="text-white/90">Keep saving for the ₹50 toy you want</p>
                </button>
                
                <button
                  onClick={() => handleChoice("spend")}
                  className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="text-2xl mb-2">🍬</div>
                  <h3 className="font-bold text-xl mb-2">Buy Candy</h3>
                  <p className="text-white/90">Spend ₹10 on candy now</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {choice === "save" ? (
              <div>
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-4">Goal-Oriented!</h3>
                <p className="text-white/90 text-lg mb-4">
                  Great choice! Staying focused on your ₹50 toy goal means you'll reach it in 6 more weeks.
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+5 Coins</span>
                </div>
                <p className="text-white/80">
                  You're learning that delayed gratification leads to bigger rewards!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Think About Goals!</h3>
                <p className="text-white/90 text-lg mb-4">
                  Buying candy now means you'll need to save longer to reach your ₹50 toy goal.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try choosing to stay focused on your bigger goal.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ShopStory;