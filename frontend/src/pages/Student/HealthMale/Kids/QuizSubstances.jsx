import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizSubstances = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which of these is harmful to your body?",
      options: [
        {
          id: "b",
          text: "Cigarettes",
          emoji: "🚬",
          description: "Cigarettes contain harmful chemicals that damage lungs",
          isCorrect: true
        },
        {
          id: "a",
          text: "Fruits",
          emoji: "🍎",
          description: "Fruits are healthy and give you vitamins",
          isCorrect: false
        },
        {
          id: "c",
          text: "Milk",
          emoji: "🥛",
          description: "Milk helps build strong bones",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What happens when you smoke cigarettes?",
      options: [
        {
          id: "c",
          text: "Your lungs get stronger",
          emoji: "💪",
          description: "Smoking actually damages lungs and makes breathing hard",
          isCorrect: false
        },
        {
          id: "a",
          text: "Your lungs get damaged",
          emoji: "🫁",
          description: "Cigarettes harm lungs and make it hard to breathe",
          isCorrect: true
        },
        {
          id: "b",
          text: "Nothing happens",
          emoji: "😑",
          description: "Smoking causes serious health problems",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is alcohol dangerous for kids?",
      options: [
        {
          id: "b",
          text: "It makes you taller",
          emoji: "📏",
          description: "Alcohol harms growing bodies and brains",
          isCorrect: false
        },
        {
          id: "a",
          text: "It harms growing bodies and brains",
          emoji: "🧠",
          description: "Kids' bodies and brains are still developing",
          isCorrect: true
        },
        {
          id: "c",
          text: "It gives you energy",
          emoji: "⚡",
          description: "Alcohol actually makes you tired and confused",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you do if someone offers you drugs?",
      options: [
        {
          id: "a",
          text: "Say no and walk away",
          emoji: "🚶",
          description: "Drugs are dangerous and illegal for kids",
          isCorrect: true
        },
        {
          id: "c",
          text: "Try a little to be polite",
          emoji: "🤏",
          description: "Even small amounts of drugs can harm you",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask what it does first",
          emoji: "❓",
          description: "The answer is always no to drugs",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which is the healthiest choice?",
      options: [
        {
          id: "b",
          text: "Smoking cigarettes",
          emoji: "🚬",
          description: "Fresh air and exercise are much healthier",
          isCorrect: false
        },
        {
          id: "c",
          text: "Drinking alcohol",
          emoji: "🍺",
          description: "Water and healthy activities are better choices",
          isCorrect: false
        },
        {
          id: "a",
          text: "Playing sports and eating healthy",
          emoji: "🏃",
          description: "Healthy activities keep your body strong",
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
    navigate("/student/health-male/kids/reflex-safe-choice");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Substances"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-82"
      gameType="health-male"
      totalLevels={90}
      currentLevel={82}
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

export default QuizSubstances;
