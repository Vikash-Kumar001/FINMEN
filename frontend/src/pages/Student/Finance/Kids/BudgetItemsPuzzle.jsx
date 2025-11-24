import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, ShoppingBag, Apple, Gamepad2, Book, Home } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BudgetItemsPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-44";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const [currentLevel, setCurrentLevel] = useState(1);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [earnedBadge, setEarnedBadge] = useState(false);

  const levels = [
    {
      id: 1,
      title: "Food",
      question: "Is Food a Need or Want?",
      icon: Apple,
      item: "Food",
      correctAnswer: "Need",
      options: [
        { text: "Need - Must have to live", correct: true, coins: 10 },
        { text: "Want - Nice to have", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Right! Food is essential to survive!",
        wrong: "Food is a basic need for life!"
      }
    },
    {
      id: 2,
      title: "Toys",
      question: "Are Toys a Need or Want?",
      icon: ShoppingBag,
      item: "Toys",
      correctAnswer: "Want",
      options: [
        { text: "Need - Must have to live", correct: false, coins: 0 },
        { text: "Want - Nice to have", correct: true, coins: 15 }
      ],
      feedback: {
        correct: "Correct! Toys are fun but not essential!",
        wrong: "Toys are wants, not needs!"
      }
    },
    {
      id: 3,
      title: "Books",
      question: "Are School Books a Need or Want?",
      icon: Book,
      item: "Books",
      correctAnswer: "Need",
      options: [
        { text: "Need - Required for education", correct: true, coins: 20 },
        { text: "Want - Optional fun", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! Books are needed for learning!",
        wrong: "School books are essential needs!"
      }
    },
    {
      id: 4,
      title: "Games",
      question: "Are Video Games a Need or Want?",
      icon: Gamepad2,
      item: "Games",
      correctAnswer: "Want",
      options: [
        { text: "Need - Can't live without", correct: false, coins: 0 },
        { text: "Want - Entertainment choice", correct: true, coins: 25 }
      ],
      feedback: {
        correct: "Great! Games are wants, not needs!",
        wrong: "Games are fun wants, not needs!"
      }
    },
    {
      id: 5,
      title: "Shelter",
      question: "Is a Home/Shelter a Need or Want?",
      icon: Home,
      item: "Shelter",
      correctAnswer: "Need",
      options: [
        { text: "Need - Basic protection", correct: true, coins: 30 },
        { text: "Want - Luxury item", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Shelter is a basic human need!",
        wrong: "Home is essential for safety and survival!"
      }
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData.icon;

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    setAnswered(true);
    resetFeedback();
    
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
      onNext={answered ? handleNext : null}
      nextEnabled={answered}
      nextLabel={currentLevel === 5 ? "Finish" : "Next"}
      showConfetti={answered && selectedAnswer?.correct}
      gameId="finance-kids-44"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={earnedCoins}
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-4">
        {/* Icon Display */}
        <div className="flex justify-center mb-3">
          <Icon className="w-16 h-16 text-orange-400 animate-bounce" />
        </div>

        {/* Item Label */}
        <div className="bg-orange-900/30 backdrop-blur-sm rounded-lg p-2 border border-orange-500/30 max-w-xs mx-auto">
          <p className="text-orange-300 font-semibold text-sm">
            {currentLevelData.item}
          </p>
        </div>

        {!answered ? (
          <div className="space-y-2">
            {currentLevelData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full ${
                  option.correct 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                } px-6 py-3 rounded-full text-white font-bold hover:scale-105 transition-transform text-sm`}
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
              {selectedAnswer.correct ? `+${selectedAnswer.coins} Coins!` : 'Think Again!'}
            </h3>
            <p className="text-white/90 text-sm">
              {selectedAnswer.correct 
                ? currentLevelData.feedback.correct 
                : currentLevelData.feedback.wrong}
            </p>
            
            {earnedBadge && (
              <div className="mt-3 p-3 bg-gradient-to-r from-orange-500/30 to-yellow-500/30 rounded-xl border-2 border-orange-400">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <ShoppingBag className="w-8 h-8 text-orange-400" />
                </div>
                <p className="text-lg font-bold text-orange-300 mb-1">
                  🧩 Puzzle Master! 🧩
                </p>
                <p className="text-white/90 text-xs mb-1">
                  You know Needs vs Wants!
                </p>
                <p className="text-green-200 font-bold text-sm">
                  Total: {earnedCoins} Coins
                </p>
              </div>
            )}
          </div>
        )}

        {/* Progress Items */}
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
                    ? 'text-orange-400 animate-pulse'
                    : 'text-gray-600'
                }`}
              />
            );
          })}
        </div>

        {/* Compact Stats */}
        <div className="flex gap-2 justify-center">
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm flex-1 max-w-[120px]">
            <p className="text-white/70 text-xs">Matched</p>
            <p className="text-orange-400 font-bold">{currentLevel}/5</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm flex-1 max-w-[120px]">
            <p className="text-white/70 text-xs">Coins</p>
            <p className="text-yellow-400 font-bold">{earnedCoins}</p>
          </div>
        </div>

        {currentLevel === 5 && answered && (
          <div className="p-2 bg-orange-500/20 rounded-lg border border-orange-400">
            <p className="text-xs text-orange-200">
              💡 Needs = Essential, Wants = Optional!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BudgetItemsPuzzle;