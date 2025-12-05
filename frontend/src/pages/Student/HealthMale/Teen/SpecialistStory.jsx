import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SpecialistStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const questions = [
    {
      id: 1,
      text: "You have severe acne that won't go away. Should you see a dermatologist?",
      options: [
        {
          id: "a",
          text: "Try random home remedies",
          emoji: "🧴",
          description: "Professional medical advice is more effective",
          isCorrect: false
        },
        {
          id: "b",
          text: "Yes, get professional help",
          emoji: "🏥",
          description: "Dermatologists specialize in skin conditions like acne",
          isCorrect: true
        },
        {
          id: "c",
          text: "Wait and hope it improves",
          emoji: "⏰",
          description: "Professional treatment is often needed for severe acne",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should you tell the dermatologist about your acne?",
      options: [
        {
          id: "a",
          text: "Be completely honest about symptoms",
          emoji: "💬",
          description: "Honest information helps get proper treatment",
          isCorrect: true
        },
        {
          id: "b",
          text: "Minimize the problem",
          emoji: "😅",
          description: "Accurate information leads to better care",
          isCorrect: false
        },
        {
          id: "c",
          text: "Exaggerate for attention",
          emoji: "📢",
          description: "Honest communication is best for healthcare",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Dermatologist prescribes treatment. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Use only when convenient",
          emoji: "📅",
          description: "Consistent treatment is important for skin health",
          isCorrect: false
        },
        {
          id: "b",
          text: "Follow instructions exactly",
          emoji: "✅",
          description: "Proper use of prescribed treatments gives best results",
          isCorrect: true
        },
        {
          id: "c",
          text: "Stop if no immediate results",
          emoji: "⏹️",
          description: "Treatment takes time to show improvement",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How often should you follow up with the specialist?",
      options: [
        {
          id: "a",
          text: "Skip follow-ups",
          emoji: "❌",
          description: "Regular check-ins monitor treatment progress",
          isCorrect: false
        },
        {
          id: "b",
          text: "Go only if problems worsen",
          emoji: "📈",
          description: "Preventive follow-ups help maintain skin health",
          isCorrect: false
        },
        {
          id: "c",
          text: "As recommended by doctor",
          emoji: "📋",
          description: "Following professional recommendations ensures best care",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What should you do if treatment causes side effects?",
      options: [
        {
          id: "a",
          text: "Contact the dermatologist immediately",
          emoji: "📞",
          description: "Professional guidance helps manage side effects safely",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stop treatment on your own",
          emoji: "⏹️",
          description: "Always consult healthcare provider before changing treatment",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore minor side effects",
          emoji: "🤷",
          description: "Side effects should be monitored by professionals",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (gameFinished) return;

    const currentQ = questions[currentQuestion];
    const selectedOption = currentQ.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1000);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/doctor-fear-debate");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Specialist Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-75"
      gameType="health-male"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {score}</span>
          </div>

          <p className="text-white text-lg mb-6 font-medium">
            {currentQ.text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {currentQ.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left border border-white/10"
              >
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
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

export default SpecialistStory;
