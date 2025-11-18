import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GamingPressureStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your friends want to skip class to play video games at the arcade. What should you do?",
      options: [
        {
          id: "b",
          text: "Skip class and go gaming",
          emoji: "🎮",
          description: "School is important - gaming can wait until after school",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and go to class",
          emoji: "🏫",
          description: "Choosing school shows responsibility and good priorities",
          isCorrect: true
        },
        {
          id: "c",
          text: "Go but come back quickly",
          emoji: "⚡",
          description: "Skipping any class time isn't responsible",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Friends pressure you to play games all night instead of sleeping. What's the healthy choice?",
      options: [
        {
          id: "c",
          text: "Play all night and sleep in class",
          emoji: "😴",
          description: "Sleep is essential for learning and health",
          isCorrect: false
        },
        {
          id: "a",
          text: "Set a time limit and get good sleep",
          emoji: "⏰",
          description: "Balance gaming with healthy sleep habits",
          isCorrect: true
        },
        {
          id: "b",
          text: "Play just a little longer",
          emoji: "🎯",
          description: "Bedtime rules help you stay healthy and focused",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Someone wants you to spend all your allowance on in-game purchases. What do you say?",
      options: [
        {
          id: "b",
          text: "Spend all the money",
          emoji: "💸",
          description: "Save money for things you really need",
          isCorrect: false
        },
        {
          id: "a",
          text: "Save money and play free games",
          emoji: "💰",
          description: "Smart money choices help you afford what you want",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ask parents for more money",
          emoji: "🙏",
          description: "It's better to make do with what you have",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Friends say you're not cool if you don't play the latest expensive game. What's your response?",
      options: [
        {
          id: "c",
          text: "Beg parents to buy it for you",
          emoji: "😢",
          description: "Coolness comes from character, not expensive games",
          isCorrect: false
        },
        {
          id: "a",
          text: "Play what you have and enjoy it",
          emoji: "😊",
          description: "Being yourself is cooler than following trends",
          isCorrect: true
        },
        {
          id: "b",
          text: "Feel bad about not having it",
          emoji: "😞",
          description: "Everyone has different things - be happy with yours",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your friends want you to lie about where you're going so you can game together. What do you do?",
      options: [
        {
          id: "b",
          text: "Lie to go gaming",
          emoji: "🤥",
          description: "Honesty builds trust - lying breaks it",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell them you can't lie",
          emoji: "🗣️",
          description: "Being honest shows integrity and strength",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and suggest honest alternatives",
          emoji: "🤝",
          description: "Honesty and creativity make better friendships",
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
    navigate("/student/health-male/kids/reflex-respect");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Gaming Pressure Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-68"
      gameType="health-male"
      totalLevels={70}
      currentLevel={68}
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

export default GamingPressureStory;
