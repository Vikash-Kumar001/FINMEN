import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SleepStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "It's getting late and your phone has fun games. Your mom says 'Time for bed.' What should you do?",
      options: [
        {
          id: "b",
          text: "Play phone all night",
          emoji: "📱",
          description: "Screen time before bed makes it hard to fall asleep",
          isCorrect: false
        },
        {
          id: "a",
          text: "Put phone away and sleep early",
          emoji: "😴",
          description: "Early bedtime helps your body rest and grow properly",
          isCorrect: true
        },
        {
          id: "c",
          text: "Play just a little longer",
          emoji: "⏰",
          description: "Consistent bedtime helps you wake up feeling great",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend wants to stay up late watching movies. What's the healthy choice?",
      options: [
        {
          id: "c",
          text: "Stay up late with friend",
          emoji: "🎬",
          description: "Sleep is more important than staying up late",
          isCorrect: false
        },
        {
          id: "a",
          text: "Go to bed on time",
          emoji: "🌙",
          description: "Good sleep helps you learn and play better the next day",
          isCorrect: true
        },
        {
          id: "b",
          text: "Watch just one movie",
          emoji: "🍿",
          description: "Even one late night can make you tired the next day",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You feel sleepy in class because you stayed up late. What should you do tonight?",
      options: [
        {
          id: "b",
          text: "Stay up late again",
          emoji: "📱",
          description: "Breaking the cycle by going to bed early helps",
          isCorrect: false
        },
        {
          id: "a",
          text: "Go to bed early to catch up",
          emoji: "⏰",
          description: "Extra sleep helps your body and brain recover",
          isCorrect: true
        },
        {
          id: "c",
          text: "Take a nap after school",
          emoji: "😴",
          description: "Consistent bedtime is better than daytime naps",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your parents say 'No screens in bed.' Why is this a good rule?",
      options: [
        {
          id: "c",
          text: "Screens are too bright",
          emoji: "💡",
          description: "Screens also affect your brain's sleep signals",
          isCorrect: false
        },
        {
          id: "a",
          text: "Screens make it hard to fall asleep",
          emoji: "🧠",
          description: "Screen light tells your brain to stay awake",
          isCorrect: true
        },
        {
          id: "b",
          text: "Screens are expensive",
          emoji: "💰",
          description: "The real reason is about healthy sleep patterns",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How does getting enough sleep make you feel?",
      options: [
        {
          id: "b",
          text: "More tired and grumpy",
          emoji: "😠",
          description: "Good sleep actually makes you energetic and happy",
          isCorrect: false
        },
        {
          id: "a",
          text: "Energetic and ready to learn",
          emoji: "⚡",
          description: "Sleep gives you the energy to do your best every day",
          isCorrect: true
        },
        {
          id: "c",
          text: "Bored and lazy",
          emoji: "😑",
          description: "Well-rested kids are active and excited to learn",
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
    navigate("/student/health-male/kids/good-habits-poster");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Sleep Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-95"
      gameType="health-male"
      totalLevels={100}
      currentLevel={95}
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

export default SleepStory;
