import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { Award, Heart, Brain, Shield, Star, Smile } from "lucide-react";

const EmotionSmartTeenBadge = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const questions = [
    {
      id: 1,
      text: "What is emotional intelligence?",
      icon: <Brain className="w-12 h-12 text-purple-400" />,
      options: [
        {
          id: "b",
          text: "Being smart at math",
          isCorrect: false
        },
        {
          id: "a",
          text: "Understanding & managing emotions",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignoring emotions",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why is empathy important?",
      icon: <Heart className="w-12 h-12 text-red-400" />,
      options: [
        {
          id: "a",
          text: "Connects us to others",
          isCorrect: true
        },
        {
          id: "b",
          text: "Makes you weak",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wastes time",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How to handle rejection?",
      icon: <Shield className="w-12 h-12 text-blue-400" />,
      options: [
        {
          id: "b",
          text: "Seek revenge",
          isCorrect: false
        },
        {
          id: "c",
          text: "Give up forever",
          isCorrect: false
        },
        {
          id: "a",
          text: "Accept and move on",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What is a healthy boundary?",
      icon: <Star className="w-12 h-12 text-yellow-400" />,
      options: [
        {
          id: "a",
          text: "Saying no when needed",
          isCorrect: true
        },
        {
          id: "b",
          text: "Always saying yes",
          isCorrect: false
        },
        {
          id: "c",
          text: "Never talking to anyone",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Self-care includes...",
      icon: <Smile className="w-12 h-12 text-green-400" />,
      options: [
        {
          id: "b",
          text: "Working 24/7",
          isCorrect: false
        },
        {
          id: "a",
          text: "Rest and hobbies",
          isCorrect: true
        },
        {
          id: "c",
          text: "Eating junk food only",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/health-male/teens");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Badge: Emotion Smart Teen"
      subtitle={!gameFinished ? `Question ${currentQuestion + 1} of ${questions.length}` : "Badge Earned!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-60"
      gameType="health-male"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!gameFinished ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
              <span className="text-yellow-400 font-bold">Score: {score}</span>
            </div>

            <div className="flex flex-col items-center mb-8">
              <div className="mb-4 p-4 bg-white/10 rounded-full">
                {currentQ.icon}
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-2">
                {currentQ.text}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentQ.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.isCorrect)}
                  disabled={answered}
                  className={`p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 text-left ${answered
                      ? option.isCorrect
                        ? "bg-green-500/50 border-2 border-green-400 text-white"
                        : "bg-white/10 opacity-50 text-white"
                      : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg"
                    }`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="mb-6 inline-block p-6 bg-yellow-400/20 rounded-full">
              <Award className="w-24 h-24 text-yellow-400" />
            </div>

            <h3 className="text-3xl font-bold text-white mb-4">Emotion Smart Teen Badge Earned!</h3>
            <p className="text-xl text-white/90 mb-6">
              You scored {score} out of {questions.length}!
            </p>

            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full py-3 px-8 inline-block mb-8 shadow-lg">
              <span className="text-white font-bold text-xl tracking-wider">EMOTION SMART TEEN</span>
            </div>

            <p className="text-white/80 mb-8 max-w-md mx-auto">
              You've mastered the basics of emotional intelligence. Keep practicing empathy and self-care!
            </p>

            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Back to Menu
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmotionSmartTeenBadge;
