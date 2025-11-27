import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Book, Pencil, Smartphone, Umbrella, Gift } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeGoodBorrower = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-60";
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
      title: "Borrowed Book",
      question: "Your friend lent you a storybook last week. What should you do?",
      icon: Book,
      item: "Book",
      options: [
        { text: "Keep it forever", correct: false, coins: 0 },
        { text: "Return it clean and on time", correct: true, coins: 1 },
        { text: "Give it to someone else", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Returning borrowed items on time builds trust!",
        wrong: "Always return what you borrow - it shows respect and responsibility!"
      }
    },
    {
      id: 2,
      title: "Borrowed Pencil",
      question: "You borrowed a pencil from your classmate. It broke while using. What now?",
      icon: Pencil,
      item: "Pencil",
      options: [
        { text: "Replace it with a new pencil", correct: true, coins: 1 },
        { text: "Return the broken pencil only", correct: false, coins: 0 },
        { text: "Don't return anything", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! Good borrowers replace damaged items. That's being responsible!",
        wrong: "If you damage something borrowed, always replace it!"
      }
    },
    {
      id: 3,
      title: "Borrowed Phone",
      question: "Your cousin let you use their phone to play games. How should you return it?",
      icon: Smartphone,
      item: "Phone",
      options: [
        { text: "Return with low battery", correct: false, coins: 0 },
        { text: "Clean it and return with thanks", correct: true, coins: 1 },
        { text: "Delete all their apps first", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Amazing! Returning items in good condition shows you're trustworthy!",
        wrong: "Always return borrowed items in the same or better condition!"
      }
    },
    {
      id: 4,
      title: "Borrowed Umbrella",
      question: "Your neighbor lent you an umbrella when it was raining. When should you return it?",
      icon: Umbrella,
      item: "Umbrella",
      options: [
        { text: "As soon as possible, dried and clean", correct: true, coins: 1 },
        { text: "Wait until next rain", correct: false, coins: 0 },
        { text: "Keep it for emergencies", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Great! Prompt returns show appreciation and build good relationships!",
        wrong: "Don't wait - return borrowed items quickly so others can use them!"
      }
    },
    {
      id: 5,
      title: "Borrowed Toy",
      question: "Your sibling lent you their favorite toy. How do you handle it?",
      icon: Gift,
      item: "Toy",
      options: [
        { text: "Play rough - it's just a toy", correct: false, coins: 0 },
        { text: "Trade it with friends", correct: false, coins: 0 },
        { text: "Take extra care and return it safely", correct: true, coins: 1 },
      ],
      feedback: {
        correct: "Wonderful! Treating borrowed items with care makes you a trusted borrower!",
        wrong: "Treat borrowed items even better than your own - especially favorites!"
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
      title="Badge: Good Borrower"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Test your borrowing knowledge!` : "Badge Earned!"}
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

export default BadgeGoodBorrower;