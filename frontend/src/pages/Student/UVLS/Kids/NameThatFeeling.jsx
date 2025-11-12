import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NameThatFeeling = () => {
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
      scene: "Won a game.",
      options: [
        { id: "a", text: "Happy", emoji: "😊", isCorrect: true },
        { id: "b", text: "Sad", emoji: "😢", isCorrect: false },
        { id: "c", text: "Angry", emoji: "😠", isCorrect: false }
      ]
    },
    {
      id: 2,
      scene: "Lost a toy.",
      options: [
        { id: "a", text: "Sad", emoji: "😢", isCorrect: true },
        { id: "b", text: "Happy", emoji: "😊", isCorrect: false },
        { id: "c", text: "Scared", emoji: "😱", isCorrect: false }
      ]
    },
    {
      id: 3,
      scene: "Dark room alone.",
      options: [
        { id: "a", text: "Scared", emoji: "😱", isCorrect: true },
        { id: "b", text: "Excited", emoji: "🤩", isCorrect: false },
        { id: "c", text: "Calm", emoji: "😌", isCorrect: false }
      ]
    },
    {
      id: 4,
      scene: "Friend shares candy.",
      options: [
        { id: "a", text: "Happy", emoji: "😊", isCorrect: true },
        { id: "b", text: "Angry", emoji: "😠", isCorrect: false },
        { id: "c", text: "Tired", emoji: "😴", isCorrect: false }
      ]
    },
    {
      id: 5,
      scene: "Someone takes your turn.",
      options: [
        { id: "a", text: "Angry", emoji: "😠", isCorrect: true },
        { id: "b", text: "Happy", emoji: "😊", isCorrect: false },
        { id: "c", text: "Sad", emoji: "😢", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (selectedOption) => {
    const newChoices = [...choices, selectedOption];
    setChoices(newChoices);

    const isCorrect = questions[currentLevel].options.find(opt => opt.id === selectedOption)?.isCorrect;
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isCorrect ? 800 : 0);
    } else {
      const correctChoices = newChoices.filter((sel, idx) => questions[idx].options.find(opt => opt.id === sel)?.isCorrect).length;
      setFinalScore(correctChoices);
      if (correctChoices >= 3) {
        setCoins(3);
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
      title="Name That Feeling"
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-41"
      gameType="uvls"
      totalLevels={50}
      currentLevel={41}
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
                {getCurrentLevel().scene}
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
              {finalScore >= 3 ? "🎉 Feeling Namer!" : "💪 Name More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You named correctly {finalScore} feelings!
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

export default NameThatFeeling;