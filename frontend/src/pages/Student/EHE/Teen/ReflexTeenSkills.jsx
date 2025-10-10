import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexTeenSkills = () => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    { id: 1, word: "Leadership", isGood: true },
    { id: 2, word: "Bullying", isGood: false },
    { id: 3, word: "Innovation", isGood: true },
    { id: 4, word: "Procrastination", isGood: false },
    { id: 5, word: "Resilience", isGood: true },
    { id: 6, word: "Dishonesty", isGood: false },
    { id: 7, word: "Networking", isGood: true },
    { id: 8, word: "Arrogance", isGood: false },
    { id: 9, word: "Adaptability", isGood: true },
    { id: 10, word: "Blaming Others", isGood: false }
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.isGood;
    
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
    navigate("/student/ehe/teen/puzzle-match-traits");
  };

  return (
    <GameShell
      title="Reflex Teen Skills"
      subtitle={`Trait ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 7}
      showGameOver={showResult && score >= 7}
      score={coins}
      gameId="ehe-teen-13"
      gameType="educational"
      totalLevels={20}
      currentLevel={13}
      showConfetti={showResult && score >= 7}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/entrepreneurship/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Is this a good trait?</h3>
            
            <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl p-12 mb-6">
              <p className="text-white text-4xl font-bold text-center">{currentItemData.word}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">👍</div>
                <div className="text-white font-bold text-xl">GOOD TRAIT</div>
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-8 transition-all transform hover:scale-105"
              >
                <div className="text-6xl mb-2">👎</div>
                <div className="text-white font-bold text-xl">BAD TRAIT</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 7 ? "🎉 Trait Master!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You identified {score} out of {items.length} correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Good traits like leadership, innovation, and resilience drive entrepreneurial success!
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

export default ReflexTeenSkills;

