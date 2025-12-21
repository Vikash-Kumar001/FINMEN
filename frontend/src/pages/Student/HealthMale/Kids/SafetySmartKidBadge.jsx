import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafetySmartKidBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-kids-80";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Helmet Hero",
      text: "Why do we wear helmets?",
      options: [
        {
          text: "To look like an alien",
          emoji: "👽",
          isCorrect: false
        },
        {
          text: "To keep hair dry",
          emoji: "☂️",
          isCorrect: false
        },
        {
          text: "To protect our brain",
          emoji: "🧠",
          isCorrect: true
        },
        {
          text: "To look cool",
          emoji: "😎",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Helmets protect your most important body part - your brain!",
        wrong: "Helmets are safety gear designed to protect your head and brain from injury."
      }
    },
    {
      id: 2,
      title: "Stranger Safety",
      text: "What if a stranger offers you a ride?",
      options: [
        {
          text: "Get in the car",
          emoji: "🚗",
          isCorrect: false
        },
        {
          text: "Ask for candy first",
          emoji: "🍬",
          isCorrect: false
        },
        {
          text: "Say NO and run away",
          emoji: "🏃",
          isCorrect: true
        },
        {
          text: "Talk to them",
          emoji: "💬",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Never go with strangers. Run to a safe place and tell an adult.",
        wrong: "Never get in a car with a stranger. It's very dangerous!"
      }
    },
    {
      id: 3,
      title: "Healthy Body",
      text: "What keeps your body strong?",
      options: [
        {
          text: "Watching TV all day",
          emoji: "📺",
          isCorrect: false
        },
        {
          text: "Eating only cookies",
          emoji: "🍪",
          isCorrect: false
        },
        {
          text: "Playing video games",
          emoji: "🎮",
          isCorrect: false
        },
        {
          text: "Healthy food and exercise",
          emoji: "🥦",
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Great! Good food and moving your body keeps you strong and healthy!",
        wrong: "Your body needs nutritious food and exercise to grow strong."
      }
    },
    {
      id: 4,
      title: "Clean Hands",
      text: "When should you wash your hands?",
      options: [
        {
          text: "Before eating",
          emoji: "🍽️",
          isCorrect: true
        },
        {
          text: "Only once a week",
          emoji: "📅",
          isCorrect: false
        },
        {
          text: "Never",
          emoji: "🙅",
          isCorrect: false
        },
        {
          text: "After playing outside",
          emoji: "🌳",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Yes! Washing hands before eating stops germs from getting in your body.",
        wrong: "You should wash hands often, especially before eating and after using the bathroom."
      }
    },
    {
      id: 5,
      title: "Safety First",
      text: "What is the most important rule?",
      options: [
        {
          text: "Have fun no matter what",
          emoji: "🎉",
          isCorrect: false
        },
        {
          text: "Win every game",
          emoji: "🥇",
          isCorrect: false
        },
        {
          text: "Safety comes first",
          emoji: "✅",
          isCorrect: true
        },
        {
          text: "Be the fastest",
          emoji: "⚡",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "You got it! Having fun is great, but staying safe is always the most important thing!",
        wrong: "Safety is always number one. You can't have fun if you get hurt!"
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
      title="Safety Smart Kid Badge"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={80}
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
                <h3 className="text-3xl font-bold text-white mb-4">Safety Smart Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about staying safe with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Safety Smart Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Safety Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to recognize and respond to unsafe situations appropriately.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Decision Making</h4>
                    <p className="text-white/90 text-sm">
                      You know how to make smart choices that protect your health and wellbeing.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Safety!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review safety strategies to strengthen your knowledge and earn your badge.
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

export default SafetySmartKidBadge;
