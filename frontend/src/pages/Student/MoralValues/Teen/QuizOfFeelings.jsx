import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizOfFeelings = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-22");
  const gameId = gameData?.id || "moral-teen-22";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for QuizOfFeelings, using fallback ID");
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
      text: "A classmate cries after losing a game. What do you do?",
      options: [
        { 
          id: "a", 
          text: "Comfort them", 
          emoji: "🤗", 
          description: "Showing empathy helps others feel better",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Tease them", 
          emoji: "😈", 
          description: "Teasing hurts others' feelings",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore them", 
          emoji: "😐", 
          description: "Ignoring shows lack of empathy",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You see a friend looking sad during lunch. How do you respond?",
      options: [
        { 
          id: "a", 
          text: "Make fun quietly", 
          emoji: "😏", 
          description: "Making fun of sadness is unkind",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Sit and comfort them", 
          emoji: "💛", 
          description: "Comforting shows you care about their feelings",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Walk away", 
          emoji: "🚶", 
          description: "Walking away ignores their need for support",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A classmate failed a test and is upset. Your reaction?",
      options: [
        { 
          id: "a", 
          text: "Laugh at their failure", 
          emoji: "😂", 
          description: "Laughing at failure is hurtful",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Ignore their feelings", 
          emoji: "😐", 
          description: "Ignoring shows lack of empathy",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Cheer them up and offer help", 
          emoji: "📚", 
          description: "Offering support shows empathy and kindness",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Someone trips and falls in the playground. What do you do?",
      options: [
        { 
          id: "a", 
          text: "Help them up", 
          emoji: "🤝", 
          description: "Helping others shows empathy and care",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Point and laugh", 
          emoji: "😈", 
          description: "Laughing at someone's fall is unkind",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Walk past", 
          emoji: "🚶", 
          description: "Walking past ignores someone in need",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A classmate is nervous before a presentation. How do you act?",
      options: [
        { 
          id: "a", 
          text: "Tease them about mistakes", 
          emoji: "😏", 
          description: "Teasing increases their anxiety",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Encourage and support them", 
          emoji: "🌟", 
          description: "Encouragement helps reduce nervousness",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Ignore them", 
          emoji: "😐", 
          description: "Ignoring doesn't help their confidence",
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
      title="Quiz of Feelings"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="moral"
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

export default QuizOfFeelings;
