import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AskClearlyStory = () => {
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
      story: "Need help with puzzle.",
      options: [
        { id: "a", text: "Can you help me please?", emoji: "🧩", isClear: true },
        { id: "b", text: "Help!", emoji: "😠", isClear: false },
        { id: "c", text: "What?", emoji: "🤔", isClear: false }
      ]
    },
    {
      id: 2,
      story: "Want to borrow toy.",
      options: [
        { id: "a", text: "May I borrow your toy?", emoji: "🧸", isClear: true },
        { id: "b", text: "Give me!", emoji: "🤲", isClear: false },
        { id: "c", text: "Mine now.", emoji: "😈", isClear: false }
      ]
    },
    {
      id: 3,
      story: "Ask for water.",
      options: [
        { id: "a", text: "Can I have water please?", emoji: "💧", isClear: true },
        { id: "b", text: "Thirsty!", emoji: "🥵", isClear: false },
        { id: "c", text: "Now!", emoji: "⏰", isClear: false }
      ]
    },
    {
      id: 4,
      story: "Need explanation.",
      options: [
        { id: "a", text: "Can you explain again?", emoji: "📖", isClear: true },
        { id: "b", text: "Huh?", emoji: "😕", isClear: false },
        { id: "c", text: "Tell me!", emoji: "🗣️", isClear: false }
      ]
    },
    {
      id: 5,
      story: "Want to play outside.",
      options: [
        { id: "a", text: "May we play outside?", emoji: "🌳", isClear: true },
        { id: "b", text: "Outside!", emoji: "🏃", isClear: false },
        { id: "c", text: "Bored inside.", emoji: "😴", isClear: false }
      ]
    }
  ];

  const handleChoice = (selectedOption) => {
    const newChoices = [...choices, selectedOption];
    setChoices(newChoices);

    const isClear = questions[currentLevel].options.find(opt => opt.id === selectedOption)?.isClear;
    if (isClear) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isClear ? 800 : 0);
    } else {
      const clearChoices = newChoices.filter((sel, idx) => questions[idx].options.find(opt => opt.id === sel)?.isClear).length;
      setFinalScore(clearChoices);
      if (clearChoices >= 3) {
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
      title="Ask Clearly Story"
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-65"
      gameType="uvls"
      totalLevels={70}
      currentLevel={65}
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
                {getCurrentLevel().story}
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
              {finalScore >= 3 ? "🎉 Clear Asker!" : "💪 Ask Clearer!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You asked clearly {finalScore} times!
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

export default AskClearlyStory;