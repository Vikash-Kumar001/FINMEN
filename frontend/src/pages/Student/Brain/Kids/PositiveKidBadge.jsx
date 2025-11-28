import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { Smile, Heart, Sun, Sparkles, ThumbsUp } from 'lucide-react';

const PositiveKidBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-60");
  const gameId = gameData?.id || "brain-kids-60";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PositiveKidBadge, using fallback ID");
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
      title: "Rainy Day Optimism",
      description: "Find the silver lining in a rainy day!",
      icon: <Sun className="w-8 h-8" />,
      color: "bg-yellow-500",
      question: "It's raining and your picnic is cancelled. What's a positive thought?",
      options: [
        { 
          text: "We can play indoor games!", 
          emoji: "🏠", 
          isCorrect: true
        },
        { 
          text: "This day is ruined", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "I hate rain", 
          emoji: "🌧️", 
          isCorrect: false
        },
        { 
          text: "Nothing good can happen", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Positivity Quiz",
      description: "Test your positive thinking knowledge!",
      icon: <Sparkles className="w-8 h-8" />,
      color: "bg-purple-500",
      question: "What is the benefit of positive thinking?",
      options: [
        { 
          text: "Makes you feel worse", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "Helps you feel better and solve problems", 
          emoji: "😊", 
          isCorrect: true
        },
        { 
          text: "Doesn't help at all", 
          emoji: "🤷", 
          isCorrect: false
        },
        { 
          text: "Makes problems bigger", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Happy Thoughts Reflex",
      description: "Quickly identify positive thoughts!",
      icon: <Smile className="w-8 h-8" />,
      color: "bg-green-500",
      question: "Is this thought positive or negative: 'I can learn from my mistakes'?",
      options: [
        { 
          text: "Negative - it's about mistakes", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "Negative - it's too hard", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Positive - it shows growth mindset", 
          emoji: "🌟", 
          isCorrect: true
        },
        { 
          text: "Negative - mistakes are bad", 
          emoji: "❌", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Positive Words Match",
      description: "Match uplifting words and meanings!",
      icon: <Heart className="w-8 h-8" />,
      color: "bg-pink-500",
      question: "What does 'gratitude' mean?",
      options: [
        { 
          text: "Being thankful for what you have", 
          emoji: "🙏", 
          isCorrect: true
        },
        { 
          text: "Complaining about things", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Wanting more stuff", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          text: "Being sad all the time", 
          emoji: "😞", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Lost Match Positivity",
      description: "Turn defeat into motivation!",
      icon: <ThumbsUp className="w-8 h-8" />,
      color: "bg-blue-500",
      question: "Your team lost the big game. What's a positive way to think?",
      options: [
        { 
          text: "We're losers forever", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "We'll never win", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Next time we'll improve and try harder", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          text: "Games are stupid", 
          emoji: "🚫", 
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
      title="Badge: Positive Kid"
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

export default PositiveKidBadge;
