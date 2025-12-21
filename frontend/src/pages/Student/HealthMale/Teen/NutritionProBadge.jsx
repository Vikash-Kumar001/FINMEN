import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NutritionProBadge = () => {
  const navigate = useNavigate();
  
  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-teen-20";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Muscle Builder",
      text: "Which nutrient builds muscle?",
      options: [
        {
          text: "Sugar",
          emoji: "🍬",
          isCorrect: false
        },
        {
          text: "Fat",
          emoji: "🥓",
          isCorrect: false
        },
        {
          text: "Protein",
          emoji: "🍗",
          isCorrect: true
        },
        {
          text: "Fiber",
          emoji: "🥦",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! Protein builds and repairs muscle.",
        wrong: "Protein is the key for muscle growth."
      }
    },
    {
      id: 2,
      title: "Energy Source",
      text: "Best source of long-lasting energy?",
      options: [
        {
          text: "Soda",
          emoji: "🥤",
          isCorrect: false
        },
        {
          text: "Candy",
          emoji: "🍭",
          isCorrect: false
        },
        {
          text: "Complex Carbs",
          emoji: "🌾",
          isCorrect: true
        },
        {
          text: "Ice Cream",
          emoji: "🍦",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Yes! Oats and rice give steady energy.",
        wrong: "Sugar gives a crash. Complex carbs last longer."
      }
    },
    {
      id: 3,
      title: "Hydration Hero",
      text: "What should you drink most?",
      options: [
        {
          text: "Juice",
          emoji: "🧃",
          isCorrect: false
        },
        {
          text: "Energy Drinks",
          emoji: "⚡",
          isCorrect: false
        },
        {
          text: "Water",
          emoji: "💧",
          isCorrect: false
        },
        {
          text: "Milk",
          emoji: "🥛",
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Exactly! Water is essential for life.",
        wrong: "Water is the best choice for hydration."
      }
    },
    {
      id: 4,
      title: "Bone Strength",
      text: "What makes bones strong?",
      options: [
        {
          text: "Iron",
          emoji: "🧲",
          isCorrect: false
        },
        {
          text: "Salt",
          emoji: "🧂",
          isCorrect: false
        },
        {
          text: "Calcium",
          emoji: "🦴",
          isCorrect: false
        },
        {
          text: "Vitamin D",
          emoji: "🌞",
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Right! Calcium builds strong bones.",
        wrong: "Calcium (from milk, greens) is for bones."
      }
    },
    {
      id: 5,
      title: "Junk Food",
      text: "How often should you eat junk food?",
      options: [
        {
          text: "Every day",
          emoji: "🔁",
          isCorrect: false
        },
        {
          text: "Never",
          emoji: "🚫",
          isCorrect: false
        },
        {
          text: "In moderation",
          emoji: "⚖️",
          isCorrect: true
        },
        {
          text: "Weekly",
          emoji: "📅",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Smart! Balance is key.",
        wrong: "Moderation allows treats without harming health."
      }
    }
  ];

  const handleChoice = (optionIndex) => {
    if (answered) return;

    setAnswered(true);
    setSelectedOptionIndex(optionIndex);
    resetFeedback();

    const selectedOption = questions[currentQuestion].options[optionIndex];
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    const isLastQuestion = currentQuestion === questions.length - 1;

    setTimeout(() => {
      if (isLastQuestion) {
        setGameFinished(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedOptionIndex(null);
      }
    }, 2000);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setGameFinished(false);
    setSelectedOptionIndex(null);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/puberty-story-teen");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Nutrition Pro Badge"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={10}
      showConfetti={gameFinished && score >= 4}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!gameFinished ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{maxScore}</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 text-center">
                {currentQ.title}
              </h2>
              
              <p className="text-xl text-white mb-8 text-center">
                {currentQ.text}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const showFeedback = answered;

                  let buttonClass = "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3";

                  if (showFeedback) {
                    if (isSelected) {
                      buttonClass = option.isCorrect
                        ? "bg-green-500 ring-4 ring-green-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3"
                        : "bg-red-500 ring-4 ring-red-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                    } else {
                      buttonClass = "bg-white/10 opacity-50 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleChoice(idx)}
                      disabled={showFeedback}
                      className={buttonClass}
                    >
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="font-bold text-lg">{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  currentQ.options[selectedOptionIndex]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {currentQ.options[selectedOptionIndex]?.isCorrect
                      ? currentQ.feedback.correct
                      : currentQ.feedback.wrong}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🥗</div>
                <h3 className="text-3xl font-bold text-white mb-4">Nutrition Pro Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about nutrition with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Nutrition Expert</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Muscle Building</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of protein for muscle growth and repair.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Energy Management</h4>
                    <p className="text-white/90 text-sm">
                      You know how to choose foods that provide sustained energy throughout the day.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Nutrition!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review nutritional guidelines to strengthen your knowledge and earn your badge.
                </p>
                <button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default NutritionProBadge;
