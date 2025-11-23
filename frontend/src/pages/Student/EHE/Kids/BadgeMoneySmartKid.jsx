import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeMoneySmartKid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What should you do with money you receive?",
      options: [
        {
          id: "c",
          text: "Spend it all immediately",
          emoji: "💸",
          description: "Not the best approach to money management!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Hide it where no one can find it",
          emoji: "🕵️",
          description: "That's not safe or helpful for growing your money!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Save some, spend some wisely, and share some",
          emoji: "💰",
          description: "Perfect! This balanced approach helps you build good financial habits!",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Why is it important to compare prices before buying?",
      options: [
        {
          id: "b",
          text: "To make shopping take longer",
          emoji: "⏱️",
          description: "That's not the main reason!",
          isCorrect: false
        },
        {
          id: "c",
          text: "To spend as much money as possible",
          emoji: "💸",
          description: "No, comparing prices helps you spend LESS!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To get the best value for your money",
          emoji: "💡",
          description: "Exactly! Comparing prices helps you save money!",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What's the benefit of saving money in a bank?",
      options: [
        {
          id: "b",
          text: "Banks will give you free toys",
          emoji: "トイ",
          description: "Banks don't give free toys!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Banks charge you to hold your money",
          emoji: "❌",
          description: "Actually, many banks pay you to hold your money!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Your money is safe and can earn interest",
          emoji: "🏦",
          description: "Exactly! Banks keep your money safe and pay you interest!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What's the difference between needs and wants?",
      options: [
        {
          id: "c",
          text: "Needs cost more than wants",
          emoji: "🏷️",
          description: "That's not the difference! Price doesn't determine need vs want.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wants are more important than needs",
          emoji: "👑",
          description: "Actually, needs are more important for survival!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Needs are essential for survival, wants make life better",
          emoji: "💡",
          description: "Correct! Needs like food and shelter are essential, while wants like toys make life more enjoyable.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What should you do when you want to buy something expensive?",
      options: [
        {
          id: "b",
          text: "Ask strangers online for money",
          emoji: "🌐",
          description: "That's dangerous! Never share personal information with strangers!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Buy it immediately with borrowed money",
          emoji: "💳",
          description: "That can create financial problems!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Save up for it over time",
          emoji: "⏰",
          description: "Perfect! Saving teaches patience and makes purchases more rewarding!",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Check if user earned the badge (at least 4 correct answers)
        const correctAnswers = [...choices, { question: currentQuestion, optionId, isCorrect }]
          .filter(choice => choice.isCorrect).length;
        
        if (isCorrect && correctAnswers >= 4) {
          setBadgeEarned(true);
        } else if (!isCorrect && correctAnswers >= 4) {
          setBadgeEarned(true);
        }
        
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Badge: Money Smart Kid"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-30"
      gameType="ehe"
      totalLevels={10}
      currentLevel={30}
      showConfetti={gameFinished && badgeEarned}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!gameFinished ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
              <span className="text-yellow-400 font-bold">Coins: {coins}</span>
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-6">
              {getCurrentQuestion().text}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {getCurrentQuestion().options.map(option => {
                const isSelected = choices.some(c => 
                  c.question === currentQuestion && c.optionId === option.id
                );
                const showFeedback = choices.some(c => c.question === currentQuestion);
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    disabled={showFeedback}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-4">{option.emoji}</div>
                      <div>
                        <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                        {showFeedback && isSelected && (
                          <p className="text-white/90">{option.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Money Smart Kid</h2>
            
            {badgeEarned ? (
              <>
                <div className="mb-6">
                  <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 mb-4">
                    <span className="text-6xl">🏆</span>
                  </div>
                  <h3 className="text-3xl font-bold text-yellow-400 mb-2">Congratulations!</h3>
                  <p className="text-xl text-white/90">You've earned the Money Smart Kid Badge!</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Your Achievement</h4>
                  <p className="text-white/80">
                    You correctly identified {choices.filter(c => c.isCorrect).length} out of {questions.length} money smart skills!
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/80 mb-4">
                  You identified {choices.filter(c => c.isCorrect).length} out of {questions.length} money smart skills correctly.
                </p>
                <p className="text-white/80">
                  Continue learning about money management to earn your Money Smart Kid Badge!
                </p>
              </div>
            )}
            
            <div className="mt-6">
              <p className="text-white/70">
                {badgeEarned 
                  ? "You're on your way to becoming a money expert!" 
                  : "Keep exploring money concepts to improve your skills!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeMoneySmartKid;