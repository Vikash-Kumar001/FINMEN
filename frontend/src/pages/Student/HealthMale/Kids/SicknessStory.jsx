import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SicknessStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You wake up with a high fever and feel very sick. What should you do?",
      options: [
        {
          id: "b",
          text: "Hide it and pretend to feel fine",
          emoji: "😊",
          description: "Hiding sickness can make you feel worse and spread germs",
          isCorrect: false
        },
        {
          id: "a",
          text: "Tell your parents right away",
          emoji: "🗣️",
          description: "Parents can help you get better and take care of you",
          isCorrect: true
        },
        {
          id: "c",
          text: "Go to school anyway",
          emoji: "🏫",
          description: "Stay home when sick to rest and avoid spreading germs",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your mom says you need to rest and drink lots of water. What's the best choice?",
      options: [
        {
          id: "c",
          text: "Refuse and keep playing",
          emoji: "🎮",
          description: "Rest helps your body fight the sickness",
          isCorrect: false
        },
        {
          id: "a",
          text: "Rest and drink water as told",
          emoji: "💧",
          description: "Following doctor's advice helps you get better faster",
          isCorrect: true
        },
        {
          id: "b",
          text: "Take medicine secretly",
          emoji: "💊",
          description: "Never take medicine without adult supervision",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your stomach hurts a lot and you feel like throwing up. What do you do?",
      options: [
        {
          id: "b",
          text: "Eat more food to feel better",
          emoji: "🍎",
          description: "When sick, it's better to eat light foods or rest",
          isCorrect: false
        },
        {
          id: "a",
          text: "Tell parents about the pain",
          emoji: "🤕",
          description: "Adults can help you feel better and get medical care if needed",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore it and keep playing",
          emoji: "😅",
          description: "Pain is your body's way of saying something needs attention",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "The doctor says you need to take medicine for a few days. How do you respond?",
      options: [
        {
          id: "c",
          text: "Stop taking it when you feel better",
          emoji: "✋",
          description: "Always finish medicine as prescribed by the doctor",
          isCorrect: false
        },
        {
          id: "a",
          text: "Take all the medicine as directed",
          emoji: "💊",
          description: "Following doctor's instructions completely helps you heal",
          isCorrect: true
        },
        {
          id: "b",
          text: "Share medicine with friends",
          emoji: "🤝",
          description: "Medicine should only be taken by the person it's prescribed for",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You have a bad cough that won't go away. What's the right action?",
      options: [
        {
          id: "b",
          text: "Hold in the cough",
          emoji: "😶",
          description: "Coughing helps clear your lungs - but see a doctor if it persists",
          isCorrect: false
        },
        {
          id: "a",
          text: "Tell parents and see a doctor",
          emoji: "👩‍⚕️",
          description: "Persistent symptoms need medical attention",
          isCorrect: true
        },
        {
          id: "c",
          text: "Drink lots of soda",
          emoji: "🥤",
          description: "Water and rest are better than sugary drinks when sick",
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
    navigate("/student/health-male/kids/prevention-first-poster");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Sickness Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-75"
      gameType="health-male"
      totalLevels={80}
      currentLevel={75}
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

export default SicknessStory;
