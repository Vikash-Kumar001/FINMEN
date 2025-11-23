import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Coins, Sparkles, Star, Award, DollarSign } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeYoungEarner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { showCorrectAnswerFeedback } = useGameFeedback();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalCoins, setTotalCoins] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [earnedBadge, setEarnedBadge] = useState(false);

  const levels = [
    {
      id: 1,
      title: "Helping at Home",
      question: "What's a good way to earn pocket money at home?",
      icon: Sparkles,
      options: [
        { text: "Do chores like cleaning room", correct: true, coins: 10 },
        { text: "Demand money for nothing", correct: false, coins: 0 },
        { text: "Take from parents' wallet", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Great! Helping at home is honest earning!",
        wrong: "Earn by helping, not demanding or taking!"
      }
    },
    {
      id: 2,
      title: "Selling Old Items",
      question: "You have toys you don't use. What's smart?",
      icon: Star,
      options: [
        { text: "Sell them to earn money", correct: true, coins: 15 },
        { text: "Throw them in trash", correct: false, coins: 0 },
        { text: "Hoard them forever", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Smart! Unused items can become money!",
        wrong: "Don't waste! Sell what you don't need!"
      }
    },
    {
      id: 3,
      title: "Teaching Skills",
      question: "You're good at drawing. How can you earn?",
      icon: Award,
      options: [
        { text: "Teach friends for small fee", correct: true, coins: 20 },
        { text: "Keep skills to myself", correct: false, coins: 0 },
        { text: "Copy others' work", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Share skills and earn!",
        wrong: "Skills are valuable - share them!"
      }
    },
    {
      id: 4,
      title: "Creative Projects",
      question: "School fair is coming. What's a good earning idea?",
      icon: Coins,
      options: [
        { text: "Make crafts and sell them", correct: true, coins: 25 },
        { text: "Do nothing and watch", correct: false, coins: 0 },
        { text: "Steal others' ideas", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Creative! Your talents can earn money!",
        wrong: "Be creative and original to earn!"
      }
    },
    {
      id: 5,
      title: "Good Grades Reward",
      question: "Parents offer money for good grades. What do you do?",
      icon: DollarSign,
      options: [
        { text: "Study hard and earn fairly", correct: true, coins: 30 },
        { text: "Cheat on tests", correct: false, coins: 0 },
        { text: "Make excuses for bad grades", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! Hard work pays off honestly!",
        wrong: "Earn through effort, not shortcuts!"
      }
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData.icon;

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    setAnswered(true);
    
    if (option.correct) {
      setTotalCoins(totalCoins + option.coins);
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
      coins={totalCoins}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={currentLevel === 5 && answered ? () => navigate("/games/financial-literacy/kids") : null}
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextEnabled={currentLevel === 5 && answered}
      nextLabel={"Claim Badge"}
      showConfetti={answered && selectedAnswer?.correct}
      score={totalCoins}
      gameId="finance-kids-150"
      gameType="finance"
    >
      <div className="text-center text-white space-y-4">
        {/* Icon Display */}
        <div className="flex justify-center mb-3">
          <Icon className="w-16 h-16 text-yellow-400 animate-pulse" />
        </div>

        {!answered ? (
          <div className="space-y-2">
            {currentLevelData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-3 rounded-full text-white font-bold hover:scale-105 transition-transform text-sm"
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
              {selectedAnswer.correct ? `+${selectedAnswer.coins} Coins!` : 'Try Better!'}
            </h3>
            <p className="text-white/90 text-sm">
              {selectedAnswer.correct 
                ? currentLevelData.feedback.correct 
                : currentLevelData.feedback.wrong}
            </p>
            
            {earnedBadge && (
              <div className="mt-3 p-3 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl border-2 border-yellow-400">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-lg font-bold text-yellow-300 mb-1">
                  💰 Young Earner Badge! 💰
                </p>
                <p className="text-white/90 text-xs mb-1">
                  You know 5 smart ways to earn!
                </p>
                <p className="text-green-200 font-bold text-sm">
                  Total: {totalCoins} Coins
                </p>
              </div>
            )}
          </div>
        )}

        {/* Progress Coins */}
        <div className="flex justify-center gap-1">
          {levels.map((level) => (
            <Coins
              key={level.id}
              className={`w-5 h-5 ${
                level.id < currentLevel
                  ? 'text-green-400'
                  : level.id === currentLevel
                  ? 'text-yellow-400 animate-pulse'
                  : 'text-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Stats - Compact */}
        <div className="flex gap-2 justify-center">
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm flex-1 max-w-[120px]">
            <p className="text-white/70 text-xs">Ways Learned</p>
            <p className="text-yellow-400 font-bold">{currentLevel}/5</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm flex-1 max-w-[120px]">
            <p className="text-white/70 text-xs">Coins Earned</p>
            <p className="text-green-400 font-bold">{totalCoins}</p>
          </div>
        </div>

        {currentLevel === 5 && answered && (
          <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-400">
            <p className="text-xs text-yellow-200">
              💡 Tip: Honest work = Honest money!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeYoungEarner;