import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DifficultTalkRoleplay = () => {
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
      scenario: "Friend broke promise.",
      options: [
        { id: "a", text: "I feel sad when...", emoji: "😢", isKind: true },
        { id: "b", text: "You're mean!", emoji: "😠", isKind: false },
        { id: "c", text: "Whatever.", emoji: "🤷", isKind: false }
      ]
    },
    {
      id: 2,
      scenario: "Sibling took toy.",
      options: [
        { id: "a", text: "Please ask next time.", emoji: "🙏", isKind: true },
        { id: "b", text: "Give back now!", emoji: "🤬", isKind: false },
        { id: "c", text: "Hit back.", emoji: "👊", isKind: false }
      ]
    },
    {
      id: 3,
      scenario: "Classmate teased.",
      options: [
        { id: "a", text: "That hurts my feelings.", emoji: "💔", isKind: true },
        { id: "b", text: "You're stupid!", emoji: "😡", isKind: false },
        { id: "c", text: "Ignore forever.", emoji: "🙈", isKind: false }
      ]
    },
    {
      id: 4,
      scenario: "Parent said no.",
      options: [
        { id: "a", text: "Can we talk why?", emoji: "🗣️", isKind: true },
        { id: "b", text: "Not fair!", emoji: "😭", isKind: false },
        { id: "c", text: "Sneak anyway.", emoji: "🤫", isKind: false }
      ]
    },
    {
      id: 5,
      scenario: "Teacher corrected.",
      options: [
        { id: "a", text: "Thank you for helping.", emoji: "🙏", isKind: true },
        { id: "b", text: "Wrong!", emoji: "🚫", isKind: false },
        { id: "c", text: "Don't listen.", emoji: "🙉", isKind: false }
      ]
    }
  ];

  const handleChoice = (selectedOption) => {
    const newChoices = [...choices, selectedOption];
    setChoices(newChoices);

    const isKind = questions[currentLevel].options.find(opt => opt.id === selectedOption)?.isKind;
    if (isKind) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isKind ? 800 : 0);
    } else {
      const kindChoices = newChoices.filter((sel, idx) => questions[idx].options.find(opt => opt.id === sel)?.isKind).length;
      setFinalScore(kindChoices);
      if (kindChoices >= 3) {
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
      title="Difficult Talk Roleplay"
      score={coins}
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-68"
      gameType="uvls"
      totalLevels={70}
      currentLevel={68}
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
              {finalScore >= 3 ? "🎉 Talk Master!" : "💪 Talk Kinder!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You talked kindly {finalScore} times!
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

export default DifficultTalkRoleplay;