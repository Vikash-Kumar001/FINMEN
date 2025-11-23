import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SupportRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      scenario: "Friend is told 'You can't do that because you're a girl.'",
      options: [
        { id: "a", text: "That's not true, you can!", emoji: "💪", isSupportive: true },
        { id: "b", text: "Maybe they're right.", emoji: "🤷", isSupportive: false },
        { id: "c", text: "Ignore it.", emoji: "🙈", isSupportive: false }
      ]
    },
    {
      id: 2,
      scenario: "Classmate discouraged from playing sports.",
      options: [
        { id: "a", text: "Let's play together!", emoji: "⚽", isSupportive: true },
        { id: "b", text: "Sports aren't for you.", emoji: "🚫", isSupportive: false },
        { id: "c", text: "Find something else.", emoji: "🔍", isSupportive: false }
      ]
    },
    {
      id: 3,
      scenario: "Sibling mocked for career choice.",
      options: [
        { id: "a", text: "You'll be great at it!", emoji: "🌟", isSupportive: true },
        { id: "b", text: "Choose differently.", emoji: "🔄", isSupportive: false },
        { id: "c", text: "Laugh along.", emoji: "😂", isSupportive: false }
      ]
    },
    {
      id: 4,
      scenario: "Peer feels bad about stereotype.",
      options: [
        { id: "a", text: "Stereotypes are wrong, be yourself!", emoji: "🦸", isSupportive: true },
        { id: "b", text: "Get used to it.", emoji: "😔", isSupportive: false },
        { id: "c", text: "Change to fit in.", emoji: "🕶️", isSupportive: false }
      ]
    },
    {
      id: 5,
      scenario: "Friend discouraged from hobby.",
      options: [
        { id: "a", text: "Keep doing what you love!", emoji: "❤️", isSupportive: true },
        { id: "b", text: "Stop if others say so.", emoji: "🛑", isSupportive: false },
        { id: "c", text: "Hide it.", emoji: "🙊", isSupportive: false }
      ]
    }
  ];

  const handleResponse = (selectedOption) => {
    const newResponses = [...responses, selectedOption];
    setResponses(newResponses);

    const isSupportive = questions[currentLevel].options.find(opt => opt.id === selectedOption)?.isSupportive;
    if (isSupportive) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, isSupportive ? 800 : 0);
    } else {
      const supportiveResponses = newResponses.filter((sel, idx) => questions[idx].options.find(opt => opt.id === sel)?.isSupportive).length;
      setFinalScore(supportiveResponses);
      if (supportiveResponses >= 3) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setResponses([]);
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
      title="Support Roleplay"
      score={coins}
  subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-28"
      gameType="uvls"
      totalLevels={30}
      currentLevel={28}
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
                    onClick={() => handleResponse(option.id)}
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
              {finalScore >= 3 ? "🎉 Support Star!" : "💪 Support Better!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You supported in {finalScore} scenarios!
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

export default SupportRoleplay;