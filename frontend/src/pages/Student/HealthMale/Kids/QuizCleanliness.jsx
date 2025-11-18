import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizCleanliness = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What is the best daily hygiene habit?",
      options: [
        {
          id: "a",
          text: "Take a bath daily",
          emoji: "🛁",
          description: "Daily baths remove dirt and keep you fresh",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wear the same dirty shirt",
          emoji: "👕",
          description: "Clean clothes help prevent skin problems",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip brushing teeth",
          emoji: "🪥",
          description: "Brushing prevents cavities and bad breath",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How often should you brush your teeth?",
      options: [
        {
          id: "a",
          text: "Once a week",
          emoji: "📅",
          description: "Not enough to keep teeth healthy",
          isCorrect: false
        },
        {
          id: "b",
          text: "Twice a day",
          emoji: "✨",
          description: "Morning and night keeps teeth clean",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only when they hurt",
          emoji: "😬",
          description: "Brush before problems start",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you do after playing outside?",
      options: [
        {
          id: "a",
          text: "Take a shower",
          emoji: "🚿",
          description: "Removes dirt, sweat, and germs from playing",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just change clothes",
          emoji: "👔",
          description: "Still need to clean your body",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing special",
          emoji: "😴",
          description: "Outdoor play makes you dirty and sweaty",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's important for keeping nails clean?",
      options: [
        {
          id: "a",
          text: "Cut them regularly",
          emoji: "✂️",
          description: "Prevents dirt buildup and infections",
          isCorrect: true
        },
        {
          id: "b",
          text: "Paint them colorful",
          emoji: "💅",
          description: "Looks nice but doesn't clean them",
          isCorrect: false
        },
        {
          id: "c",
          text: "Bite them short",
          emoji: "🦷",
          description: "Biting can cause infections and pain",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why should you comb your hair daily?",
      options: [
        {
          id: "a",
          text: "To look neat and tidy",
          emoji: "💇",
          description: "Clean hair looks good and feels good",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hair doesn't need combing",
          emoji: "😕",
          description: "Regular combing prevents tangles and dirt",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only for special occasions",
          emoji: "🎉",
          description: "Daily grooming is important for hygiene",
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
        // Game finished - trigger GameOverModal
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/reflex-hygiene");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Cleanliness"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-2"
      gameType="health-male"
      totalLevels={10}
      currentLevel={2}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
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

export default QuizCleanliness;
