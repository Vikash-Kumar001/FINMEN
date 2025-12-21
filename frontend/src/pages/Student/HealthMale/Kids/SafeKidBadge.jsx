import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafeKidBadge = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-kids-90";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Say No",
      text: "What is the best way to refuse bad things?",
      options: [
        {
          text: "Maybe later",
          emoji: "⏰",
          isCorrect: false
        },
        {
          text: "Smile and take it",
          emoji: "😊",
          isCorrect: false
        },
        {
          text: "Say NO clearly",
          emoji: "✋",
          isCorrect: true
        },
        {
          text: "Run away silently",
          emoji: "🏃",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! Being clear and firm is the best way to say no.",
        wrong: "You need to be clear so they know you mean it."
      }
    },
    {
      id: 2,
      title: "Healthy Body",
      text: "What should you put in your body?",
      options: [
        {
          text: "Smoke",
          emoji: "🚬",
          isCorrect: false
        },
        {
          text: "Alcohol",
          emoji: "🍷",
          isCorrect: false
        },
        {
          text: "Junk food only",
          emoji: "🍟",
          isCorrect: false
        },
        {
          text: "Healthy Food & Water",
          emoji: "🍎",
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Yes! Healthy food and water make you strong.",
        wrong: "Smoke and alcohol hurt your body."
      }
    },
    {
      id: 3,
      title: "Peer Pressure",
      text: "What if friends pressure you?",
      options: [
        {
          text: "Do it to fit in",
          emoji: "👥",
          isCorrect: false
        },
        {
          text: "Leave and tell an adult",
          emoji: "🚪",
          isCorrect: true
        },
        {
          text: "Get angry",
          emoji: "😠",
          isCorrect: false
        },
        {
          text: "Ignore them completely",
          emoji: "🤐",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Leave the situation and find a safe adult.",
        wrong: "Don't give in to pressure. Your safety matters more."
      }
    },
    {
      id: 4,
      title: "Medicine Safety",
      text: "Who gives you medicine?",
      options: [
        {
          text: "Parents or Doctors",
          emoji: "👨‍⚕️",
          isCorrect: true
        },
        {
          text: "Friends",
          emoji: "👦",
          isCorrect: false
        },
        {
          text: "Strangers",
          emoji: "👤",
          isCorrect: false
        },
        {
          text: "Take it yourself",
          emoji: "💊",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! Only trust parents or doctors with medicine.",
        wrong: "Never take medicine from friends or strangers."
      }
    },
    {
      id: 5,
      title: "Stay Safe",
      text: "What makes you a Safe Kid?",
      options: [
        {
          text: "Taking risks",
          emoji: "🎢",
          isCorrect: false
        },
        {
          text: "Following others",
          emoji: "👣",
          isCorrect: false
        },
        {
          text: "Making smart choices",
          emoji: "🧠",
          isCorrect: true
        },
        {
          text: "Keeping secrets",
          emoji: "🤫",
          isCorrect: false
        }
      ],
      feedback: {
        correct: "You got it! Smart choices keep you safe and happy!",
        wrong: "Being safe means thinking for yourself and making good choices."
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
      title="Safe Kid Badge"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={90}
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
                <h3 className="text-3xl font-bold text-white mb-4">Safe Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about staying safe with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Safe Kid Expert</p>
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

export default SafeKidBadge;
