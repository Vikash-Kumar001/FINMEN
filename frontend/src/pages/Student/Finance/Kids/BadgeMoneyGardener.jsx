import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Sprout, TreePine, Flower2, Leaf, Award } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeMoneyGardener = () => {
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
  const [gardenGrowth, setGardenGrowth] = useState(0);

  const levels = [
    {
      id: 1,
      title: "Seed Money - First Choice",
      question: "You got 100 rupees for your birthday. What will you do?",
      icon: Sprout,
      stage: "Seed",
      options: [
        { text: "Save 80, spend 20 - Plant seeds for growth", correct: true, coins: 10 },
        { text: "Spend all on candy today", correct: false, coins: 0 },
        { text: "Give all away immediately", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! You planted your first money seed. Savings help money grow!",
        wrong: "Remember: Saving money is like planting seeds - they grow over time!"
      }
    },
    {
      id: 2,
      title: "Watering Growth - Patience",
      question: "Your friend bought a new toy, but you're saving. What do you do?",
      icon: Leaf,
      stage: "Sprout",
      options: [
        { text: "Stay patient, keep saving for bigger goals", correct: true, coins: 15 },
        { text: "Break your piggy bank for instant fun", correct: false, coins: 0 },
        { text: "Feel sad and give up saving", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Patience waters your money garden. Your sprout is growing!",
        wrong: "Gardens need patience! Don't give up - good things take time to grow!"
      }
    },
    {
      id: 3,
      title: "Growing Strong - Smart Choices",
      question: "You want a 500 rupee toy but have only 300 saved. What's the smart choice?",
      icon: TreePine,
      stage: "Sapling",
      options: [
        { text: "Save 200 more before buying - Let it grow!", correct: true, coins: 20 },
        { text: "Borrow from parents and buy now", correct: false, coins: 0 },
        { text: "Buy a cheaper toy you don't want", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Amazing! Your money tree is getting stronger with smart decisions!",
        wrong: "Strong trees don't rush! Save completely before big purchases!"
      }
    },
    {
      id: 4,
      title: "Blooming Wisdom - Investment",
      question: "Your piggy bank is full! Grandma offers to add 10% to your savings if you wait one month. What do you choose?",
      icon: Flower2,
      stage: "Blooming",
      options: [
        { text: "Wait one month - Money can make money!", correct: true, coins: 25 },
        { text: "Take money out immediately", correct: false, coins: 0 },
        { text: "Spend half now, save half", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Wonderful! Your garden is blooming! You understand how money grows money!",
        wrong: "Flowers bloom with time! Interest helps money grow - be patient!"
      }
    },
    {
      id: 5,
      title: "Harvest Time - Reaping Rewards",
      question: "After months of saving, you have 1000 rupees! What's the wisest choice?",
      icon: Award,
      stage: "Harvest",
      options: [
        { text: "Keep 800 saved, spend 200 on something special", correct: true, coins: 30 },
        { text: "Spend everything at once", correct: false, coins: 0 },
        { text: "Never spend, just keep saving forever", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! You're a true Money Gardener! Enjoy some fruits but keep the garden growing!",
        wrong: "Good gardeners enjoy some harvest but keep planting for the future!"
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
      setGardenGrowth(currentLevel);
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
      coins={totalCoins}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      showConfetti={answered && selectedAnswer?.correct}
      score={totalCoins}
      gameId="finance-kids-130"
      gameType="finance"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-4 max-w-4xl mx-auto px-4">
        {/* Garden Growth Visualization */}
        <div className="relative h-20 flex items-end justify-center mb-3">
          <div className="absolute bottom-0 w-48 h-2 bg-amber-700 rounded-full"></div>
          <Icon className={`w-14 h-14 text-green-400 transition-all duration-1000 ${
            answered && selectedAnswer?.correct ? 'animate-bounce' : ''
          }`} style={{
            transform: `scale(${0.5 + (gardenGrowth * 0.2)})`
          }} />
        </div>

        {/* Growth Stage Indicator */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-lg p-2 border border-green-500/30">
          <p className="text-green-300 font-semibold text-sm">
            🌱 Garden Stage: {currentLevelData.stage}
          </p>
        </div>

        {!answered ? (
          <div className="space-y-3">
            {currentLevelData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 px-6 py-3 rounded-full text-white font-bold hover:scale-105 transition-transform hover:shadow-lg text-sm"
              >
                {option.text}
              </button>
            ))}
          </div>
        ) : (
          <div className={`p-6 rounded-2xl border-2 mt-4 ${
            selectedAnswer.correct 
              ? 'bg-green-500/20 border-green-400' 
              : 'bg-red-500/20 border-red-400'
          }`}>
            <Trophy className={`mx-auto w-12 h-12 mb-3 ${
              selectedAnswer.correct ? 'text-yellow-400' : 'text-gray-400'
            }`} />
            <h3 className="text-lg font-bold mb-2">
              {selectedAnswer.correct ? `+${selectedAnswer.coins} Coins! 🌱` : 'Garden Needs Care!'}
            </h3>
            <p className="text-white/90 text-sm">
              {selectedAnswer.correct 
                ? currentLevelData.feedback.correct 
                : currentLevelData.feedback.wrong}
            </p>
            
            {earnedBadge && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-xl border-2 border-green-400 animate-pulse">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <Flower2 className="w-8 h-8 text-pink-400" />
                  <Award className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-lg font-bold text-yellow-300 mb-2">
                  🌻 Money Gardener Badge Unlocked! 🌻
                </p>
                <p className="text-white/90 mb-2 text-sm">
                  Your money garden is thriving! You chose growth over instant spending!
                </p>
                <p className="text-green-200 font-bold mt-2 text-sm">
                  Total Harvest: {totalCoins} Coins 💰
                </p>
              </div>
            )}
          </div>
        )}

        {/* Progress Garden */}
        <div className="flex justify-center gap-2 mt-4">
          {levels.map((level, index) => {
            const LevelIcon = level.icon;
            return (
              <div
                key={level.id}
                className={`transition-all duration-500 ${
                  index < currentLevel - 1
                    ? 'opacity-100 scale-100'
                    : index === currentLevel - 1
                    ? 'opacity-100 scale-125 animate-pulse'
                    : 'opacity-30 scale-75'
                }`}
              >
                <LevelIcon className={`w-6 h-6 ${
                  index < currentLevel - 1
                    ? 'text-green-400'
                    : index === currentLevel - 1
                    ? 'text-yellow-400'
                    : 'text-gray-600'
                }`} />
              </div>
            );
          })}
        </div>

        {currentLevel === 5 && answered && (
          <div className="mt-3 p-3 bg-green-500/20 rounded-lg border border-green-400">
            <p className="text-xs text-green-200">
              🌳 "The best time to plant a tree was 20 years ago. The second best time is now!" - Start saving today!
            </p>
          </div>
        )}

        {/* Garden Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm">
            <p className="text-white/70 text-xs">Seeds Planted</p>
            <p className="text-green-400 font-bold text-lg">{gardenGrowth}/5</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm">
            <p className="text-white/70 text-xs">Coins Harvested</p>
            <p className="text-yellow-400 font-bold text-lg">{totalCoins}</p>
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeMoneyGardener;