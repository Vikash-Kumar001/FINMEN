import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SleepQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-62");
  const gameId = gameData?.id || "brain-kids-62";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SleepQuiz, using fallback ID");
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
      text: "How many hours should kids sleep? (a) 4, (b) 8–10, (c) 12+",
      options: [
        { 
          id: "b", 
          text: "(b) 8–10 hours", 
          emoji: "😴", 
          description: "The recommended amount for kids",
          isCorrect: true
        },
        { 
          id: "a", 
          text: "(a) 4 hours", 
          emoji: "😴", 
          description: "Too little sleep",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "(c) 12+ hours", 
          emoji: "😴", 
          description: "Too much sleep",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Best bedtime for kids? (a) Midnight, (b) 9–10 PM, (c) 2 AM",
      options: [
        { 
          id: "a", 
          text: "(a) Midnight", 
          emoji: "🌙", 
          description: "Too late for kids",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "(b) 9–10 PM", 
          emoji: "🌙", 
          description: "Good bedtime for kids",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "(c) 2 AM", 
          emoji: "🌙", 
          description: "Very late, not good",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What helps sleep? (a) Screen time, (b) Quiet routine, (c) Loud music",
      options: [
        { 
          id: "c", 
          text: "(c) Loud music", 
          emoji: "🔊", 
          description: "Too noisy for sleep",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "(a) Screen time", 
          emoji: "📱", 
          description: "Screens keep you awake",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "(b) Quiet routine", 
          emoji: "🧘", 
          description: "Calm activities help sleep",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Good for sleep? (a) Caffeine, (b) Warm milk, (c) Gaming",
      options: [
        { 
          id: "b", 
          text: "(b) Warm milk", 
          emoji: "🥛", 
          description: "Helps you relax and sleep",
          isCorrect: true
        },
        { 
          id: "a", 
          text: "(a) Caffeine", 
          emoji: "☕", 
          description: "Keeps you awake",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "(c) Gaming", 
          emoji: "🎮", 
          description: "Too exciting before bed",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Sleep helps? (a) Focus, (b) Tiredness, (c) Stress",
      options: [
        { 
          id: "c", 
          text: "(c) Stress", 
          emoji: "😰", 
          description: "Sleep reduces stress",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "(a) Focus", 
          emoji: "🎯", 
          description: "Good sleep improves focus",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "(b) Tiredness", 
          emoji: "😴", 
          description: "Sleep reduces tiredness",
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

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Sleep"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default SleepQuiz;
