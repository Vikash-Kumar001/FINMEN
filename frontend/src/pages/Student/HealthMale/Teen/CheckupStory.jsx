import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CheckupStory = () => {
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
      text: "You feel weak often and tired all the time. What should you do?",
      options: [
        {
          id: "a",
          text: "Ignore it and push through",
          emoji: "💪",
          description: "Ignoring symptoms can lead to bigger health problems",
          isCorrect: false
        },
        {
          id: "b",
          text: "Schedule a health checkup",
          emoji: "🏥",
          description: "Regular checkups help identify and prevent health issues",
          isCorrect: true
        },
        {
          id: "c",
          text: "Just rest more",
          emoji: "😴",
          description: "While rest helps, professional checkup is important",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "At the doctor's office, you're nervous. How do you respond?",
      options: [
        {
          id: "a",
          text: "Be honest about symptoms",
          emoji: "💬",
          description: "Honesty helps doctors give proper diagnosis",
          isCorrect: true
        },
        {
          id: "b",
          text: "Downplay your concerns",
          emoji: "😅",
          description: "Being open helps get the right treatment",
          isCorrect: false
        },
        {
          id: "c",
          text: "Leave without talking",
          emoji: "🚪",
          description: "Communication is key for good healthcare",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Doctor recommends follow-up tests. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Skip some tests",
          emoji: "🤷",
          description: "All tests are important for complete health picture",
          isCorrect: false
        },
        {
          id: "b",
          text: "Follow all recommendations",
          emoji: "✅",
          description: "Following medical advice prevents complications",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore recommendations",
          emoji: "❌",
          description: "Professional advice should be followed for health",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How often should teens get routine checkups?",
      options: [
        {
          id: "a",
          text: "Only when sick",
          emoji: "🤒",
          description: "Preventive checkups catch issues early",
          isCorrect: false
        },
        {
          id: "b",
          text: "Every few years",
          emoji: "⏰",
          description: "More frequent checkups are better for teens",
          isCorrect: false
        },
        {
          id: "c",
          text: "Annually for preventive care",
          emoji: "📅",
          description: "Regular checkups help maintain good health",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "After checkup, doctor gives health tips. What should you do?",
      options: [
        {
          id: "a",
          text: "Follow the advice immediately",
          emoji: "💯",
          description: "Implementing healthy changes improves well-being",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wait and see",
          emoji: "⏳",
          description: "Acting on advice prevents future issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the suggestions",
          emoji: "🙈",
          description: "Professional advice should be valued",
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
    navigate("/student/health-male/teens/quiz-preventive-health");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Checkup Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-71"
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

export default CheckupStory;
