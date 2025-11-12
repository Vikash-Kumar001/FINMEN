import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EthicsRoleplay = () => {
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
      scenario: "Found money on ground.",
      options: [
        { id: "a", text: "Return to owner", emoji: "💰", isHonest: true },
        { id: "b", text: "Keep it", emoji: "🤫", isHonest: false },
        { id: "c", text: "Ignore", emoji: "🙈", isHonest: false }
      ]
    },
    {
      id: 2,
      scenario: "Broke friend's toy.",
      options: [
        { id: "a", text: "Admit and apologize", emoji: "🙏", isHonest: true },
        { id: "b", text: "Hide it", emoji: "🕳️", isHonest: false },
        { id: "c", text: "Blame others", emoji: "👉", isHonest: false }
      ]
    },
    {
      id: 3,
      scenario: "Saw cheating on test.",
      options: [
        { id: "a", text: "Tell teacher", emoji: "🧑‍🏫", isHonest: true },
        { id: "b", text: "Cheat too", emoji: "📋", isHonest: false },
        { id: "c", text: "Do nothing", emoji: "🫥", isHonest: false }
      ]
    },
    {
      id: 4,
      scenario: "Took extra cookie.",
      options: [
        { id: "a", text: "Confess", emoji: "🍪", isHonest: true },
        { id: "b", text: "Eat secretly", emoji: "🤐", isHonest: false },
        { id: "c", text: "Share with friend", emoji: "👭", isHonest: false }
      ]
    },
    {
      id: 5,
      scenario: "Lied about homework.",
      options: [
        { id: "a", text: "Tell truth", emoji: "📖", isHonest: true },
        { id: "b", text: "Keep lying", emoji: "🤥", isHonest: false },
        { id: "c", text: "Forget", emoji: "😵", isHonest: false }
      ]
    }
  ];

  const handleChoice = (selectedOption) => {
    const newChoices = [...choices, selectedOption];
    setChoices(newChoices);

    const isHonest = questions[currentLevel].options.find(opt => opt.id === selectedOption)?.isHonest;
    if (isHonest) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isHonest ? 800 : 0);
    } else {
      const honestChoices = newChoices.filter((sel, idx) => questions[idx].options.find(opt => opt.id === sel)?.isHonest).length;
      setFinalScore(honestChoices);
      if (honestChoices >= 3) {
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
      title="Ethics Roleplay"
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-58"
      gameType="uvls"
      totalLevels={70}
      currentLevel={58}
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
              {finalScore >= 3 ? "🎉 Ethical Hero!" : "💪 Choose Honest!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You chose honestly {finalScore} times!
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

export default EthicsRoleplay;