import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SavingsSaga = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-11");
  const gameId = gameData?.id || "finance-teens-11";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SavingsSaga, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You get ₹500 monthly. How should you manage it?",
      options: [
        { 
          id: "divide", 
          text: "Divide into needs/wants/savings", 
          emoji: "💰", 
          description: "Smart budgeting: allocate for essentials, fun, and future",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend all on food", 
          emoji: "🍕", 
          description: "Use entire amount for food expenses",
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save everything", 
          emoji: "🏦", 
          description: "Don't spend anything at all",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You have ₹300. What's the best allocation?",
      options: [
        { 
          id: "spend", 
          text: "Spend all on snacks", 
          emoji: "🍫", 
          description: "Use all money for immediate treats",
          isCorrect: false
        },
        { 
          id: "divide", 
          text: "Divide: needs, wants, savings", 
          emoji: "⚖️", 
          description: "Balance essentials, enjoyment, and future security",
          isCorrect: true
        },
        { 
          id: "save", 
          text: "Save everything", 
          emoji: "💰", 
          description: "Don't spend anything",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You receive ₹400. How should you handle it?",
      options: [
        { 
          id: "divide", 
          text: "Split: needs, wants, savings", 
          emoji: "📊", 
          description: "Plan for essentials, fun, and future goals",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend all on entertainment", 
          emoji: "🎬", 
          description: "Use entire amount for movies and fun",
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save everything", 
          emoji: "🏦", 
          description: "Don't spend anything",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You have ₹600. What's the smart choice?",
      options: [
        { 
          id: "spend", 
          text: "Spend all on clothes", 
          emoji: "👕", 
          description: "Use all money for new clothes",
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save everything", 
          emoji: "💰", 
          description: "Don't spend anything",
          isCorrect: false
        },
        { 
          id: "divide", 
          text: "Divide: needs, wants, savings", 
          emoji: "⚖️", 
          description: "Balance essentials, enjoyment, and savings",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "You get ₹800 monthly. How should you allocate it?",
      options: [
        { 
          id: "divide", 
          text: "Split: needs, wants, savings", 
          emoji: "📈", 
          description: "Plan for essentials, fun, and future security",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend all on gadgets", 
          emoji: "📱", 
          description: "Use entire amount for new gadgets",
          isCorrect: false
        },
        { 
          id: "save", 
          text: "Save everything", 
          emoji: "🏦", 
          description: "Don't spend anything",
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
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Savings Saga"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="finance"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-3xl mb-3">{option.emoji}</div>
                      <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                      <p className="text-white/90 text-sm">{option.description}</p>
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
                  You understand the importance of dividing money wisely!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Always divide your money into needs, wants, and savings for a balanced financial life!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember to divide your money into needs, wants, and savings!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: The smart approach is to divide your money: some for needs (essentials), some for wants (fun), and some for savings (future).
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SavingsSaga;

