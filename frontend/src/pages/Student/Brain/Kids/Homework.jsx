import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const Homework = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-31");
  const gameId = gameData?.id || "brain-kids-31";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for Homework, using fallback ID");
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
      text: "Kid has lots of homework and feels stressed. Best action?",
      options: [
        { 
          id: "step", 
          text: "Do one step at a time", 
          emoji: "📝", 
          description: "Break it into smaller tasks",
          isCorrect: true
        },
        { 
          id: "panic", 
          text: "Panic and give up", 
          emoji: "😰", 
          description: "This makes stress worse",
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore all homework", 
          emoji: "🙈", 
          description: "This doesn't solve the problem",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You feel overwhelmed with homework. What should you do?",
      options: [
        { 
          id: "rush", 
          text: "Rush through everything at once", 
          emoji: "⚡", 
          description: "This can increase stress",
          isCorrect: false
        },
        { 
          id: "break", 
          text: "Take breaks and do it step by step", 
          emoji: "⏸️", 
          description: "Breaking it down helps reduce stress",
          isCorrect: true
        },
        { 
          id: "skip", 
          text: "Skip everything", 
          emoji: "⏭️", 
          description: "This doesn't help",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What helps when you feel stressed about homework?",
      options: [
        { 
          id: "worry", 
          text: "Worry about everything", 
          emoji: "😰", 
          description: "Worrying increases stress",
          isCorrect: false
        },
        { 
          id: "shout", 
          text: "Shout and get angry", 
          emoji: "😡", 
          description: "This doesn't help",
          isCorrect: false
        },
        { 
          id: "breathe", 
          text: "Take deep breaths and organize tasks", 
          emoji: "🌬️", 
          description: "Breathing and planning reduce stress",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "How can you manage homework stress better?",
      options: [
        { 
          id: "plan", 
          text: "Plan your time and do tasks one by one", 
          emoji: "📋", 
          description: "Planning helps manage stress",
          isCorrect: true
        },
        { 
          id: "procrastinate", 
          text: "Wait until the last minute", 
          emoji: "⏰", 
          description: "This increases stress",
          isCorrect: false
        },
        { 
          id: "avoid", 
          text: "Avoid all homework", 
          emoji: "🚫", 
          description: "This doesn't solve the problem",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the best way to handle lots of homework?",
      options: [
        { 
          id: "panic", 
          text: "Panic about everything", 
          emoji: "😰", 
          description: "Panic increases stress",
          isCorrect: false
        },
        { 
          id: "organize", 
          text: "Organize and tackle one task at a time", 
          emoji: "✅", 
          description: "Organization reduces stress",
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore it completely", 
          emoji: "😴", 
          description: "This doesn't help",
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
      title="Homework Story"
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

export default Homework;
