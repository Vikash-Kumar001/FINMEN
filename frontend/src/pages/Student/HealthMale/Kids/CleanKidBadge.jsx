import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CleanKidBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-kids-10";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Hand Washing",
      text: "When is the most important time to wash hands?",
      options: [
        {
          text: "Before eating and after bathroom",
          emoji: "🧼",
          isCorrect: true
        },
        {
          text: "Only when they look dirty",
          emoji: "🧐",
          isCorrect: false
        },
        {
          text: "Once a week",
          emoji: "📅",
          isCorrect: false
        },
        {
          text: "Never wash hands",
          emoji: "🚫",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Washing hands before eating and after the bathroom stops germs!",
        wrong: "You should wash hands before eating and after using the bathroom, even if they look clean!"
      }
    },
    {
      id: 2,
      title: "Daily Bath",
      text: "Why do we take a bath every day?",
      options: [
        {
          text: "To play with water",
          emoji: "🛁",
          isCorrect: false
        },
        {
          text: "Because mom says so",
          emoji: "👩",
          isCorrect: false
        },
        {
          text: "To remove dirt and sweat",
          emoji: "🚿",
          isCorrect: true
        },
        {
          text: "To stay wet",
          emoji: "💦",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Baths remove dirt, sweat, and germs to keep you healthy!",
        wrong: "While playing is fun, the main reason is to clean dirt and sweat off your body!"
      }
    },
    {
      id: 3,
      title: "Brushing Teeth",
      text: "How long should you brush your teeth?",
      options: [
        {
          text: "10 seconds",
          emoji: "⏱️",
          isCorrect: false
        },
        {
          text: "1 hour",
          emoji: "⏰",
          isCorrect: false
        },
        {
          text: "30 minutes",
          emoji: "⏳",
          isCorrect: false
        },
        {
          text: "2 minutes",
          emoji: "🦷",
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Amazing! 2 minutes is the perfect time to get all teeth clean!",
        wrong: "You need to brush for about 2 minutes to make sure every tooth is clean!"
      }
    },
    {
      id: 4,
      title: "Clean Clothes",
      text: "What should you do with dirty clothes?",
      options: [
        {
          text: "Wear them again",
          emoji: "👕",
          isCorrect: false
        },
        {
          text: "Put them in the laundry",
          emoji: "🧺",
          isCorrect: true
        },
        {
          text: "Hide them",
          emoji: "弆",
          isCorrect: false
        },
        {
          text: "Throw them away",
          emoji: "🗑️",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great! Dirty clothes go in the laundry to be washed!",
        wrong: "Dirty clothes should be washed, not worn again or hidden!"
      }
    },
    {
      id: 5,
      title: "Confidence",
      text: "How does being clean make you feel?",
      options: [
        {
          text: "Tired",
          emoji: "😴",
          isCorrect: false
        },
        {
          text: "Fresh and Confident",
          emoji: "😊",
          isCorrect: true
        },
        {
          text: "Sad",
          emoji: "😢",
          isCorrect: false
        },
        {
          text: "Angry",
          emoji: "😠",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Good hygiene makes you feel fresh, happy, and confident!",
        wrong: "Being clean usually makes you feel fresh and confident, not tired or sad!"
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
    navigate("/games/health-male/kids");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Badge: Clean Kid"
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
      backPath="/games/health-male/kids"
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
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Clean Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about personal hygiene with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Clean Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Hygiene Habits</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of hand washing, bathing, and dental care for staying healthy.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Confidence Boost</h4>
                    <p className="text-white/90 text-sm">
                      You know that good hygiene makes you feel fresh, happy, and confident.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Personal Hygiene!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review personal hygiene practices to strengthen your knowledge and earn your badge.
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

export default CleanKidBadge;
