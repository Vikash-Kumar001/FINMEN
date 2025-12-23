import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizTeenHabits = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback, resetFeedback, flashPoints } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const questions = [
    {
      id: 1,
      text: "Which supports health?",
      options: [
        {
          id: "a",
          text: "Sleep + balanced diet",
          emoji: "😴",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skipping meals",
          emoji: "🍽️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Staying up all night",
          emoji: "🌙",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is a healthy teen habit for mental health?",
      options: [
        {
          id: "a",
          text: "Skipping school",
          emoji: "🏫",
          isCorrect: false
        },
        {
          id: "b",
          text: "Regular exercise",
          emoji: "🏃",
          isCorrect: true
        },
        {
          id: "c",
          text: "Social media all day",
          emoji: "📱",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does a consistent bedtime help teens?",
      options: [
        {
          id: "a",
          text: "Better school performance",
          emoji: "📚",
          isCorrect: true
        },
        {
          id: "b",
          text: "More time for TV",
          emoji: "📺",
          isCorrect: false
        },
        {
          id: "c",
          text: "No difference",
          emoji: "🤷",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is important for teen physical health?",
      options: [
        {
          id: "a",
          text: "Avoiding all sports",
          emoji: "⚽",
          isCorrect: false
        },
        {
          id: "b",
          text: "Daily movement and activity",
          emoji: "🏃",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only eating junk food",
          emoji: "🍔",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How should teens manage screen time?",
      options: [
        {
          id: "a",
          text: "No limits needed",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only use screens",
          emoji: "💻",
          isCorrect: false
        },
        {
          id: "c",
          text: "Set healthy limits",
          emoji: "⏰",
          isCorrect: true
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (showFeedback || gameFinished) return;
    
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        resetFeedback();
      } else {
        setGameFinished(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentQ = questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-teen-routine");
  };

  return (
    <GameShell
      title="Quiz on Teen Habits"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-92"
      gameType="health-male"
      totalLevels={5}
      currentLevel={92}
      showConfetti={gameFinished}
      backPath="/games/health-male/teens"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {currentQ.text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentQ.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                disabled={showFeedback}
                className={`p-6 rounded-2xl shadow-lg transition-all transform text-left ${
                  showFeedback && option.isCorrect
                    ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                    : showFeedback && selectedOption === option.id && !option.isCorrect
                    ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                    : selectedOption === option.id
                    ? "bg-blue-600 border-2 border-blue-300 scale-105"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                } ${showFeedback ? "cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
                      
          {showFeedback && (
            <div className={`rounded-lg p-5 mt-6 ${
              questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                ? "bg-green-500/20"
                : "bg-red-500/20"
            }`}>
              <p className="text-white whitespace-pre-line">
                {questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                  ? "Great job! That's exactly right! 🎉"
                  : "Not quite right. Try again next time!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default QuizTeenHabits;
