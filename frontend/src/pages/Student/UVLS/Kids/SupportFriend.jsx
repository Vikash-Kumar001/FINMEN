import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SupportFriend = () => {
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
      vignette: "Friend is bullied and sad.",
      options: [
        { id: "a", text: "Listen and hug", emoji: "🤗", isSupportive: true },
        { id: "b", text: "Ignore them", emoji: "🙈", isSupportive: false },
        { id: "c", text: "Tell them to fight back", emoji: "👊", isSupportive: false }
      ]
    },
    {
      id: 2,
      vignette: "Classmate is excluded.",
      options: [
        { id: "a", text: "Invite to join", emoji: "👋", isSupportive: true },
        { id: "b", text: "Laugh at them", emoji: "😂", isSupportive: false },
        { id: "c", text: "Walk away", emoji: "🚶", isSupportive: false }
      ]
    },
    {
      id: 3,
      vignette: "Someone is name-called.",
      options: [
        { id: "a", text: "Report to teacher", emoji: "🧑‍🏫", isSupportive: true },
        { id: "b", text: "Join in", emoji: "😈", isSupportive: false },
        { id: "c", text: "Do nothing", emoji: "🫥", isSupportive: false }
      ]
    },
    {
      id: 4,
      vignette: "Friend's things are hidden.",
      options: [
        { id: "a", text: "Help find and support", emoji: "🔍", isSupportive: true },
        { id: "b", text: "Blame friend", emoji: "🤬", isSupportive: false },
        { id: "c", text: "Pretend not to know", emoji: "🤷", isSupportive: false }
      ]
    },
    {
      id: 5,
      vignette: "Online mean messages to peer.",
      options: [
        { id: "a", text: "Advise to block and report", emoji: "🚫", isSupportive: true },
        { id: "b", text: "Reply meanly", emoji: "💻", isSupportive: false },
        { id: "c", text: "Ignore message", emoji: "🙄", isSupportive: false }
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
      title="Support Friend"
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-35"
      gameType="uvls"
      totalLevels={50}
      currentLevel={35}
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
              {finalScore >= 3 ? "🎉 Friend Supporter!" : "💪 Support More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You supported {finalScore} times!
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

export default SupportFriend;