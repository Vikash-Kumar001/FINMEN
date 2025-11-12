import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TaskDoneReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [checks, setChecks] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      items: ["Brush teeth", "Pack bag", "Eat breakfast"]
    },
    {
      id: 2,
      items: ["Do homework", "Clean room", "Read book"]
    },
    {
      id: 3,
      items: ["Help chore", "Play sport", "Sleep early"]
    },
    {
      id: 4,
      items: ["Study math", "Draw picture", "Call friend"]
    },
    {
      id: 5,
      items: ["Exercise", "Eat healthy", "Journal day"]
    }
  ];

  const handleItemToggle = (item) => {
    if (checkedItems.includes(item)) {
      setCheckedItems(checkedItems.filter(i => i !== item));
    } else {
      setCheckedItems([...checkedItems, item]);
    }
  };

  const handleCheck = () => {
    const newChecks = [...checks, checkedItems];
    setChecks(newChecks);

    const isComplete = checkedItems.length === questions[currentLevel].items.length;
    if (isComplete) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setCheckedItems([]); // Reset for next level
      }, isComplete ? 800 : 0);
    } else {
      const completeChecks = newChecks.filter((ci, idx) => ci.length === questions[idx].items.length).length;
      setFinalScore(completeChecks);
      if (completeChecks >= 3) {
        setCoins(3);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setChecks([]);
    setCoins(0);
    setFinalScore(0);
    setCheckedItems([]);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Task Done Reflex"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-93"
      gameType="uvls"
      totalLevels={100}
      currentLevel={93}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Check off completed tasks!</p>
              <div className="space-y-3">
                {getCurrentLevel().items.map(item => (
                  <button 
                    key={item} 
                    onClick={() => handleItemToggle(item)}
                    className={`w-full p-4 rounded text-left ${checkedItems.includes(item) ? 'bg-green-500' : 'bg-white/20'}`}
                  >
                    {item} {checkedItems.includes(item) ? '✅' : '⬜'}
                  </button>
                ))}
              </div>
              <button onClick={handleCheck} className="mt-4 bg-purple-500 text-white p-2 rounded">Submit</button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Task Checker!" : "💪 Check More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You checked completely {finalScore} levels!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 3 Coins! 🪙" : "Try again!"}
            </p>
            {finalScore < 3 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TaskDoneReflex;