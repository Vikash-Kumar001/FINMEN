import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CleanUpStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      scene: "Park litter.",
      tasks: [
        { id: "a", text: "Pick trash", emoji: "🗑️", isHelpful: true },
        { id: "b", text: "Leave it", emoji: "🙈", isHelpful: false },
        { id: "c", text: "Add more", emoji: "🚮", isHelpful: false }
      ]
    },
    {
      id: 2,
      scene: "Yard mess.",
      tasks: [
        { id: "a", text: "Rake leaves", emoji: "🍂", isHelpful: true },
        { id: "b", text: "Ignore", emoji: "🤷", isHelpful: false },
        { id: "c", text: "Scatter more", emoji: "🌬️", isHelpful: false }
      ]
    },
    {
      id: 3,
      scene: "Beach clean.",
      tasks: [
        { id: "a", text: "Collect plastic", emoji: "🏖️", isHelpful: true },
        { id: "b", text: "Bury it", emoji: "🕳️", isHelpful: false },
        { id: "c", text: "Throw in sea", emoji: "🌊", isHelpful: false }
      ]
    },
    {
      id: 4,
      scene: "Room tidy.",
      tasks: [
        { id: "a", text: "Put toys away", emoji: "🧸", isHelpful: true },
        { id: "b", text: "Mess more", emoji: "😈", isHelpful: false },
        { id: "c", text: "Hide under bed", emoji: "🛏️", isHelpful: false }
      ]
    },
    {
      id: 5,
      scene: "Street clean.",
      tasks: [
        { id: "a", text: "Sweep sidewalk", emoji: "🧹", isHelpful: true },
        { id: "b", text: "Litter paper", emoji: "📄", isHelpful: false },
        { id: "c", text: "Walk past", emoji: "🚶", isHelpful: false }
      ]
    }
  ];

  const handleChoice = (selectedOption) => {
    const newChoices = [...choices, selectedOption];
    setChoices(newChoices);

  const isHelpful = questions[currentLevel].tasks.find(opt => opt.id === selectedOption)?.isHelpful;
    if (isHelpful) {
      showCorrectAnswerFeedback(1, true);
    }

  if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isHelpful ? 800 : 0);
    } else {
  const helpfulChoices = newChoices.filter((sel, idx) => questions[idx].tasks.find(opt => opt.id === sel)?.isHelpful).length;
      setFinalScore(helpfulChoices);
      if (helpfulChoices >= 3) {
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
      title="Clean-up Story"
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-81"
      gameType="uvls"
      totalLevels={100}
      currentLevel={81}
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
                {getCurrentLevel().tasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleChoice(task.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 flex items-center gap-3"
                  >
                    <div className="text-3xl">{task.emoji}</div>
                    <div className="text-white font-medium text-left">{task.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Clean Hero!" : "💪 Clean More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You chose helpfully {finalScore} times!
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

export default CleanUpStory;