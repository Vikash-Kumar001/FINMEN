import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Coins, Sparkles, Star, Award, DollarSign } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeYoungEarner = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-80";
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
      title: "Chores",
      question: "What's a good way to earn pocket money at home?",
      icon: Sparkles,
      item: "Chores",
      options: [
        { text: "Demand money for nothing", correct: false, coins: 0 },
        { text: "Take from parents' wallet", correct: false, coins: 0 },
        { text: "Do chores like cleaning room", correct: true, coins: 1 },
      ],
      feedback: {
        correct: "Excellent! Doing chores teaches responsibility and earns money fairly!",
        wrong: "Earning money through work like chores is the right way - not demanding or taking!"
      }
    },
    {
      id: 2,
      title: "Selling",
      question: "You have toys you don't use. What's smart?",
      icon: Star,
      item: "Selling",
      options: [
        { text: "Sell them to earn money", correct: true, coins: 1 },
        { text: "Throw them in trash", correct: false, coins: 0 },
        { text: "Hoard them forever", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! Selling unused items is a smart way to earn money and declutter!",
        wrong: "Selling unused toys is better than throwing them away or hoarding them!"
      }
    },
    {
      id: 3,
      title: "Teaching",
      question: "You're good at drawing. How can you earn?",
      icon: Award,
      item: "Teaching",
      options: [
        { text: "Keep skills to myself", correct: false, coins: 0 },
        { text: "Copy others' work", correct: false, coins: 0 },
        { text: "Teach friends for small fee", correct: true, coins: 1 },
      ],
      feedback: {
        correct: "Amazing! Using your skills to teach others is a great way to earn money!",
        wrong: "Sharing your skills by teaching others is a smart way to earn money!"
      }
    },
    {
      id: 4,
      title: "Crafts",
      question: "School fair is coming. What's a good earning idea?",
      icon: Coins,
      item: "Crafts",
      options: [
        { text: "Do nothing and watch", correct: false, coins: 0 },
        { text: "Make crafts and sell them", correct: true, coins: 1 },
        { text: "Steal others' ideas", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Great! Making and selling crafts at school fairs is a fun way to earn money!",
        wrong: "Creating and selling your own crafts is a creative way to earn money!"
      }
    },
    {
      id: 5,
      title: "Studying",
      question: "Parents offer money for good grades. What do you do?",
      icon: DollarSign,
      item: "Studying",
      options: [
        { text: "Study hard and earn fairly", correct: true, coins: 1 },
        { text: "Cheat on tests", correct: false, coins: 0 },
        { text: "Make excuses for bad grades", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Wonderful! Earning money through honest hard work and good grades is the right way!",
        wrong: "Always earn money honestly through hard work, not by cheating or making excuses!"
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
      title="Badge: Young Earner"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Test your earning knowledge!` : "Badge Earned!"}
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
              <Icon className="w-16 h-16 text-yellow-400" />
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

export default BadgeYoungEarner;
