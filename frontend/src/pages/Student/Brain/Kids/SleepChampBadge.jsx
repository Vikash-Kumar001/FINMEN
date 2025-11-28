import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { Moon, Clock, Bed, Battery, BookOpenCheck } from 'lucide-react';

const SleepChampBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-70");
  const gameId = gameData?.id || "brain-kids-70";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SleepChampBadge, using fallback ID");
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
      title: "Bedtime Story Challenge",
      description: "Choose the best bedtime routine!",
      icon: <Moon className="w-8 h-8" />,
      color: "bg-indigo-500",
      question: "It's bedtime! Which routine helps you sleep best?",
      options: [
        { 
          text: "Go to bed at the same time each night", 
          emoji: "🌙", 
          isCorrect: true
        },
        { 
          text: "Stay up late every night", 
          emoji: "⏰", 
          isCorrect: false
        },
        { 
          text: "Watch TV until you fall asleep", 
          emoji: "📺", 
          isCorrect: false
        },
        { 
          text: "Play games until midnight", 
          emoji: "🎮", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Sleep Quiz Master",
      description: "Test your sleep knowledge!",
      icon: <BookOpenCheck className="w-8 h-8" />,
      color: "bg-purple-500",
      question: "Answer this question: How many hours should kids sleep?",
      options: [
        { 
          text: "4 hours is enough", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "8-10 hours is best", 
          emoji: "😊", 
          isCorrect: true
        },
        { 
          text: "12+ hours always", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "No sleep needed", 
          emoji: "⚡", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Sleep Habits Reflex",
      description: "Quickly identify good sleep habits!",
      icon: <Clock className="w-8 h-8" />,
      color: "bg-blue-500",
      question: "Is this a good sleep habit: 'Going to bed at the same time each night'?",
      options: [
        { 
          text: "No, routines are bad", 
          emoji: "❌", 
          isCorrect: false
        },
        { 
          text: "No, it's too strict", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "Yes, routines help sleep", 
          emoji: "✅", 
          isCorrect: true
        },
        { 
          text: "No, sleep doesn't matter", 
          emoji: "🤷", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Rest Habits Puzzle",
      description: "Match rest habits with their effects!",
      icon: <Battery className="w-8 h-8" />,
      color: "bg-green-500",
      question: "What effect does good sleep have?",
      options: [
        { 
          text: "Makes you more tired", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Helps you feel energized and focused", 
          emoji: "⚡", 
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
      title: "Exam Time Wisdom",
      description: "Avoid bad sleep habits during exams!",
      icon: <Bed className="w-8 h-8" />,
      color: "bg-teal-500",
      question: "It's exam week! What's the best approach to balance studying and sleep?",
      options: [
        { 
          text: "Study all night, skip sleep", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          text: "Study during day, sleep at night", 
          emoji: "🌙", 
          isCorrect: true
        },
        { 
          text: "No sleep needed for exams", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          text: "Sleep all day, study at night", 
          emoji: "🌙", 
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
      title="Badge: Sleep Champ"
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

export default SleepChampBadge;
