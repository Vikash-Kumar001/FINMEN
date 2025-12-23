import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnDangers = () => {
  const navigate = useNavigate();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback, resetFeedback, flashPoints } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Smoking causes?",
      options: [
        {
          id: "a",
          text: "Cancer",
          emoji: "🦠",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stronger lungs",
          emoji: "🫁",
          isCorrect: false
        },
        {
          id: "c",
          text: "Healthy teeth",
          emoji: "🦷",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What happens to your heart when you smoke?",
      options: [
        {
          id: "a",
          text: "No effect",
          emoji: "😐",
          isCorrect: false
        },
        {
          id: "b",
          text: "Higher risk of heart disease",
          emoji: "💔",
          isCorrect: true
        },
        {
          id: "c",
          text: "Gets stronger",
          emoji: "❤️",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does alcohol affect the liver?",
      options: [
        {
          id: "a",
          text: "Makes it healthier",
          emoji: "🫀",
          isCorrect: false
        },
        {
          id: "b",
          text: "No effect on liver",
          emoji: "✅",
          isCorrect: false
        },
        {
          id: "c",
          text: "Causes liver damage",
          emoji: "🩹",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What does drug use do to the brain?",
      options: [
        {
          id: "c",
          text: "Changes brain chemistry",
          emoji: "⚗️",
          isCorrect: true
        },
        {
          id: "a",
          text: "Improves brain function",
          emoji: "🧠",
          isCorrect: false
        },
        {
          id: "b",
          text: "No brain effects",
          emoji: "🤷",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 5,
      text: "Why should teens avoid substance use?",
      options: [
        {
          id: "a",
          text: "It's not cool",
          emoji: "😎",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only adults can handle it",
          emoji: "👨‍🦳",
          isCorrect: false
        },
        {
          id: "c",
          text: "Affects brain development",
          emoji: "🧠",
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
      setCoins(prev => prev + 1);
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

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-teen-choice");
  };

  return (
    <GameShell
      title="Quiz on Dangers"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-teen-82"
      gameType="health-male"
      totalLevels={5}
      currentLevel={82}
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
            <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {questions[currentQuestion].text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {questions[currentQuestion].options.map(option => (
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
                    : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
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

export default QuizOnDangers;
