import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReflexCalm = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-33");
  const gameId = gameData?.id || "brain-kids-33";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ReflexCalm, using fallback ID");
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
      text: "What is a calm action when feeling stressed?",
      options: [
        { 
          id: "a", 
          text: "Breathe slowly and deeply", 
          emoji: "🌬️", 
          description: "Deep breathing helps calm down",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Panic and yell", 
          emoji: "😰", 
          description: "Panic increases stress",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Run around frantically", 
          emoji: "🏃", 
          description: "This increases anxiety",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which action helps you stay calm?",
      options: [
        { 
          id: "a", 
          text: "Getting very angry", 
          emoji: "😡", 
          description: "Anger doesn't help calmness",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Count to 10 slowly", 
          emoji: "🔢", 
          description: "Counting helps you relax",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Worry about everything", 
          emoji: "😟", 
          description: "Worrying increases stress",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What should you do to feel calm?",
      options: [
        { 
          id: "a", 
          text: "Shout at others", 
          emoji: "😠", 
          description: "Shouting increases tension",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Think about worst scenarios", 
          emoji: "😰", 
          description: "This increases anxiety",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Take a break and relax", 
          emoji: "🧘", 
          description: "Taking breaks helps calm down",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Which is a calm response to stress?",
      options: [
        { 
          id: "a", 
          text: "Practice deep breathing", 
          emoji: "💨", 
          description: "Breathing exercises reduce stress",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Panic immediately", 
          emoji: "😱", 
          description: "Panic makes things worse",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore the problem", 
          emoji: "🙈", 
          description: "Ignoring doesn't help",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What helps you stay calm in difficult situations?",
      options: [
        { 
          id: "a", 
          text: "Reacting immediately with anger", 
          emoji: "😡", 
          description: "Anger doesn't help",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Staying calm and thinking clearly", 
          emoji: "😌", 
          description: "Staying calm helps solve problems",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Worrying constantly", 
          emoji: "😟", 
          description: "Worrying increases stress",
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
      title="Reflex Calm"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
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
      backPath="/games/brain-health/kids"
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

export default ReflexCalm;
