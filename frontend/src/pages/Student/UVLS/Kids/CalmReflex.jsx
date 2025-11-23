import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CalmReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [taps, setTaps] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedBehaviors, setSelectedBehaviors] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      behaviors: [
        { text: "Deep breathing", isCalm: true },
        { text: "Yelling", isCalm: false },
        { text: "Counting", isCalm: true }
      ]
    },
    {
      id: 2,
      behaviors: [
        { text: "Walking away", isCalm: true },
        { text: "Hitting", isCalm: false },
        { text: "Talking calmly", isCalm: true }
      ]
    },
    {
      id: 3,
      behaviors: [
        { text: "Positive thinking", isCalm: true },
        { text: "Crying angrily", isCalm: false },
        { text: "Drawing", isCalm: true }
      ]
    },
    {
      id: 4,
      behaviors: [
        { text: "Asking help", isCalm: true },
        { text: "Throwing things", isCalm: false },
        { text: "Listening music", isCalm: true }
      ]
    },
    {
      id: 5,
      behaviors: [
        { text: "Stretching", isCalm: true },
        { text: "Arguing", isCalm: false },
        { text: "Resting", isCalm: true }
      ]
    }
  ];

  const handleBehaviorToggle = (index) => {
    if (selectedBehaviors.includes(index)) {
      setSelectedBehaviors(selectedBehaviors.filter(i => i !== index));
    } else {
      setSelectedBehaviors([...selectedBehaviors, index]);
    }
  };

  const handleTap = () => {
    const newTaps = [...taps, selectedBehaviors];
    setTaps(newTaps);

    const correctTaps = questions[currentLevel].behaviors.filter(b => b.isCalm).length;
    const isCorrect = selectedBehaviors.length === correctTaps && selectedBehaviors.every(s => questions[currentLevel].behaviors[s].isCalm);
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedBehaviors([]); // Reset for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctLevels = newTaps.filter((sel, idx) => {
        const corr = questions[idx].behaviors.filter(b => b.isCalm).length;
        return sel.length === corr && sel.every(s => questions[idx].behaviors[s].isCalm);
      }).length;
      setFinalScore(correctLevels);
      if (correctLevels >= 3) {
        setCoins(3);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setTaps([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedBehaviors([]);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Calm Reflex"
      score={coins}
      subtitle={`Level ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-48"
      gameType="uvls"
      totalLevels={50}
      currentLevel={48}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Tap calm behaviors!</p>
              <div className="space-y-3">
                {getCurrentLevel().behaviors.map((beh, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleBehaviorToggle(idx)}
                    className={`w-full p-4 rounded text-left ${selectedBehaviors.includes(idx) ? 'bg-green-500' : 'bg-white/20'}`}
                  >
                    {beh.text} {selectedBehaviors.includes(idx) ? '😌' : '⬜'}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleTap} 
                className="mt-4 bg-purple-500 text-white p-2 rounded"
                disabled={selectedBehaviors.length === 0}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Calm Tapper!" : "💪 Tap More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You tapped correctly in {finalScore} levels!
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

export default CalmReflex;