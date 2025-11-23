import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const OldLadyStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Carrying Bags",
      emoji: "🛍️",
      situation: "You see an old lady struggling with heavy bags. Do you help her?",
      choices: [
        { id: 1, text: "Ignore and walk away", emoji: "🙁", isCorrect: false },
        { id: 2, text: "Help her carry the bags", emoji: "🤝", isCorrect: true }
      ]
    },
    {
      id: 2,
      title: "Crossing the Street",
      emoji: "🚶‍♀️",
      situation: "The old lady is afraid to cross the street alone. What do you do?",
      choices: [
        { id: 1, text: "Leave her", emoji: "🙁", isCorrect: false },
        { id: 2, text: "Guide her safely across", emoji: "🤝", isCorrect: true }
      ]
    },
    {
      id: 3,
      title: "Fallen Item",
      emoji: "🍎",
      situation: "She drops an item from her bag. Do you pick it up?",
      choices: [
        { id: 1, text: "Pick it up and return it", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Keep it for yourself", emoji: "🙁", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Carrying Long Distance",
      emoji: "🏃‍♀️",
      situation: "Her destination is far. Do you offer to carry her bags?",
      choices: [
        { id: 1, text: "Yes, carry them with her", emoji: "🤝", isCorrect: true },
        { id: 2, text: "No, it’s too far", emoji: "🙁", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Thank You",
      emoji: "🙏",
      situation: "She thanks you sincerely. How do you respond?",
      choices: [
        { id: 1, text: "Smile and nod", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Ignore her thanks", emoji: "🙁", isCorrect: false }
      ]
    }
  ];

  const [currentStory, setCurrentStory] = useState(0);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const story = stories[currentStory];
    const choice = story.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
    }

    setShowFeedback(true);

    // Auto move to next story after 1.5 seconds
    setTimeout(() => {
      if (currentStory < stories.length - 1) {
        setCurrentStory(prev => prev + 1);
        setSelectedChoice(null);
        setShowFeedback(false);
        setCoins(0);
        resetFeedback();
      } else {
        navigate("/student/moral-values/kids/quiz-service");
      }
    }, 1500);
  };

  const selectedChoiceData = selectedChoice
    ? stories[currentStory].choices.find(c => c.id === selectedChoice)
    : null;

  return (
    <GameShell
      title="Old Lady Story"
      subtitle="Acts of Kindness"
      score={coins}
      gameId="moral-kids-71"
      gameType="educational"
      totalLevels={100}
      currentLevel={71}
      showConfetti={showFeedback && coins > 0}
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{stories[currentStory].emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {stories[currentStory].title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {stories[currentStory].situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {stories[currentStory].choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-lg">{choice.text}</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {selectedChoiceData?.isCorrect ? "🌟 Helpful Hero!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg">
              {selectedChoiceData?.isCorrect
                ? "Helping someone in need shows kindness!"
                : "Remember, kindness always counts!"}
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OldLadyStory;
