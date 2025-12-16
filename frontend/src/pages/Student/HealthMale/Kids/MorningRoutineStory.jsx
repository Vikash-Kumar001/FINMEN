import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MorningRoutineStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-91";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "The sun is up! What is the first thing you should do?",
      options: [
        {
          id: "b",
          text: "Watch TV",
          emoji: "📺",
          description: "TV can wait until later.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Wake up and stretch",
          emoji: "🙆‍♂️",
          description: "Stretching wakes up your muscles!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Go back to sleep",
          emoji: "😴",
          description: "It's time to start the day!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You are hungry. What is a good breakfast?",
      options: [
        {
          id: "c",
          text: "Candy bar",
          emoji: "🍫",
          description: "Candy gives you a sugar crash.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Oatmeal and fruit",
          emoji: "🥣",
          description: "Healthy food gives you energy for the day!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Soda",
          emoji: "🥤",
          description: "Soda is not a breakfast food.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your teeth feel fuzzy. What do you do?",
      options: [
        {
          id: "b",
          text: "Eat an apple",
          emoji: "🍎",
          description: "Apples are good, but they don't clean teeth.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore it",
          emoji: "🤷",
          description: "Fuzzy teeth mean germs!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Brush them well",
          emoji: "🪥",
          description: "Brushing keeps your smile bright and healthy.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "It's time to get dressed. What do you wear?",
      options: [
        {
          id: "c",
          text: "Dirty pajamas",
          emoji: "👚",
          description: "Put on fresh clothes for a fresh day.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Clean clothes",
          emoji: "👕",
          description: "Clean clothes make you feel good!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Swimsuit",
          emoji: "🩳",
          description: "Only if you are going swimming!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You are ready for school. What do you grab?",
      options: [
        {
          id: "b",
          text: "Toys",
          emoji: "🧸",
          description: "Toys stay at home.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing",
          emoji: "💨",
          description: "You need your supplies!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Backpack and lunch",
          emoji: "🎒",
          description: "Being prepared helps you learn.",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;
    
    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    const isLastQuestion = currentQuestion === questions.length - 1;
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/quiz-daily-habits");
  };

  return (
    <GameShell
      title="Morning Routine Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default MorningRoutineStory;
