import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ToyDispute = () => {
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
      scenario: "Two friends want the same toy.",
      options: [
        { id: "a", text: "Take turns", emoji: "🔄", isFair: true },
        { id: "b", text: "Fight for it", emoji: "👊", isFair: false },
        { id: "c", text: "One keeps it", emoji: "🤷", isFair: false }
      ]
    },
    {
      id: 2,
      scenario: "Siblings argue over ball.",
      options: [
        { id: "a", text: "Share by time", emoji: "⏰", isFair: true },
        { id: "b", text: "Hide it", emoji: "🕳️", isFair: false },
        { id: "c", text: "Break it", emoji: "💥", isFair: false }
      ]
    },
    {
      id: 3,
      scenario: "Classmates want same book.",
      options: [
        { id: "a", text: "Read together", emoji: "📖", isFair: true },
        { id: "b", text: "Tear pages", emoji: "📄", isFair: false },
        { id: "c", text: "One reads all", emoji: "👤", isFair: false }
      ]
    },
    {
      id: 4,
      scenario: "Friends dispute over game.",
      options: [
        { id: "a", text: "Play in turns", emoji: "🎲", isFair: true },
        { id: "b", text: "Quit game", emoji: "🚫", isFair: false },
        { id: "c", text: "Argue loudly", emoji: "🗣️", isFair: false }
      ]
    },
    {
      id: 5,
      scenario: "Cousins want same puzzle.",
      options: [
        { id: "a", text: "Solve together", emoji: "🧩", isFair: true },
        { id: "b", text: "Throw pieces", emoji: "🤬", isFair: false },
        { id: "c", text: "One does all", emoji: "🤦", isFair: false }
      ]
    }
  ];

  const handleChoice = (selectedOption) => {
    const newChoices = [...choices, selectedOption];
    setChoices(newChoices);

    const isFair = questions[currentLevel].options.find(opt => opt.id === selectedOption)?.isFair;
    if (isFair) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isFair ? 800 : 0);
    } else {
      const fairChoices = newChoices.filter((sel, idx) => questions[idx].options.find(opt => opt.id === sel)?.isFair).length;
      setFinalScore(fairChoices);
      if (fairChoices >= 3) {
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
      title="Toy Dispute"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-71"
      gameType="uvls"
      totalLevels={100}
      currentLevel={71}
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
              {finalScore >= 3 ? "🎉 Fair Mediator!" : "💪 Mediate Better!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You mediated fairly {finalScore} times!
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

export default ToyDispute;