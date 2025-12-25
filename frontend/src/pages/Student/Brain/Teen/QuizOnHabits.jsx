import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const QuizOnHabits = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-teens-2");
  const gameId = gameData?.id || "brain-teens-2";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for QuizOnHabits, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Which of these is best for brain health?",
      options: [
        { 
          id: "a", 
          text: "Balanced diet", 
          emoji: "🥗", 
          description: "A balanced diet provides essential nutrients that support brain function and cognitive health",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Sleep late", 
          emoji: "🌙", 
          description: "Sleeping late disrupts your natural sleep cycle and harms brain health",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Skip water", 
          emoji: "💧", 
          description: "Dehydration impairs cognitive function and brain performance",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How many hours of sleep do teens need for optimal brain function?",
      options: [
        { 
          id: "a", 
          text: "6-7 hours", 
          emoji: "😴", 
          description: "This is less than the recommended amount for teens",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "8-10 hours", 
          emoji: "✅", 
          description: "Teens need 8-10 hours of quality sleep for proper brain development and cognitive performance",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "4-5 hours", 
          emoji: "😰", 
          description: "This is far too little sleep and severely impacts brain function",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which habit helps improve focus and concentration?",
      options: [
        { 
          id: "a", 
          text: "Multitasking", 
          emoji: "📱", 
          description: "Multitasking actually reduces focus and productivity",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Skipping breakfast", 
          emoji: "🍽️", 
          description: "Skipping breakfast can cause brain fog and reduce concentration",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Regular meditation", 
          emoji: "🧘", 
          description: "Regular meditation and mindfulness practices improve focus, attention, and emotional regulation",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What is the effect of chronic stress on the brain?",
      options: [
        { 
          id: "a", 
          text: "Damages brain cells", 
          emoji: "⚠️", 
          description: "Chronic stress releases cortisol which can damage brain cells and impair memory and learning",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Improves memory", 
          emoji: "📈", 
          description: "Chronic stress actually harms memory, not improves it",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Has no effect", 
          emoji: "➡️", 
          description: "Chronic stress has significant negative effects on the brain",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which activity promotes neuroplasticity (brain's ability to adapt)?",
      options: [
        { 
          id: "a", 
          text: "Watching TV all day", 
          emoji: "📺", 
          description: "Passive activities like watching TV don't promote neuroplasticity",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Learning new skills", 
          emoji: "🎓", 
          description: "Learning new skills, languages, or engaging in challenging activities promotes neuroplasticity and brain growth",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Avoiding challenges", 
          emoji: "🚫", 
          description: "Avoiding challenges prevents the brain from adapting and growing",
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
      title="Quiz on Habits"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
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

export default QuizOnHabits;
