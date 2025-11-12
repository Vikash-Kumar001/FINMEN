import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AskForHelpRoleplay = () => {
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
      scenario: "Need help with homework.",
      options: [
        { id: "a", text: "Please help me?", emoji: "🙏", isPolite: true },
        { id: "b", text: "Do it for me!", emoji: "😠", isPolite: false },
        { id: "c", text: "Never mind.", emoji: "🤷", isPolite: false }
      ]
    },
    {
      id: 2,
      scenario: "Feeling sad.",
      options: [
        { id: "a", text: "Can we talk?", emoji: "🗣️", isPolite: true },
        { id: "b", text: "Leave me alone!", emoji: "🚫", isPolite: false },
        { id: "c", text: "Ignore.", emoji: "🙈", isPolite: false }
      ]
    },
    {
      id: 3,
      scenario: "Bullying incident.",
      options: [
        { id: "a", text: "I need to report this.", emoji: "🚨", isPolite: true },
        { id: "b", text: "Handle it yourself!", emoji: "👊", isPolite: false },
        { id: "c", text: "Forget it.", emoji: "🫥", isPolite: false }
      ]
    },
    {
      id: 4,
      scenario: "Confused in class.",
      options: [
        { id: "a", text: "Can you explain again?", emoji: "🤔", isPolite: true },
        { id: "b", text: "This is stupid!", emoji: "🤬", isPolite: false },
        { id: "c", text: "Give up.", emoji: "😔", isPolite: false }
      ]
    },
    {
      id: 5,
      scenario: "Friend trouble.",
      options: [
        { id: "a", text: "Advice please?", emoji: "💡", isPolite: true },
        { id: "b", text: "Fix it now!", emoji: "😡", isPolite: false },
        { id: "c", text: "Don't care.", emoji: "🙄", isPolite: false }
      ]
    }
  ];

  const handleChoice = (selectedOption) => {
    const newChoices = [...choices, selectedOption];
    setChoices(newChoices);

    const isPolite = questions[currentLevel].options.find(opt => opt.id === selectedOption)?.isPolite;
    if (isPolite) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isPolite ? 800 : 0);
    } else {
      const politeChoices = newChoices.filter((sel, idx) => questions[idx].options.find(opt => opt.id === sel)?.isPolite).length;
      setFinalScore(politeChoices);
      if (politeChoices >= 3) {
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
      title="Ask for Help Roleplay"
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-47"
      gameType="uvls"
      totalLevels={50}
      currentLevel={47}
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
                {getCurrentLevel().scenario}
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
              {finalScore >= 3 ? "🎉 Help Asker!" : "💪 Ask Better!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You asked politely {finalScore} times!
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

export default AskForHelpRoleplay;