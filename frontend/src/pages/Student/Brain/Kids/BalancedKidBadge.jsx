import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { Monitor, BookOpenCheck, Clock, Gamepad, PenTool } from 'lucide-react';

const BalancedKidBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-80");
  const gameId = gameData?.id || "brain-kids-80";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BalancedKidBadge, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Tablet Story Challenge",
      description: "Choose the balanced approach in digital dilemmas!",
      icon: <Monitor className="w-8 h-8" />,
      color: "bg-blue-500",
      question: "It's tablet time! Which choice shows digital balance?",
      options: [
        { 
          text: "Play tablet for 1 hour, then go outside", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          text: "Play tablet all day without breaks", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Never use tablet at all", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Play tablet until bedtime", 
          emoji: "🌙", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Screen Quiz Master",
      description: "Test your knowledge of healthy screen habits!",
      icon: <BookOpenCheck className="w-8 h-8" />,
      color: "bg-purple-500",
      question: "Answer this question: What's the best screen time limit for kids?",
      options: [
        { 
          text: "10 hours per day", 
          emoji: "⏰", 
          isCorrect: false
        },
        { 
          text: "1-2 hours per day", 
          emoji: "✅", 
          isCorrect: true
        },
        { 
          text: "No limit needed", 
          emoji: "♾️", 
          isCorrect: false
        },
        { 
          text: "All day is fine", 
          emoji: "📱", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Digital Reflex",
      description: "Quickly identify balanced digital activities!",
      icon: <Clock className="w-8 h-8" />,
      color: "bg-green-500",
      question: "Is this a balanced digital activity: 'Playing games for 1 hour then going outside'?",
      options: [
        { 
          text: "No, games are always bad", 
          emoji: "❌", 
          isCorrect: false
        },
        { 
          text: "No, you should only play games", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          text: "Yes, it balances screen time with outdoor play", 
          emoji: "✅", 
          isCorrect: true
        },
        { 
          text: "No, balance doesn't matter", 
          emoji: "🤷", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Balance Puzzle",
      description: "Match screen time with its effects!",
      icon: <Gamepad className="w-8 h-8" />,
      color: "bg-yellow-500",
      question: "What effect does balanced screen use have?",
      options: [
        { 
          text: "Makes you tired all the time", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Helps you stay healthy and active", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          text: "Doesn't help at all", 
          emoji: "🤷", 
          isCorrect: false
        },
        { 
          text: "Makes you lazy", 
          emoji: "😑", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Homework Priority",
      description: "Learn to prioritize tasks effectively!",
      icon: <PenTool className="w-8 h-8" />,
      color: "bg-red-500",
      question: "You have homework and a game. What's the balanced approach?",
      options: [
        { 
          text: "Play game all day, skip homework", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          text: "Do homework first, then play game for limited time", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          text: "Only do homework, never play", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          text: "Do homework while playing game", 
          emoji: "🤹", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
        setScore(challenges.length); // Ensure score matches total for GameOverModal
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 1500);
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Balanced Kid"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Earned!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
    >
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <div className={`${currentChallenge.color} rounded-xl p-4 mb-6 flex items-center gap-3`}>
                <div className="text-white">{currentChallenge.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-white">{currentChallenge.title}</h3>
                  <p className="text-white/90 text-sm">{currentChallenge.description}</p>
                </div>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg">{option.text}</h3>
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

export default BalancedKidBadge;
