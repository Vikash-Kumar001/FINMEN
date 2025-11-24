import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Building2, User, CreditCard, Lock, Clock } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BankVisitStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-41";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { showCorrectAnswerFeedback } = useGameFeedback();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [earnedBadge, setEarnedBadge] = useState(false);

  const levels = [
    {
      id: 1,
      title: "Entering the Bank",
      question: "Parents take you to bank. What do you do?",
      icon: Building2,
      options: [
        { text: "Watch and learn quietly", correct: true, coins: 10 },
        { text: "Run around and play", correct: false, coins: 0 },
        { text: "Touch everything", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Great! Observing helps you learn!",
        wrong: "Banks need quiet behavior!"
      }
    },
    {
      id: 2,
      title: "Meeting Bank Staff",
      question: "Bank staff greets you. How to respond?",
      icon: User,
      options: [
        { text: "Be polite and respectful", correct: true, coins: 15 },
        { text: "Ignore them completely", correct: false, coins: 0 },
        { text: "Be rude to them", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! Politeness matters everywhere!",
        wrong: "Always be respectful to staff!"
      }
    },
    {
      id: 3,
      title: "ATM Machine",
      question: "Parent uses ATM. What should you do?",
      icon: CreditCard,
      options: [
        { text: "Stand back and give privacy", correct: true, coins: 20 },
        { text: "Watch the PIN closely", correct: false, coins: 0 },
        { text: "Press random buttons", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Smart! Privacy is important at ATM!",
        wrong: "Never watch someone's PIN!"
      }
    },
    {
      id: 4,
      title: "Security Check",
      question: "Security guard checks bags. Your reaction?",
      icon: Lock,
      options: [
        { text: "Understand it's for safety", correct: true, coins: 25 },
        { text: "Get angry at guard", correct: false, coins: 0 },
        { text: "Refuse the check", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Security keeps everyone safe!",
        wrong: "Security checks protect everyone!"
      }
    },
    {
      id: 5,
      title: "Waiting in Queue",
      question: "Long queue at bank. What's best?",
      icon: Clock,
      options: [
        { text: "Wait patiently in line", correct: true, coins: 30 },
        { text: "Push to go first", correct: false, coins: 0 },
        { text: "Complain loudly", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Wonderful! Patience is a valuable skill!",
        wrong: "Everyone waits their turn!"
      }
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData.icon;

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    setAnswered(true);
    
    if (option.correct) {
      setEarnedCoins(earnedCoins + option.coins);
      showCorrectAnswerFeedback(option.coins, true);
      
      if (currentLevel === 5) {
        setEarnedBadge(true);
      }
    }
  };

  const handleNext = () => {
    if (currentLevel < 5) {
      setCurrentLevel(currentLevel + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      navigate("/games/financial-literacy/kids");
    }
  };

  return (
    <GameShell
      title={`Question ${currentLevel} – ${currentLevelData.title}`}
      subtitle={currentLevelData.question}
      coins={earnedCoins}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      showConfetti={answered && selectedAnswer?.correct}
      score={earnedCoins}
      gameId="finance-kids-81"
      gameType="finance"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-4">
        {/* Icon Display */}
        <div className="flex justify-center mb-3">
          <Icon className="w-16 h-16 text-blue-400 animate-pulse" />
        </div>

        {!answered ? (
          <div className="space-y-2">
            {currentLevelData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 rounded-full text-white font-bold hover:scale-105 transition-transform text-sm"
              >
                {option.text}
              </button>
            ))}
          </div>
        ) : (
          <div className={`p-4 rounded-xl border-2 ${
            selectedAnswer.correct 
              ? 'bg-green-500/20 border-green-400' 
              : 'bg-red-500/20 border-red-400'
          }`}>
            <Trophy className={`mx-auto w-12 h-12 mb-2 ${
              selectedAnswer.correct ? 'text-yellow-400' : 'text-gray-400'
            }`} />
            <h3 className="text-lg font-bold mb-1">
              {selectedAnswer.correct ? `+${selectedAnswer.coins} Coins!` : 'Try Again!'}
            </h3>
            <p className="text-white/90 text-sm">
              {selectedAnswer.correct 
                ? currentLevelData.feedback.correct 
                : currentLevelData.feedback.wrong}
            </p>
            
            {earnedBadge && (
              <div className="mt-3 p-3 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl border-2 border-blue-400">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <Building2 className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-lg font-bold text-blue-300 mb-1">
                  🏦 Bank Visit Complete! 🏦
                </p>
                <p className="text-white/90 text-xs mb-1">
                  You learned bank etiquette!
                </p>
                <p className="text-green-200 font-bold text-sm">
                  Total: {earnedCoins} Coins
                </p>
              </div>
            )}
          </div>
        )}

        {/* Progress Icons */}
          <div className="flex justify-center gap-1">
          {levels.map((level) => {
            const LevelIcon = level.icon;
            return (
              <LevelIcon
                key={level.id}
                className={`w-5 h-5 ${
                  level.id < currentLevel
                    ? 'text-green-400'
                    : level.id === currentLevel
                    ? 'text-blue-400 animate-pulse'
                    : 'text-gray-600'
                }`}
              />
            );
          })}
        </div>

        {/* Compact Stats */}
        <div className="flex gap-2 justify-center">
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm flex-1 max-w-[120px]">
            <p className="text-white/70 text-xs">Questions Done</p>
            <p className="text-blue-400 font-bold">{currentLevel}/5</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm flex-1 max-w-[120px]">
            <p className="text-white/70 text-xs">Coins</p>
            <p className="text-yellow-400 font-bold">{earnedCoins}</p>
          </div>
        </div>

        {currentLevel === 5 && answered && (
          <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400">
            <p className="text-xs text-blue-200">
              💡 Banks are safe places for money!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BankVisitStory;