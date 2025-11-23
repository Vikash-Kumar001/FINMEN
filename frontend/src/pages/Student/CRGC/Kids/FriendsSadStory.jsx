import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FriendsSadStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your friend is crying because her toy broke. What should you do?",
      options: [
        {
          id: "a",
          text: "Comfort her",
          emoji: "🤗",
          description: "That's right! When a friend is sad, showing empathy and offering comfort helps them feel better.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore her",
          emoji: "🤫",
          description: "That's not the best choice. Ignoring someone who is sad can make them feel worse and more alone.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend is still upset. What else can you do?",
      options: [
        {
          id: "a",
          text: "Tell her to stop crying",
          emoji: "✋",
          description: "That's not helpful. Telling someone to stop crying dismisses their feelings and doesn't help them cope.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Listen to her feelings",
          emoji: "👂",
          description: "Perfect! Listening shows that you care about your friend's feelings and helps them process what happened.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Your friend feels a bit better. What could you suggest?",
      options: [
        {
          id: "a",
          text: "Leave her alone",
          emoji: "🚶",
          description: "That's not ideal. While sometimes people need space, leaving a friend alone when they're sad might make them feel abandoned.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Play together to cheer her up",
          emoji: "🎮",
          description: "Great idea! Playing together can help distract from sadness and bring back positive feelings.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your friend's toy can't be fixed. How can you help?",
      options: [
        {
          id: "a",
          text: "Tell her it was her fault",
          emoji: "😠",
          description: "That's not kind. Blaming someone for an accident doesn't help and can make them feel worse.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Share your toys with her",
          emoji: "🧸",
          description: "Wonderful! Sharing shows kindness and can help your friend feel supported during a difficult time.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Your friend is feeling much better now. What should you do?",
      options: [
        {
          id: "a",
          text: "Forget about what happened",
          emoji: "😴",
          description: "That's not the best approach. Remembering to check in shows empathy and strengthens friendships.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask her how she's feeling",
          emoji: "💬",
          description: "Excellent! Checking in shows continued care and helps ensure your friend is truly feeling better.",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Friend's Sad Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-1"
      gameType="civic-responsibility"
      totalLevels={10}
      currentLevel={1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {choices.some(c => c.question === currentQuestion && c.optionId === option.id) && (
                      <p className="text-white/90">{option.description}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default FriendsSadStory;