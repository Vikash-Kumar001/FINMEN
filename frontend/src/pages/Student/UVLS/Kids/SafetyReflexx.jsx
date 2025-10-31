import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafetyReflexx = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [taps, setTaps] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      options: [
        { text: "Wear helmet", isSafe: true },
        { text: "Run red light", isSafe: false },
        { text: "Use crosswalk", isSafe: true }
      ]
    },
    {
      id: 2,
      options: [
        { text: "Hold hand cross", isSafe: true },
        { text: "Play in street", isSafe: false },
        { text: "Buckle seatbelt", isSafe: true }
      ]
    },
    {
      id: 3,
      options: [
        { text: "Stranger candy no", isSafe: true },
        { text: "Climb high alone", isSafe: false },
        { text: "Wash hands", isSafe: true }
      ]
    },
    {
      id: 4,
      options: [
        { text: "Fire drill", isSafe: true },
        { text: "Touch hot stove", isSafe: false },
        { text: "Swim with adult", isSafe: true }
      ]
    },
    {
      id: 5,
      options: [
        { text: "Tell bully no", isSafe: true },
        { text: "Eat unknown berry", isSafe: false },
        { text: "Lock doors", isSafe: true }
      ]
    }
  ];

  const toggleOption = (index) => {
    setSelectedOptions(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleTap = () => {
    const newTaps = [...taps, selectedOptions];
    setTaps(newTaps);

    const correctSafe = questions[currentLevel].options.filter(o => o.isSafe).length;
    const isCorrect = selectedOptions.length === correctSafe && selectedOptions.every(idx => questions[currentLevel].options[idx].isSafe);
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedOptions([]); // Reset selection for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctLevels = newTaps.filter((sel, idx) => {
        const corr = questions[idx].options.filter(o => o.isSafe).length;
        return sel.length === corr && sel.every(s => questions[idx].options[s].isSafe);
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
    setSelectedOptions([]);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Safety Reflex"
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-99"
      gameType="uvls"
      totalLevels={100}
      currentLevel={99}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Tap safe options!</p>
              <div className="space-y-3">
                {getCurrentLevel().options.map((opt, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => toggleOption(idx)}
                    className={`w-full p-4 rounded text-left transition ${
                      selectedOptions.includes(idx) 
                        ? "bg-green-500 text-white" 
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {opt.text} 🛡️
                  </button>
                ))}
              </div>
              <button 
                onClick={handleTap}
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Submit ({selectedOptions.length} selected)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Safety Tapper!" : "💪 Tap Safer!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You tapped safely in {finalScore} levels!
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

export default SafetyReflexx;