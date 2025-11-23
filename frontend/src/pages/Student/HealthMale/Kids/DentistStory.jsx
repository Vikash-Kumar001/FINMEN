import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DentistStory = () => {
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
      text: "The doctor says you should visit the dentist twice a year for check-ups. What should you do?",
      options: [
        {
          id: "b",
          text: "Say you'll go when your teeth hurt",
          emoji: "😬",
          description: "Regular check-ups prevent problems before they hurt",
          isCorrect: false
        },
        {
          id: "a",
          text: "Go for regular check-ups as recommended",
          emoji: "🦷",
          description: "Regular dental visits keep your teeth healthy and catch problems early",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ask if you can skip this year",
          emoji: "🤷",
          description: "Regular dental care prevents bigger problems later",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "At the dentist, they say you need to floss daily. What's the right response?",
      options: [
        {
          id: "c",
          text: "Say you don't like flossing",
          emoji: "😞",
          description: "Flossing removes food and plaque between teeth",
          isCorrect: false
        },
        {
          id: "a",
          text: "Start flossing every day",
          emoji: "🦷",
          description: "Daily flossing keeps your teeth and gums healthy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Promise to floss sometimes",
          emoji: "🤏",
          description: "Consistent daily habits work best for dental health",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "The dentist finds a small cavity and needs to fill it. How do you feel?",
      options: [
        {
          id: "b",
          text: "Scared of the drill",
          emoji: "😨",
          description: "It's normal to feel scared, but fixing cavities prevents bigger problems",
          isCorrect: false
        },
        {
          id: "a",
          text: "Glad to get it fixed before it gets worse",
          emoji: "😊",
          description: "Early treatment prevents pain and saves teeth",
          isCorrect: true
        },
        {
          id: "c",
          text: "Mad at the dentist",
          emoji: "😠",
          description: "Dentists help keep your teeth healthy - they're on your side",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your dentist says you should use fluoride toothpaste. Why is this important?",
      options: [
        {
          id: "c",
          text: "It makes teeth look whiter",
          emoji: "✨",
          description: "Fluoride strengthens tooth enamel and prevents cavities",
          isCorrect: false
        },
        {
          id: "a",
          text: "It strengthens teeth and prevents cavities",
          emoji: "🛡️",
          description: "Fluoride makes teeth stronger and more resistant to decay",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's just what everyone uses",
          emoji: "👥",
          description: "Fluoride has real health benefits for your teeth",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "The dentist gives you a new toothbrush and says to replace it every 3 months. What do you do?",
      options: [
        {
          id: "b",
          text: "Keep using the old one longer",
          emoji: "🪥",
          description: "Old toothbrushes don't clean as well and can harbor germs",
          isCorrect: false
        },
        {
          id: "a",
          text: "Replace your toothbrush regularly",
          emoji: "🔄",
          description: "Fresh toothbrushes clean better and stay germ-free",
          isCorrect: true
        },
        {
          id: "c",
          text: "Use it until the bristles are bent",
          emoji: "📏",
          description: "Replace before bristles get damaged for best cleaning",
          isCorrect: false
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
    navigate("/student/health-male/kids/reflex-healthy-steps");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Dentist Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-78"
      gameType="health-male"
      totalLevels={80}
      currentLevel={78}
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

export default DentistStory;
