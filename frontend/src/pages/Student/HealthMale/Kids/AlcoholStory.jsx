import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AlcoholStory = () => {
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
      text: "An older teen at a party offers you alcohol and says 'It's just one sip.' What should you do?",
      options: [
        {
          id: "b",
          text: "Take a sip to be cool",
          emoji: "😎",
          description: "Alcohol is dangerous for kids - even small amounts harm growing bodies",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and explain you're too young",
          emoji: "🙅",
          description: "Saying no shows maturity and protects your health",
          isCorrect: true
        },
        {
          id: "c",
          text: "Pretend to drink but don't swallow",
          emoji: "🤏",
          description: "It's better to clearly refuse than trick anyone",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend says 'Alcohol makes parties more fun.' How do you respond?",
      options: [
        {
          id: "c",
          text: "Agree and ask for some",
          emoji: "🍺",
          description: "Real fun comes from being yourself, not from alcohol",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say 'Fun doesn't need alcohol'",
          emoji: "🎉",
          description: "You can have great times without harmful substances",
          isCorrect: true
        },
        {
          id: "b",
          text: "Say you're not interested",
          emoji: "😑",
          description: "Being clear about your choices is important",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Someone says 'Everyone drinks alcohol sometimes.' What do you think?",
      options: [
        {
          id: "b",
          text: "Then I should try it too",
          emoji: "👥",
          description: "Everyone makes their own choices - choose what's healthy for you",
          isCorrect: false
        },
        {
          id: "a",
          text: "I choose what's healthy for me",
          emoji: "💪",
          description: "Making independent healthy choices shows real strength",
          isCorrect: true
        },
        {
          id: "c",
          text: "Maybe when I'm older",
          emoji: "⏰",
          description: "Alcohol is never safe or healthy, no matter your age",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "At a family gathering, someone offers you a drink that tastes funny. What do you do?",
      options: [
        {
          id: "c",
          text: "Drink it anyway",
          emoji: "🥤",
          description: "Trust your instincts - if something seems wrong, don't drink it",
          isCorrect: false
        },
        {
          id: "a",
          text: "Ask what it is before drinking",
          emoji: "❓",
          description: "Always know what you're drinking and say no to alcohol",
          isCorrect: true
        },
        {
          id: "b",
          text: "Pretend to drink it",
          emoji: "🤐",
          description: "It's better to be honest about not wanting alcohol",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can you help a friend who is pressured to drink alcohol?",
      options: [
        {
          id: "b",
          text: "Encourage them to try it",
          emoji: "👍",
          description: "Help friends make healthy choices instead of harmful ones",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the situation",
          emoji: "🙈",
          description: "Good friends look out for each other's safety",
          isCorrect: false
        },
        {
          id: "a",
          text: "Suggest fun activities without alcohol",
          emoji: "🎮",
          description: "Offer healthy alternatives and support your friend's good choices",
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
    navigate("/student/health-male/kids/say-no-poster");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Alcohol Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-85"
      gameType="health-male"
      totalLevels={90}
      currentLevel={85}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
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

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
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

export default AlcoholStory;
