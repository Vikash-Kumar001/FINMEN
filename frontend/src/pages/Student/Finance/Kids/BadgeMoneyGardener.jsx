import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sprout, TreePine, Flower2, Leaf, Award } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeMoneyGardener = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-70";
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
      title: "Birthday Money",
      question: "You got 100 rupees for your birthday. What will you do?",
      icon: Sprout,
      options: [
        { text: "Spend all on candy today", correct: false },
        { text: "Save 80, spend 20 - Plant seeds for growth", correct: true },
        { text: "Give all away immediately", correct: false }
      ],
      feedback: {
        correct: "Excellent! Saving most of your money helps it grow like a seed!",
        wrong: "Remember, saving money helps it grow - like planting seeds in a garden!"
      }
    },
    {
      id: 2,
      title: "Friend's New Toy",
      question: "Your friend bought a new toy, but you're saving. What do you do?",
      icon: Leaf,
      options: [
        { text: "Stay patient, keep saving for bigger goals", correct: true },
        { text: "Break your piggy bank for instant fun", correct: false },
        { text: "Feel sad and give up saving", correct: false }
      ],
      feedback: {
        correct: "Perfect! Patience helps your money garden grow bigger and better!",
        wrong: "Stay patient! Your savings will grow into something even better!"
      }
    },
    {
      id: 3,
      title: "Toy Goal",
      question: "You want a 500 rupee toy but have only 300 saved. What's the smart choice?",
      icon: TreePine,
      options: [
        { text: "Borrow from parents and buy now", correct: false },
        { text: "Buy a cheaper toy you don't want", correct: false },
        { text: "Save 200 more before buying - Let it grow!", correct: true },
      ],
      feedback: {
        correct: "Amazing! Saving until you have enough is the smart gardener's way!",
        wrong: "Keep saving until you reach your goal - that's how money gardens grow!"
      }
    },
    {
      id: 4,
      title: "Grandma's Offer",
      question: "Your piggy bank is full! Grandma offers to add 10% to your savings if you wait one month. What do you choose?",
      icon: Flower2,
      options: [
        { text: "Wait one month - Money can make money!", correct: true },
        { text: "Take money out immediately", correct: false },
        { text: "Spend half now, save half", correct: false }
      ],
      feedback: {
        correct: "Great! Waiting for your money to grow is what smart gardeners do!",
        wrong: "When money can make more money, wait and let it grow!"
      }
    },
    {
      id: 5,
      title: "Big Savings",
      question: "After months of saving, you have 1000 rupees! What's the wisest choice?",
      icon: Award,
      options: [
        { text: "Spend everything at once", correct: false },
        { text: "Never spend, just keep saving forever", correct: false },
        { text: "Keep 800 saved, spend 200 on something special", correct: true },
      ],
      feedback: {
        correct: "Wonderful! Balancing saving and spending makes you a true money gardener!",
        wrong: "A good money gardener saves most but enjoys some rewards too!"
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
    
    // Show feedback for 2 seconds, then move to next question or show results
    setTimeout(() => {
      if (isLastQuestion) {
        // This is the last question (5th), show results
        setShowResult(true);
      } else {
        // Move to next question
        setCurrentLevel(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const finalScore = score;

  return (
    <GameShell
      title="Badge: Money Gardener"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Test your money gardening knowledge!` : "Badge Earned!"}
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
            
            <div className="space-y-4">
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

export default BadgeMoneyGardener;
