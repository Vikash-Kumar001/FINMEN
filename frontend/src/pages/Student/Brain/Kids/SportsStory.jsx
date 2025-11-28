import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SportsStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-8");
  const gameId = gameData?.id || "brain-kids-8";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SportsStory, using fallback ID");
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
      text: "Playing football helps brain?",
      options: [
        { 
          id: "yes", 
          text: "Yes", 
          emoji: "⚽", 
          description: "Physical activity increases blood flow to the brain",
          isCorrect: true
        },
        { 
          id: "maybe", 
          text: "Maybe", 
          emoji: "🤔", 
          description: "It might help sometimes",
          isCorrect: false
        },
        { 
          id: "no", 
          text: "No", 
          emoji: "❌", 
          description: "Sports don't help the brain",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How does playing sports help your school work?",
      options: [
        { 
          id: "tired", 
          text: "Makes you too tired to study", 
          emoji: "😴", 
          description: "Sports make you exhausted",
          isCorrect: false
        },
        { 
          id: "focus", 
          text: "Helps you focus better", 
          emoji: "🎯", 
          description: "Exercise improves concentration and memory",
          isCorrect: true
        },
        { 
          id: "nothing", 
          text: "Does nothing", 
          emoji: "🚫", 
          description: "Sports have no effect on learning",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which sport is best for brain health?",
      options: [
        { 
          id: "any", 
          text: "Any sport you enjoy", 
          emoji: "🏃", 
          description: "The best sport is one you'll stick with regularly",
          isCorrect: true
        },
        { 
          id: "football", 
          text: "Only football", 
          emoji: "⚽", 
          description: "Football is the only good sport",
          isCorrect: false
        },
        { 
          id: "none", 
          text: "No sports needed", 
          emoji: "🚫", 
          description: "You don't need to play any sports",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "When is the best time to play sports?",
      options: [
        { 
          id: "weekend", 
          text: "Only on weekends", 
          emoji: "📅", 
          description: "Play sports only on weekends",
          isCorrect: false
        },
        { 
          id: "regular", 
          text: "Regularly, even for short periods", 
          emoji: "⏰", 
          description: "Consistent activity is more beneficial",
          isCorrect: true
        },
        { 
          id: "never", 
          text: "Never", 
          emoji: "🚫", 
          description: "Don't play sports at all",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should you do after playing sports?",
      options: [
        { 
          id: "hydrate", 
          text: "Drink water and rest", 
          emoji: "💧", 
          description: "Rehydrating helps your brain recover too",
          isCorrect: true
        },
        { 
          id: "continue", 
          text: "Keep playing without rest", 
          emoji: "🏃", 
          description: "Continue playing without taking a break",
          isCorrect: false
        },
        { 
          id: "sleep", 
          text: "Sleep immediately", 
          emoji: "😴", 
          description: "Go to sleep right away",
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

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Sports for Brain Health"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="brain"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
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

export default SportsStory;
