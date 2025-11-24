import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Building2, Landmark, CreditCard, Lock, Users } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeBankExplorer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-50";
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
      title: "What is a Bank?",
      question: "What is the main purpose of a bank?",
      icon: Building2,
      options: [
        { text: "To keep money safe and help it grow", correct: true, coins: 10 },
        { text: "To give free toys", correct: false, coins: 0 },
        { text: "Only for adults to visit", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! Banks keep our money safe and help it grow with interest!",
        wrong: "Banks are special places that keep money safe for everyone!"
      }
    },
    {
      id: 2,
      title: "Savings Account",
      question: "What happens when you put money in a savings account?",
      icon: Landmark,
      options: [
        { text: "It stays safe and earns interest", correct: true, coins: 15 },
        { text: "The bank uses it for free", correct: false, coins: 0 },
        { text: "It disappears", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Your money stays safe and the bank pays you interest!",
        wrong: "Savings accounts keep money safe and even help it grow!"
      }
    },
    {
      id: 3,
      title: "ATM Cards",
      question: "What should you NEVER do with your ATM card?",
      icon: CreditCard,
      options: [
        { text: "Share your PIN with strangers", correct: true, coins: 20 },
        { text: "Keep it in a safe place", correct: false, coins: 0 },
        { text: "Use it with parent's permission", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Right! PIN codes must always be kept secret and private!",
        wrong: "Never share your PIN - it's like giving away your house key!"
      }
    },
    {
      id: 4,
      title: "Bank Security",
      question: "Why do banks have security guards and cameras?",
      icon: Lock,
      options: [
        { text: "To protect everyone's money", correct: true, coins: 25 },
        { text: "To scare children", correct: false, coins: 0 },
        { text: "Just for decoration", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Correct! Banks take security seriously to protect everyone's money!",
        wrong: "Security helps keep everyone's money safe from thieves!"
      }
    },
    {
      id: 5,
      title: "Bank Services",
      question: "Which service do banks provide to help people?",
      icon: Users,
      options: [
        { text: "Loans to start businesses or buy homes", correct: true, coins: 30 },
        { text: "Free vacations", correct: false, coins: 0 },
        { text: "Magic money machines", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Amazing! Banks help people achieve their dreams with loans!",
        wrong: "Banks lend money to help people buy important things!"
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
    
    // Automatically advance to next question after a delay
    setTimeout(() => {
      if (currentLevel < 5) {
        setCurrentLevel(currentLevel + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      } else {
        // For the last question, show badge and then automatically navigate
        setTimeout(() => {
          navigate("/games/financial-literacy/kids");
        }, 3000); // Show the badge for 3 seconds before navigating
      }
    }, 2000);
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
      onNext={currentLevel === 5 && answered ? () => navigate("/games/financial-literacy/kids") : null}
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextEnabled={currentLevel === 5 && answered}
      nextLabel={"Finish & Claim Badge"}
      showConfetti={answered && selectedAnswer?.correct}
      score={earnedCoins}
      gameId="finance-kids-90"
      gameType="finance"
    >
      <div className="text-center text-white space-y-8">
        <div className="flex justify-center mb-6">
          <Icon className="w-24 h-24 text-blue-400 animate-pulse" />
        </div>

        {!answered ? (
          <div className="space-y-4">
            {currentLevelData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 rounded-full text-white font-bold hover:scale-105 transition-transform hover:shadow-lg"
              >
                {option.text}
              </button>
            ))}
          </div>
        ) : (
          <div className={`p-8 rounded-2xl border-2 mt-4 ${
            selectedAnswer.correct 
              ? 'bg-green-500/20 border-green-400' 
              : 'bg-red-500/20 border-red-400'
          }`}>
            <Trophy className={`mx-auto w-16 h-16 mb-3 ${
              selectedAnswer.correct ? 'text-yellow-400' : 'text-gray-400'
            }`} />
            <h3 className="text-2xl font-bold mb-2">
              {selectedAnswer.correct ? `+${selectedAnswer.coins} Coins!` : 'Keep Learning!'}
            </h3>
            <p className="text-white/90 text-lg">
              {selectedAnswer.correct 
                ? currentLevelData.feedback.correct 
                : currentLevelData.feedback.wrong}
            </p>
            
            {earnedBadge && (
              <div className="mt-6 p-6 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl border-2 border-yellow-400 animate-pulse">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Trophy className="w-12 h-12 text-yellow-400" />
                  <Building2 className="w-12 h-12 text-orange-400" />
                </div>
                <p className="text-2xl font-bold text-yellow-300 mb-2">
                  🏆 Bank Explorer Badge Unlocked! 🏆
                </p>
                <p className="text-white/90">
                  You've mastered 5 key bank basics!
                </p>
                <p className="text-yellow-200 font-bold mt-2">
                  Total Coins Earned: {earnedCoins} 💰
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center gap-2 mt-6">
          {levels.map((level) => (
            <div
              key={level.id}
              className={`w-3 h-3 rounded-full ${
                level.id < currentLevel
                  ? 'bg-green-400'
                  : level.id === currentLevel
                  ? 'bg-blue-400 animate-pulse'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {currentLevel === 5 && answered && (
          <div className="mt-4 p-4 bg-blue-500/20 rounded-lg border border-blue-400">
            <p className="text-sm text-blue-200">
              💡 Fun Fact: The first bank was created in Italy over 600 years ago!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeBankExplorer;