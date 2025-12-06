import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerPressureStory = () => {
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
      text: "Friends say 'Try smoking once.' Should you?",
      options: [
        {
          id: "a",
          text: "No, firmly refuse",
          emoji: "✋",
          description: "Standing firm against peer pressure protects your health",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, just once won't hurt",
          emoji: "🚬",
          description: "Even one time can start addiction and harm health",
          isCorrect: false
        },
        {
          id: "c",
          text: "Say I'll think about it",
          emoji: "🤔",
          description: "Delaying gives time to make healthy choices",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How do you respond when friends pressure you to smoke?",
      options: [
        {
          id: "a",
          text: "Walk away silently",
          emoji: "🚶",
          description: "Sometimes actions speak louder than words",
          isCorrect: false
        },
        {
          id: "b",
          text: "Explain health risks",
          emoji: "📚",
          description: "Educating friends can help them make better choices",
          isCorrect: true
        },
        {
          id: "c",
          text: "Give in to fit in",
          emoji: "😔",
          description: "True friends respect your healthy choices",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you do if peer pressure continues?",
      options: [
        {
          id: "a",
          text: "Find new friends",
          emoji: "👥",
          description: "Surrounding yourself with supportive people is important",
          isCorrect: true
        },
        {
          id: "b",
          text: "Start smoking to stop pressure",
          emoji: "🚬",
          description: "Giving in only creates more problems",
          isCorrect: false
        },
        {
          id: "c",
          text: "Keep saying maybe",
          emoji: "🤷",
          description: "Clear boundaries are needed",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can you help friends avoid smoking?",
      options: [
        {
          id: "a",
          text: "Share facts about smoking dangers",
          emoji: "📊",
          description: "Knowledge helps people make informed decisions",
          isCorrect: true
        },
        {
          id: "b",
          text: "Force them to stop",
          emoji: "🛑",
          description: "People change when ready, not when forced",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore their smoking",
          emoji: "🙈",
          description: "Supporting healthy choices helps friends",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What strengthens you against peer pressure?",
      options: [
        {
          id: "b",
          text: "Strong personal values",
          emoji: "💪",
          description: "Clear values help resist negative influences",
          isCorrect: true
        },
        {
          id: "c",
          text: "Going along with crowd",
          emoji: "👥",
          description: "Following values over crowd pressure builds character",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wanting to be popular",
          emoji: "⭐",
          description: "True respect comes from healthy choices",
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
    navigate("/student/health-male/teens/quiz-on-dangers");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Peer Pressure Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-81"
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

          <p className="text-white text-lg mb-6">
            {currentQ.text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {currentQ.options.map(option => (
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

export default PeerPressureStory;
