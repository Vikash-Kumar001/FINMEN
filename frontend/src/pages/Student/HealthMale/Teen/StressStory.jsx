import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StressStory = () => {
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
      text: "Exams are coming and you feel stressed. Should you study nonstop?",
      options: [
        {
          id: "b",
          text: "Study nonstop",
          emoji: "📚",
          description: "Nonstop studying can cause burnout and reduce focus",
          isCorrect: false
        },
        {
          id: "a",
          text: "Take regular breaks",
          emoji: "⏸️",
          description: "Breaks help your brain rest and improve memory retention",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore exams completely",
          emoji: "😴",
          description: "Preparation is important, but balance is key",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "During study breaks, what should you do?",
      options: [
        {
          id: "a",
          text: "Go for a short walk",
          emoji: "🚶",
          description: "Physical activity reduces stress and clears the mind",
          isCorrect: true
        },
        {
          id: "b",
          text: "Watch TV all break",
          emoji: "📺",
          description: "Too much screen time can increase stress",
          isCorrect: false
        },
        {
          id: "c",
          text: "Study more during breaks",
          emoji: "📖",
          description: "Breaks need to be true rest periods",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How long should study sessions be for best results?",
      options: [
        {
          id: "c",
          text: "Hours without breaks",
          emoji: "⏰",
          description: "Long sessions without breaks reduce efficiency",
          isCorrect: false
        },
        {
          id: "a",
          text: "45-60 minutes with breaks",
          emoji: "🕐",
          description: "Pomodoro technique helps maintain focus",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only when you feel like it",
          emoji: "🤷",
          description: "Consistent schedule is better for stress management",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You feel overwhelmed by too many tasks. What helps?",
      options: [
        {
          id: "a",
          text: "Make a to-do list",
          emoji: "📝",
          description: "Organizing tasks makes them manageable.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Panic and do nothing",
          emoji: "😱",
          description: "Panicking only increases stress.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Do everything at once",
          emoji: "🤯",
          description: "Multitasking can reduce quality and increase stress.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your friend is stressed too. What can you do?",
      options: [
        {
          id: "b",
          text: "Ignore them",
          emoji: "🙈",
          description: "Support is important for mental health.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Talk and support each other",
          emoji: "🤝",
          description: "Sharing feelings helps reduce stress for both.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Compete who is more stressed",
          emoji: "🏆",
          description: "Stress is not a competition.",
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
    navigate("/student/health-male/teens/quiz-stress-relief");
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Stress Story"
      subtitle={!gameFinished ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-51"
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
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
              <span className="text-yellow-400 font-bold">Score: {score}</span>
            </div>

            <p className="text-white text-lg mb-6">
              {currentQuestionData.text}
            </p>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestionData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.isCorrect)}
                  disabled={answered}
                  className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${answered
                      ? option.isCorrect
                        ? "bg-green-500/50 border-green-400"
                        : "bg-white/10 opacity-50"
                      : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                    } text-white border border-transparent`}
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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Story Complete!</h3>
            <p className="text-xl text-white/90 mb-6">
              You scored {score} out of {questions.length}!
            </p>
            <p className="text-white/80 mb-8">
              Managing stress is a key part of growing up healthy. Remember to take breaks and talk to others!
            </p>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Next Challenge
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default StressStory;
