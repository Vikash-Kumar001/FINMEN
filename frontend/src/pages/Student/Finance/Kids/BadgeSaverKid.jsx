import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PiggyBank, Wallet, Coins, TrendingUp, Target } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeSaverKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-10";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti, resetFeedback } = useGameFeedback();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const levels = [
    {
      id: 1,
      title: "Piggy Bank",
      question: "What is the best way to save money?",
      icon: PiggyBank,
      item: "Piggy Bank",
      options: [
        { text: "Save a little bit regularly", correct: true, coins: 1 },
        { text: "Spend everything first", correct: false, coins: 0 },
        { text: "Save only when you have a lot", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Regular saving, even small amounts, builds good habits!",
        wrong: "The best way to save is to save a little bit regularly, not just when you have a lot!"
      }
    },
    {
      id: 2,
      title: "Wallet",
      question: "Where should you keep your savings?",
      icon: Wallet,
      item: "Wallet",
      options: [
        { text: "Under your bed", correct: false, coins: 0 },
        { text: "Spend it all immediately", correct: false, coins: 0 },
        { text: "In a safe place like a bank", correct: true, coins: 1 },
      ],
      feedback: {
        correct: "Perfect! Keeping money in a bank keeps it safe and can help it grow!",
        wrong: "Banks are the safest place to keep your savings - they protect your money!"
      }
    },
    {
      id: 3,
      title: "Coins",
      question: "What should you do with extra money?",
      icon: Coins,
      item: "Coins",
      options: [
        { text: "Save it for future goals", correct: true, coins: 1 },
        { text: "Spend it all right away", correct: false, coins: 0 },
        { text: "Lose it or forget about it", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Amazing! Saving extra money helps you reach your goals faster!",
        wrong: "Extra money should be saved for future goals, not spent immediately!"
      }
    },
    {
      id: 4,
      title: "Growing Money",
      question: "Why is saving money important?",
      icon: TrendingUp,
      item: "Growing Money",
      options: [
        { text: "It's not important at all", correct: false, coins: 0 },
        { text: "It helps you reach your goals", correct: true, coins: 1 },
        { text: "You should never save", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Great! Saving money helps you achieve your dreams and goals!",
        wrong: "Saving money is very important - it helps you reach your goals and be prepared!"
      }
    },
    {
      id: 5,
      title: "Saving Goal",
      question: "What is a good saving habit?",
      icon: Target,
      item: "Saving Goal",
      options: [
        { text: "Never save anything", correct: false, coins: 0 },
        { text: "Spend more than you have", correct: false, coins: 0 },
        { text: "Set goals and save regularly", correct: true, coins: 1 }
      ],
      feedback: {
        correct: "Wonderful! Setting goals and saving regularly makes you a smart saver!",
        wrong: "Good saving habits include setting goals and saving money regularly!"
      }
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData.icon;

  const handleAnswer = (option) => {
    if (answered) return; // Prevent multiple clicks
    
    setSelectedAnswer(option);
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = option.correct;
    const isLastQuestion = currentLevel === 5;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentLevel(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const finalScore = score;

  return (
    <GameShell
      title="Badge: Saver Kid"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Test your saving knowledge!` : "Badge Earned!"}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-6">
        {!showResult && currentLevelData && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="flex justify-center mb-4">
              <Icon className="w-16 h-16 text-green-400" />
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentLevel} of 5</span>
              <span className="text-yellow-400 font-bold">Score: {score}/5</span>
            </div>
            
            <p className="text-white text-lg mb-6 text-center">
              {currentLevelData.question}
            </p>
            
            <div className="grid sm:grid-cols-3 gap-3">
              {currentLevelData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className="w-full min-h-[60px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-8 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {option.text}
                </button>
              ))}
            </div>
            
            {answered && selectedAnswer && (
              <div className={`mt-4 p-4 rounded-xl ${
                selectedAnswer.correct
                  ? 'bg-green-500/20 border-2 border-green-400' 
                  : 'bg-red-500/20 border-2 border-red-400'
              }`}>
                <p className="text-white font-semibold">
                  {selectedAnswer.correct
                    ? currentLevelData.feedback.correct
                    : currentLevelData.feedback.wrong}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeSaverKid;
