import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AngerStory = () => {
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
      text: "Your friend is angry because someone took their lunch. What should you do?",
      options: [
        {
          id: "a",
          text: "Tell them to calm down",
          emoji: "🧘",
          description: "That's right! Suggesting they calm down can help them process their feelings more clearly.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Join them in being angry",
          emoji: "😠",
          description: "That's not helpful. Joining in anger can make the situation worse and more difficult to resolve.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend is still upset. How can you help them manage their anger?",
      options: [
        {
          id: "a",
          text: "Ignore their feelings",
          emoji: "🤫",
          description: "That's not the best approach. Ignoring someone's feelings can make them feel unsupported.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Listen and suggest deep breaths",
          emoji: "👂",
          description: "Perfect! Listening shows you care, and suggesting deep breaths can help them calm down.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Your friend feels a bit better. What could you suggest next?",
      options: [
        {
          id: "a",
          text: "Tell them to forget about it",
          emoji: "💨",
          description: "That's not ideal. Telling someone to forget about a valid concern dismisses their feelings.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Talk about solutions together",
          emoji: "🤝",
          description: "Great idea! Working together on solutions helps resolve the issue and strengthens your friendship.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your friend wants to confront the person who took their lunch. What should you advise?",
      options: [
        {
          id: "a",
          text: "Encourage them to yell",
          emoji: "🗣️",
          description: "That's not a good idea. Yelling usually escalates conflicts rather than resolving them.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Suggest a calm conversation",
          emoji: "💬",
          description: "Wonderful! A calm conversation is much more likely to lead to understanding and resolution.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "The situation is resolved. How can your friend prevent similar anger in the future?",
      options: [
        {
          id: "a",
          text: "Keep feelings bottled up",
          emoji: "🤐",
          description: "That's not healthy. Bottling up emotions can lead to bigger outbursts later.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Practice mindfulness techniques",
          emoji: "🧘",
          description: "Excellent! Mindfulness techniques help manage emotions and prevent overwhelming anger.",
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
      title="Anger Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-41"
      gameType="civic-responsibility"
      totalLevels={50}
      currentLevel={41}
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

export default AngerStory;