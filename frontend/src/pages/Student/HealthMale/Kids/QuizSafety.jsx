import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizSafety = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Why should you wash your hands before eating?",
      options: [
        {
          id: "a",
          text: "To remove germs from your hands",
          emoji: "🧼",
          description: "Washing removes germs that could make you sick",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just because it's tradition",
          emoji: "📜",
          description: "Handwashing prevents illness by removing harmful germs",
          isCorrect: false
        },
        {
          id: "c",
          text: "To make hands smell good",
          emoji: "🌸",
          description: "Clean hands prevent sickness, even if they don't smell",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should you do when you cross the street?",
      options: [
        {
          id: "c",
          text: "Run quickly to the other side",
          emoji: "🏃",
          description: "Always look both ways and use crosswalks safely",
          isCorrect: false
        },
        {
          id: "a",
          text: "Look both ways and wait for green light",
          emoji: "🚦",
          description: "Safety first - always check traffic before crossing",
          isCorrect: true
        },
        {
          id: "b",
          text: "Follow whoever is closest",
          emoji: "👥",
          description: "Make your own safe choices when crossing streets",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is it important to wear a helmet when riding a bike?",
      options: [
        {
          id: "b",
          text: "It makes you look cool",
          emoji: "😎",
          description: "Helmets protect your head from serious injury",
          isCorrect: false
        },
        {
          id: "a",
          text: "It protects your head if you fall",
          emoji: "⛑️",
          description: "Helmets prevent brain injuries during accidents",
          isCorrect: true
        },
        {
          id: "c",
          text: "It's just a rule to follow",
          emoji: "📋",
          description: "Safety rules protect you from real dangers",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you do if you feel sick?",
      options: [
        {
          id: "c",
          text: "Hide it and pretend to feel fine",
          emoji: "😊",
          description: "Tell a trusted adult so you can get help",
          isCorrect: false
        },
        {
          id: "a",
          text: "Tell your parents or teacher",
          emoji: "🗣️",
          description: "Adults can help you feel better and stay healthy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it and keep playing",
          emoji: "🎮",
          description: "Rest helps your body fight illness",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why should you brush your teeth twice a day?",
      options: [
        {
          id: "b",
          text: "It makes your smile look pretty",
          emoji: "😁",
          description: "Brushing prevents cavities and keeps teeth healthy",
          isCorrect: false
        },
        {
          id: "a",
          text: "It removes germs and prevents cavities",
          emoji: "🦷",
          description: "Good dental care prevents tooth decay and pain",
          isCorrect: true
        },
        {
          id: "c",
          text: "It's just what everyone does",
          emoji: "👥",
          description: "Daily brushing maintains oral health",
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
    navigate("/student/health-male/kids/reflex-safety");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Safety"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-72"
      gameType="health-male"
      totalLevels={80}
      currentLevel={72}
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

export default QuizSafety;
