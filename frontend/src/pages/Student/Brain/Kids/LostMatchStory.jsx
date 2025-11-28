import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LostMatchStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-55");
  const gameId = gameData?.id || "brain-kids-55";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for LostMatchStory, using fallback ID");
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
      text: "Team loses a game. Best thought?",
      options: [
        { 
          id: "improve", 
          text: "Next time we'll improve!", 
          emoji: "📈", 
          description: "Focus on getting better",
          isCorrect: true
        },
        { 
          id: "losers", 
          text: "We're losers", 
          emoji: "😢", 
          description: "Think negatively about yourself",
          isCorrect: false
        },
        { 
          id: "giveup", 
          text: "Give up", 
          emoji: "😔", 
          description: "Stop trying",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Failed test. Positive thought?",
      options: [
        { 
          id: "dumb", 
          text: "I'm dumb", 
          emoji: "😞", 
          description: "Think negatively about yourself",
          isCorrect: false
        },
        { 
          id: "study", 
          text: "Study more next time!", 
          emoji: "📚", 
          description: "Focus on improvement",
          isCorrect: true
        },
        { 
          id: "skip", 
          text: "Skip school", 
          emoji: "🚶", 
          description: "Avoid the problem",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Fell off bike. Best thought?",
      options: [
        { 
          id: "practice", 
          text: "Practice makes perfect!", 
          emoji: "🚴", 
          description: "Keep trying and improving",
          isCorrect: true
        },
        { 
          id: "never", 
          text: "Never ride again", 
          emoji: "🚫", 
          description: "Give up completely",
          isCorrect: false
        },
        { 
          id: "hate", 
          text: "Hate bike", 
          emoji: "😠", 
          description: "Get angry and blame",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Drawing didn't win. What to think?",
      options: [
        { 
          id: "bad", 
          text: "I'm bad at art", 
          emoji: "😞", 
          description: "Think negatively",
          isCorrect: false
        },
        { 
          id: "stop", 
          text: "Stop drawing", 
          emoji: "✋", 
          description: "Give up",
          isCorrect: false
        },
        { 
          id: "newideas", 
          text: "Try new ideas next!", 
          emoji: "🎨", 
          description: "Focus on improvement",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Missed goal. Positive thought?",
      options: [
        { 
          id: "terrible", 
          text: "I'm terrible", 
          emoji: "😞", 
          description: "Think negatively",
          isCorrect: false
        },
        { 
          id: "quit", 
          text: "Quit team", 
          emoji: "🚪", 
          description: "Give up",
          isCorrect: false
        },
        { 
          id: "practice2", 
          text: "Keep practicing!", 
          emoji: "⚽", 
          description: "Focus on improvement",
          isCorrect: true
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
      title="Lost Match Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
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

export default LostMatchStory;
