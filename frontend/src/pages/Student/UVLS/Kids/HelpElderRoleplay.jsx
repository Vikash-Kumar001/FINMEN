import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HelpElderRoleplay = () => {
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
      scenario: "Elder drops bag.",
      options: [
        { id: "a", text: "Pick up please?", emoji: "🛍️", isPolite: true },
        { id: "b", text: "Your problem!", emoji: "🤬", isPolite: false },
        { id: "c", text: "Ignore", emoji: "🙈", isPolite: false }
      ]
    },
    {
      id: 2,
      scenario: "Grandma needs cross road.",
      options: [
        { id: "a", text: "Can I help cross?", emoji: "🛣️", isPolite: true },
        { id: "b", text: "Go alone!", emoji: "😠", isPolite: false },
        { id: "c", text: "Look away", emoji: "👀", isPolite: false }
      ]
    },
    {
      id: 3,
      scenario: "Elder heavy load.",
      options: [
        { id: "a", text: "Let me carry.", emoji: "💪", isPolite: true },
        { id: "b", text: "Too bad.", emoji: "🤷", isPolite: false },
        { id: "c", text: "Laugh", emoji: "😂", isPolite: false }
      ]
    },
    {
      id: 4,
      scenario: "Grandpa tell story.",
      options: [
        { id: "a", text: "Listen politely.", emoji: "👂", isPolite: true },
        { id: "b", text: "Interrupt rude.", emoji: "🛑", isPolite: false },
        { id: "c", text: "Walk away", emoji: "🚶", isPolite: false }
      ]
    },
    {
      id: 5,
      scenario: "Elder alone.",
      options: [
        { id: "a", text: "Chat kindly.", emoji: "🗣️", isPolite: true },
        { id: "b", text: "Ignore them.", emoji: "🫥", isPolite: false },
        { id: "c", text: "Tease age.", emoji: "😏", isPolite: false }
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
      title="Help Elder Roleplay"
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-88"
      gameType="uvls"
      totalLevels={100}
      currentLevel={88}
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
              {finalScore >= 3 ? "🎉 Elder Helper!" : "💪 Help Politer!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You helped politely {finalScore} times!
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

export default HelpElderRoleplay;