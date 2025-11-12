import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EncourageDream = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      vignette: "Your friend wants to be a pilot.",
      options: [
        { id: "a", text: "You can do it!", emoji: "✈️", isSupportive: true },
        { id: "b", text: "That's for boys/girls only.", emoji: "🚫", isSupportive: false },
        { id: "c", text: "Maybe choose something else.", emoji: "🤷", isSupportive: false }
      ]
    },
    {
      id: 2,
      vignette: "Classmate dreams of being a chef.",
      options: [
        { id: "a", text: "Great idea, go for it!", emoji: "👩‍🍳", isSupportive: true },
        { id: "b", text: "Cooking is not for you.", emoji: "🚫", isSupportive: false },
        { id: "c", text: "Think again.", emoji: "🤔", isSupportive: false }
      ]
    },
    {
      id: 3,
      vignette: "Friend wants to be an engineer.",
      options: [
        { id: "a", text: "Awesome, build cool things!", emoji: "🛠️", isSupportive: true },
        { id: "b", text: "Too hard for girls/boys.", emoji: "🚫", isSupportive: false },
        { id: "c", text: "Pick easier dream.", emoji: "😕", isSupportive: false }
      ]
    },
    {
      id: 4,
      vignette: "Sibling aims to be a teacher.",
      options: [
        { id: "a", text: "You'll be amazing!", emoji: "👩‍🏫", isSupportive: true },
        { id: "b", text: "That's boring.", emoji: "😴", isSupportive: false },
        { id: "c", text: "Not for your gender.", emoji: "🚫", isSupportive: false }
      ]
    },
    {
      id: 5,
      vignette: "Peer wants to be an artist.",
      options: [
        { id: "a", text: "Create beautiful art!", emoji: "🎨", isSupportive: true },
        { id: "b", text: "Art is not a real job.", emoji: "🚫", isSupportive: false },
        { id: "c", text: "Choose practical.", emoji: "📊", isSupportive: false }
      ]
    }
  ];

  const handleChoice = (selectedOption) => {
    const newChoices = [...choices, selectedOption];
    setChoices(newChoices);

    const isSupportive = questions[currentLevel].options.find(opt => opt.id === selectedOption)?.isSupportive;
    if (isSupportive) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isSupportive ? 800 : 0);
    } else {
      const supportiveChoices = newChoices.filter((sel, idx) => questions[idx].options.find(opt => opt.id === sel)?.isSupportive).length;
      setFinalScore(supportiveChoices);
      if (supportiveChoices >= 3) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Encourage Dream"
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-25"
      gameType="uvls"
      totalLevels={30}
      currentLevel={25}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4 font-semibold">
                {getCurrentLevel().vignette}
              </p>
              <div className="space-y-3">
                {getCurrentLevel().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 flex items-center gap-3"
                  >
                    <div className="text-3xl">{option.emoji}</div>
                    <div className="text-white font-medium text-left">{option.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Dream Supporter!" : "💪 Encourage More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You supported {finalScore} dreams!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 5 Coins! 🪙" : "Try again!"}
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

export default EncourageDream;