import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Calculator, PiggyBank, TrendingUp, Target, CheckCircle } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BudgetingQuiz = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const autoAdvanceTimer = useRef(null);

  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalCoins, setTotalCoins] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [earnedBadge, setEarnedBadge] = useState(false);

  const levels = [
    {
      id: 1,
      title: "What is Budget?",
      question: "What is a budget?",
      icon: Calculator,
      options: [
        { text: "A spending plan", correct: true, coins: 10 },
        { text: "A shopping list", correct: false, coins: 0 },
        { text: "Free money", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Right! Budget helps plan spending!",
        wrong: "Budget is a plan for money!"
      }
    },
    {
      id: 2,
      title: "Why Budget?",
      question: "Why make a budget?",
      icon: Target,
      options: [
        { text: "Track expenses and save", correct: true, coins: 15 },
        { text: "Spend all money fast", correct: false, coins: 0 },
        { text: "Just for fun", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! Budgets help save!",
        wrong: "Budgets help track money!"
      }
    },
    {
      id: 3,
      title: "Over Spending",
      question: "Earn ₹100, spend ₹120. What happens?",
      icon: TrendingUp,
      options: [
        { text: "You go into debt", correct: true, coins: 20 },
        { text: "You save ₹20", correct: false, coins: 0 },
        { text: "You win a prize", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Correct! Never spend more than you earn!",
        wrong: "Spending more = debt!"
      }
    },
    {
      id: 4,
      title: "Good Habits",
      question: "Which is a good budgeting habit?",
      icon: CheckCircle,
      options: [
        { text: "List expenses and plan", correct: true, coins: 25 },
        { text: "Guess and spend randomly", correct: false, coins: 0 },
        { text: "Ignore spending", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Great! Planning is key!",
        wrong: "Always plan expenses!"
      }
    },
    {
      id: 5,
      title: "Budget Benefits",
      question: "If you follow budget, you can...",
      icon: PiggyBank,
      options: [
        { text: "Achieve goals stress-free", correct: true, coins: 30 },
        { text: "Buy unnecessary things", correct: false, coins: 0 },
        { text: "Lose track of money", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Budgets = success!",
        wrong: "Budgets help reach goals!"
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
      setTotalCoins(totalCoins + option.coins);
      showCorrectAnswerFeedback(option.coins, true);
      
      if (currentLevel === 5) {
        setEarnedBadge(true);
      }
    }
  };

  const handleNext = () => {
    // clear any pending auto-advance timer when user manually navigates
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }

    if (currentLevel < 5) {
      setCurrentLevel(currentLevel + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      navigate("/games/financial-literacy/kids");
    }
  };

  // Auto-advance to next question after a short delay when an answer is given.
  useEffect(() => {
    if (!answered) return;

    // set a timer to auto-advance after 2 seconds
    autoAdvanceTimer.current = setTimeout(() => {
      if (currentLevel < levels.length) {
        setCurrentLevel((prev) => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      } else {
        navigate("/games/financial-literacy/kids");
      }
      autoAdvanceTimer.current = null;
    }, 2000);

    // cleanup if answered changes again or component unmounts
    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
        autoAdvanceTimer.current = null;
      }
    };
  }, [answered, currentLevel, levels.length, navigate]);

  return (
    <GameShell
      title={`Question ${currentLevel} – ${currentLevelData.title}`}
      subtitle={currentLevelData.question}
      coins={totalCoins}
      currentLevel={currentLevel}
      totalLevels={5}
      onNext={handleNext}
      showConfetti={answered && selectedAnswer?.correct}
      gameId="finance-kids-42"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={totalCoins}
    >
      <div className="text-center text-white space-y-4">
        {/* Icon Display */}
        <div className="flex justify-center mb-3">
          <Icon className="w-16 h-16 text-purple-400 animate-pulse" />
        </div>

        {!answered ? (
          <div className="space-y-2">
            {currentLevelData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-full text-white font-bold hover:scale-105 transition-transform text-sm"
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
              {selectedAnswer.correct ? `+${selectedAnswer.coins} Coins!` : 'Learn More!'}
            </h3>
            <p className="text-white/90 text-sm">
              {selectedAnswer.correct 
                ? currentLevelData.feedback.correct 
                : currentLevelData.feedback.wrong}
            </p>
            
            {earnedBadge && (
              <div className="mt-3 p-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl border-2 border-purple-400">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <Calculator className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-lg font-bold text-purple-300 mb-1">
                  📊 Budget Master! 📊
                </p>
                <p className="text-white/90 text-xs mb-1">
                  You understand budgeting!
                </p>
                <p className="text-green-200 font-bold text-sm">
                  Total: {totalCoins} Coins
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
                    ? 'text-purple-400 animate-pulse'
                    : 'text-gray-600'
                }`}
              />
            );
          })}
        </div>

        {/* Compact Stats */}
        <div className="flex gap-2 justify-center">
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm flex-1 max-w-[120px]">
            <p className="text-white/70 text-xs">Questions</p>
            <p className="text-purple-400 font-bold">{currentLevel}/5</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 backdrop-blur-sm flex-1 max-w-[120px]">
            <p className="text-white/70 text-xs">Coins</p>
            <p className="text-yellow-400 font-bold">{totalCoins}</p>
          </div>
        </div>

        {currentLevel === 5 && answered && (
          <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-400">
            <p className="text-xs text-purple-200">
              💡 Budget = Plan your money wisely!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BudgetingQuiz;