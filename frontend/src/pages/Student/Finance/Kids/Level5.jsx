import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";

const Level5 = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [choice, setChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleChoice = (selectedChoice) => {
    setChoice(selectedChoice);
    setShowResult(true);
    
    if (selectedChoice === "save") {
      setCoins(5);
    }
  };

  const handleNext = () => {
    navigate("/student/finance/kids/level6");
  };

  return (
    <GameShell
      title="Birthday Money Story"
      subtitle="It's your birthday! What do you do with the gift money?"
      coins={coins}
      currentLevel={5}
      totalLevels={10}
      onNext={handleNext}
      nextEnabled={showResult && choice === "save"}
      showGameOver={showResult && choice === "save"}
      score={coins}
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
                  <div className="text-2xl mb-2">🎂</div>
                  <h3 className="font-bold text-xl mb-2">Save Some</h3>
                  <p className="text-white/90">Put ₹30 in savings, spend ₹20 on something special</p>
                </button>
                
                <button
                  onClick={() => handleChoice("spend")}
                  className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="text-2xl mb-2">🎉</div>
                  <h3 className="font-bold text-xl mb-2">Spend All</h3>
                  <p className="text-white/90">Buy toys, games, and treats with all the money</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {choice === "save" ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Excellent Decision!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You decided to save ₹30 and spend ₹20. This shows great financial wisdom!
                  Saving for future goals is an important habit.
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2">
                  <span>+5 Coins</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Think Again</h3>
                <p className="text-white/90 text-lg mb-4">
                  Spending all your birthday money means you won't have anything saved for bigger purchases later.
                  It's better to save some and spend some!
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setChoice(null);
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all"
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

export default Level5;