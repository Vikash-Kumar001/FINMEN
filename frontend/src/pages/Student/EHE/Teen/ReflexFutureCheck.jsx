import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexFutureCheck = () => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    { id: 1, statement: "Engineer builds structures", isCorrect: true },
    { id: 2, statement: "Engineer cooks food", isCorrect: false },
    { id: 3, statement: "Data Scientist analyzes data", isCorrect: true },
    { id: 4, statement: "Data Scientist drives buses", isCorrect: false },
    { id: 5, statement: "Psychologist studies behavior", isCorrect: true },
    { id: 6, statement: "Psychologist fixes computers", isCorrect: false },
    { id: 7, statement: "Marketing Manager promotes products", isCorrect: true },
    { id: 8, statement: "Marketing Manager operates machines", isCorrect: false },
    { id: 9, statement: "Entrepreneur starts businesses", isCorrect: true },
    { id: 10, statement: "Entrepreneur only follows orders", isCorrect: false }
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.isCorrect;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem(prev => prev + 1);
      }, 300);
    } else {
      if ((score + (isCorrect ? 1 : 0)) >= 7) {
        setCoins(3);
      }
      setScore(prev => prev + (isCorrect ? 1 : 0));
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentItem(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ehe/teen/badge-career-aware-teen");
  };

  return (
    <GameShell
      title="Reflex Future Check"
      subtitle={`Statement ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 7}
      showGameOver={showResult && score >= 7}
      score={coins}
      gameId="ehe-teen-9"
      gameType="educational"
      totalLevels={20}
      currentLevel={9}
      showConfetti={showResult && score >= 7}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/entrepreneurship/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Quick! Is this correct?</h3>
            
            <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl p-8 mb-6">
              <p className="text-white text-2xl font-bold text-center">{currentItemData.statement}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">✓</div>
                <div className="text-white font-bold text-xl">CORRECT</div>
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">✗</div>
                <div className="text-white font-bold text-xl">WRONG</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 7 ? "🎉 Future Ready!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You got {score} out of {items.length} correct!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Understanding career responsibilities prepares you for the future!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 7 ? "You earned 3 Coins! 🪙" : "Get 7 or more correct to earn coins!"}
            </p>
            {score < 7 && (
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

export default ReflexFutureCheck;

