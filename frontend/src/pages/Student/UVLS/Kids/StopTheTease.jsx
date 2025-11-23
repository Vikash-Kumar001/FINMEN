import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StopTheTease = () => {
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
      vignette: "A kid is being teased about their clothes.",
      options: [
        { id: "a", text: "Tell the teaser to stop kindly", emoji: "🛑", isSafe: true },
        { id: "b", text: "Fight the teaser", emoji: "👊", isSafe: false },
        { id: "c", text: "Ignore it", emoji: "🙈", isSafe: false }
      ]
    },
    {
      id: 2,
      vignette: "Someone is mocked for their height.",
      options: [
        { id: "a", text: "Distract by changing topic", emoji: "🔄", isSafe: true },
        { id: "b", text: "Yell at the teaser", emoji: "😠", isSafe: false },
        { id: "c", text: "Laugh along", emoji: "😂", isSafe: false }
      ]
    },
    {
      id: 3,
      vignette: "A friend is teased about glasses.",
      options: [
        { id: "a", text: "Support friend and report", emoji: "🤝", isSafe: true },
        { id: "b", text: "Tease back", emoji: "😏", isSafe: false },
        { id: "c", text: "Walk away alone", emoji: "🚶", isSafe: false }
      ]
    },
    {
      id: 4,
      vignette: "Teasing about a mistake in class.",
      options: [
        { id: "a", text: "Encourage positively", emoji: "👍", isSafe: true },
        { id: "b", text: "Push the teaser", emoji: "🤜", isSafe: false },
        { id: "c", text: "Pretend not to see", emoji: "🙄", isSafe: false }
      ]
    },
    {
      id: 5,
      vignette: "Name-calling during play.",
      options: [
        { id: "a", text: "Include everyone fairly", emoji: "👥", isSafe: true },
        { id: "b", text: "Call names back", emoji: "🗣️", isSafe: false },
        { id: "c", text: "Do nothing", emoji: "🫥", isSafe: false }
      ]
    }
  ];

  const handleChoice = (selectedOption) => {
    const newChoices = [...choices, selectedOption];
    setChoices(newChoices);

    const isSafe = questions[currentLevel].options.find(opt => opt.id === selectedOption)?.isSafe;
    if (isSafe) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isSafe ? 800 : 0);
    } else {
      const safeChoices = newChoices.filter((sel, idx) => questions[idx].options.find(opt => opt.id === sel)?.isSafe).length;
      setFinalScore(safeChoices);
      if (safeChoices >= 3) {
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
      title="Stop the Tease"
      score={coins}
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-31"
      gameType="uvls"
      totalLevels={50}
      currentLevel={31}
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
              {finalScore >= 3 ? "🎉 Safe Stopper!" : "💪 Choose Safer!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You chose safely {finalScore} times!
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

export default StopTheTease;