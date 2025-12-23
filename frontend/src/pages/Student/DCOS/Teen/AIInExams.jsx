import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AIInExams = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-74");
  const gameId = gameData?.id || "dcos-teen-74";
  
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
      text: "An AI app suggests cheat answers during an exam. What should you do?",
      options: [
        { 
          id: "use-ai", 
          text: "Use the AI answers", 
          emoji: "❌", 
          description: "Use AI to cheat",
          isCorrect: false
        },
        { 
          id: "reject", 
          text: "Reject and use your own knowledge", 
          emoji: "✅", 
          description: "Refuse to cheat",
          isCorrect: true
        },
        { 
          id: "maybe-use", 
          text: "Maybe use it", 
          emoji: "🤔", 
          description: "Consider using it",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "AI offers to solve exam questions for you. What's your response?",
      options: [
        { 
          id: "accept", 
          text: "Accept the help", 
          emoji: "❌", 
          description: "Use AI to solve questions",
          isCorrect: false
        },
        
        { 
          id: "consider", 
          text: "Consider it", 
          emoji: "🤔", 
          description: "Think about using it",
          isCorrect: false
        },
        { 
          id: "reject-help", 
          text: "Reject - it's cheating", 
          emoji: "✅", 
          description: "Refuse to cheat",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "An AI tool provides exam answers. What should you do?",
      options: [
        { 
          id: "use-tool", 
          text: "Use the tool", 
          emoji: "❌", 
          description: "Use AI tool to cheat",
          isCorrect: false
        },
        { 
          id: "reject-tool", 
          text: "Reject - use your own knowledge", 
          emoji: "✅", 
          description: "Refuse to cheat",
          isCorrect: true
        },
        { 
          id: "maybe-tool", 
          text: "Maybe use it", 
          emoji: "🤔", 
          description: "Consider using the tool",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "AI suggests answers during a test. What's the right choice?",
      options: [
        { 
          id: "follow-ai", 
          text: "Follow AI suggestions", 
          emoji: "❌", 
          description: "Use AI answers",
          isCorrect: false
        },
       
        { 
          id: "think-about", 
          text: "Think about it", 
          emoji: "🤔", 
          description: "Consider using AI",
          isCorrect: false
        },
         { 
          id: "reject-suggestions", 
          text: "Reject - it's academic dishonesty", 
          emoji: "✅", 
          description: "Refuse to cheat",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "An AI app offers to complete your exam. What do you do?",
      options: [
        { 
          id: "let-ai", 
          text: "Let AI complete it", 
          emoji: "❌", 
          description: "Allow AI to do the exam",
          isCorrect: false
        },
        { 
          id: "reject-complete", 
          text: "Reject - complete it yourself", 
          emoji: "✅", 
          description: "Do your own work",
          isCorrect: true
        },
        { 
          id: "consider-ai", 
          text: "Consider using AI", 
          emoji: "🤔", 
          description: "Think about using AI",
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
      title="Simulation: AI in Exams"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
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
                  You understand academic integrity!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Using AI to cheat on exams is academic dishonesty. Always use your own knowledge and do your own work!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember, using AI to cheat is wrong!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always reject AI help during exams. Use your own knowledge and maintain academic integrity!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIInExams;
