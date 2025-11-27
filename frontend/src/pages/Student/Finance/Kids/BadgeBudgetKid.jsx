import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeBudgetKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-30";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What is a budget?",
      options: [
        { text: "A plan for how to spend your money", correct: true },
        { text: "A type of savings account", correct: false },
        { text: "Money you get from parents", correct: false },
        { text: "A shopping list", correct: false }
      ],
      feedback: {
        correct: "Excellent! A budget helps you plan your spending wisely!",
        wrong: "A budget is a plan for how to spend your money!"
      }
    },
    {
      id: 2,
      question: "Why is it important to make a budget?",
      options: [
        { text: "To spend all your money quickly", correct: false },
        { text: "To track your money and avoid overspending", correct: true },
        { text: "To buy expensive things", correct: false },
        { text: "To hide money from parents", correct: false }
      ],
      feedback: {
        correct: "Perfect! Budgeting helps you manage money smartly!",
        wrong: "Budgeting helps you track money and avoid overspending!"
      }
    },
    {
      id: 3,
      question: "If you have ₹100 and want to save ₹30, how much can you spend?",
      options: [
        { text: "₹100", correct: false },
        { text: "₹130", correct: false },
        { text: "₹30", correct: false },
        { text: "₹70", correct: true }
      ],
      feedback: {
        correct: "Great math! ₹100 - ₹30 = ₹70 to spend!",
        wrong: "Subtract savings from total: ₹100 - ₹30 = ₹70!"
      }
    },
    {
      id: 4,
      question: "What should you do first when making a budget?",
      options: [
        { text: "Spend all your money", correct: false },
        { text: "Buy everything you want", correct: false },
        { text: "List your income and expenses", correct: true },
        { text: "Ask for more money", correct: false }
      ],
      feedback: {
        correct: "Smart! Knowing your income and expenses is the first step!",
        wrong: "First, list what money you have (income) and what you need to spend (expenses)!"
      }
    },
    {
      id: 5,
      question: "What is the best way to stick to your budget?",
      options: [
        { text: "Track your spending and adjust when needed", correct: true },
        { text: "Ignore it and spend freely", correct: false },
        { text: "Spend more than planned", correct: false },
        { text: "Never save money", correct: false }
      ],
      feedback: {
        correct: "Perfect! Tracking helps you stay on budget!",
        wrong: "Track your spending regularly and adjust your budget when needed!"
      }
    }
  ];

  const handleAnswer = (option) => {
    if (answered) return; // Prevent multiple clicks
    
    setSelectedAnswer(option);
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = option.correct;
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Show feedback for 2 seconds, then move to next question or show results
    setTimeout(() => {
      if (isLastQuestion) {
        // This is the last question (5th), show results
        setShowResult(true);
      } else {
        // Move to next question
        setCurrentQuestion((prev) => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Badge: Budget Kid"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}: Test your budgeting knowledge!` : "Badge Earned!"}
      currentLevel={currentQuestion + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-6">
        {!showResult && currentQuestionData && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-6 text-white">
              {currentQuestionData.question}
            </h3>

            {!answered && (
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}

            {answered && selectedAnswer && (
              <div className={`p-6 rounded-xl border-2 ${
                selectedAnswer.correct 
                  ? 'bg-green-500/20 border-green-400' 
                  : 'bg-red-500/20 border-red-400'
              }`}>
                <p className="text-white/90 text-lg">
                  {selectedAnswer.correct 
                    ? currentQuestionData.feedback.correct 
                    : currentQuestionData.feedback.wrong}
                </p>
              </div>
            )}

            <div className="mt-6 text-lg font-semibold text-white/80">
              Score: {score}/{questions.length}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeBudgetKid;
