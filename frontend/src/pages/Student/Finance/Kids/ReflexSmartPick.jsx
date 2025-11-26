import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexSmartPick = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-39";
  const gameData = getGameDataById(gameId);
  
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
      question: "What is the smart pick for staying healthy?",
      options: [
        { text: "Food", isCorrect: true, emoji: "🍎" },
        { text: "Extra Ice Cream", isCorrect: false, emoji: "🍦" },
        { text: "Video Game", isCorrect: false, emoji: "🎮" },
        { text: "Fancy Toy", isCorrect: false, emoji: "🧸" }
      ]
    },
    {
      id: 2,
      question: "What should you choose for learning?",
      options: [
        { text: "New Game", isCorrect: false, emoji: "🎮" },
        { text: "School Supplies", isCorrect: true, emoji: "📚" },
        { text: "Candy", isCorrect: false, emoji: "🍬" },
        { text: "Cool Gadget", isCorrect: false, emoji: "⌚" }
      ]
    },
    {
      id: 3,
      question: "What is essential for daily life?",
      options: [
        { text: "Fancy Toy", isCorrect: false, emoji: "🧸" },
        { text: "Clothes", isCorrect: true, emoji: "👕" },
        { text: "Ice Cream", isCorrect: false, emoji: "🍦" },
        { text: "Action Figure", isCorrect: false, emoji: "🤖" }
      ]
    },
    {
      id: 4,
      question: "What helps you gain knowledge?",
      options: [
        { text: "Candy", isCorrect: false, emoji: "🍬" },
        { text: "Books", isCorrect: true, emoji: "📖" },
        { text: "Video Game", isCorrect: false, emoji: "🎮" },
        { text: "Puzzle Game", isCorrect: false, emoji: "🧩" }
      ]
    },
    {
      id: 5,
      question: "What do you need to get to school?",
      options: [
        { text: "Cool Gadget", isCorrect: false, emoji: "⌚" },
        { text: "Bus Ticket", isCorrect: true, emoji: "🚌" },
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
  const finalScore = score;

  return (
    <GameShell
      title="Reflex Smart Pick"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}: Test your knowledge about smart choices!` : "Game Complete!"}
      currentLevel={currentQuestion + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-6">
        {!showResult && currentQuestionData && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              {currentQuestionData.question}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestionData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-4xl mb-3">{option.emoji}</div>
                  <h3 className="font-bold text-xl">{option.text}</h3>
                </button>
              ))}
            </div>

            <div className="mt-6 text-lg font-semibold text-white/80">
              Score: {score}/{questions.length}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexSmartPick;