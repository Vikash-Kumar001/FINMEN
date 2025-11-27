import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexNeedVsWant = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-kids-33");
  const gameId = gameData?.id || "finance-kids-33";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ReflexNeedVsWant, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      question: "Which one is a need?",
      options: [
        { text: "Shoes for School", isCorrect: true, emoji: "👟" },
        { text: "10th Toy Car", isCorrect: false, emoji: "🚗" },
        { text: "Video Game", isCorrect: false, emoji: "🎮" },
        { text: "Fancy Sunglasses", isCorrect: false, emoji: "🕶️" }
      ]
    },
    {
      id: 2,
      question: "What is a need for staying healthy?",
      options: [
        { text: "Extra Candy", isCorrect: false, emoji: "🍬" },
        { text: "Healthy Food", isCorrect: true, emoji: "🥗" },
        { text: "Ice Cream", isCorrect: false, emoji: "🍦" },
        { text: "Soda", isCorrect: false, emoji: "🥤" }
      ]
    },
    {
      id: 3,
      question: "Which item is essential for learning?",
      options: [
        { text: "Video Game", isCorrect: false, emoji: "🎮" },
        { text: "School Books", isCorrect: true, emoji: "📚" },
        { text: "Action Figure", isCorrect: false, emoji: "🤖" },
        { text: "Puzzle Game", isCorrect: false, emoji: "🧩" }
      ]
    },
    {
      id: 4,
      question: "What do you need in cold weather?",
      options: [
        { text: "Fancy Sunglasses", isCorrect: false, emoji: "🕶️" },
        { text: "Winter Jacket", isCorrect: true, emoji: "🧥" },
        { text: "Swimming Pool", isCorrect: false, emoji: "🏊" },
        { text: "Beach Ball", isCorrect: false, emoji: "🏐" }
      ]
    },
    {
      id: 5,
      question: "What is needed to get to school?",
      options: [
        { text: "New Headphones", isCorrect: false, emoji: "🎧" },
        { text: "Bus Fare", isCorrect: true, emoji: "🚌" },
        { text: "Music Player", isCorrect: false, emoji: "🎵" },
        { text: "Smart Watch", isCorrect: false, emoji: "⌚" }
      ]
    }
  ];

  const handleAnswer = (option) => {
    if (answered) return; // Prevent multiple clicks
    
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = option.isCorrect;
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next question or show results after a short delay
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion((prev) => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Reflex Need vs Want"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
      currentLevel={currentQuestion + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-3xl mb-3">{option.emoji}</div>
                      <h3 className="font-bold text-lg">{option.text}</h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct!
                  You understand the difference between needs and wants!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Needs are essential for survival and learning, while wants are things we'd like to have but don't need!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember, needs are essential items like food, clothes, and school supplies!
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setCurrentQuestion(0);
                    setScore(0);
                    setAnswered(false);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Needs are things you must have to survive and learn, like food, clothes, and school supplies.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexNeedVsWant;