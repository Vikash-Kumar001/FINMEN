import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyHygieneStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Should you bathe daily during puberty?",
      options: [
        {
          id: "a",
          text: "Yes, daily bathing is important",
          emoji: "🛁",
          description: "Daily bathing helps remove sweat and bacteria that cause body odor",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, bathing too often is harmful",
          emoji: "🚫",
          description: "Regular bathing is healthy and doesn't harm the skin",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only when visibly dirty",
          emoji: "👀",
          description: "Sweat and bacteria can make you smell even if you look clean",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "During puberty, your skin gets oilier. What's the best routine?",
      options: [
        {
          id: "a",
          text: "Scrub face vigorously to remove oil",
          emoji: "🔥",
          description: "Harsh scrubbing can irritate skin and increase oil production",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wash face twice daily with gentle cleanser",
          emoji: "🧼",
          description: "Gentle face washing twice a day helps prevent acne without over-drying",
          isCorrect: true
        },
        {
          id: "c",
          text: "Skip face washing to avoid irritation",
          emoji: "😴",
          description: "Not washing allows oil and dirt to build up, causing more breakouts",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "During periods, how often should you change sanitary products?",
      options: [
        {
          id: "a",
          text: "Only when completely soaked",
          emoji: "🌊",
          description: "Waiting too long increases infection risk and odor",
          isCorrect: false
        },
        {
          id: "b",
          text: "Every 4-6 hours or when soiled",
          emoji: "⏰",
          description: "Regular changing prevents bacterial growth and odor",
          isCorrect: true
        },
        {
          id: "c",
          text: "Once a day is enough",
          emoji: "📅",
          description: "Once daily is not sufficient during menstruation",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You notice body hair growing during puberty. What do you do?",
      options: [
        {
          id: "a",
          text: "Start shaving immediately without guidance",
          emoji: "🪒",
          description: "It's important to learn proper techniques to avoid cuts and irritation",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ignore body hair completely",
          emoji: "🤷",
          description: "Body hair is natural and normal, but hygiene is still important",
          isCorrect: false
        },
        {
          id: "c",
          text: "Learn safe grooming habits if desired",
          emoji: "✂️",
          description: "If you choose to groom, learn safe techniques from trusted adults",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "During puberty, you notice changes in your body. How do you respond?",
      options: [
        {
          id: "a",
          text: "Feel embarrassed about changes",
          emoji: "😳",
          description: "Puberty is normal and happens to everyone, so there's no need for embarrassment",
          isCorrect: false
        },
        {
          id: "b",
          text: "Learn about body changes positively",
          emoji: "📚",
          description: "Understanding puberty helps you feel confident and prepared",
          isCorrect: true
        },
        {
          id: "c",
          text: "Hide changes from others",
          emoji: "🙈",
          description: "It's okay to talk about puberty with trusted adults",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/health-female/teens/quiz-hygiene-needs");
  };

  return (
    <GameShell
      title="Puberty Hygiene Story"
      subtitle={`Level 1 of 10`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-1"
      gameType="health-female"
      totalLevels={10}
      currentLevel={1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 1/10</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
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

export default PubertyHygieneStory;