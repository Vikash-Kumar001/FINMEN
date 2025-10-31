import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Book, Pencil, Smartphone, Umbrella, Gift } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeGoodBorrower = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback } = useGameFeedback();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalCoins, setTotalCoins] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [earnedBadge, setEarnedBadge] = useState(false);

  const levels = [
    {
      id: 1,
      title: "Borrowed Book",
      question: "Your friend lent you a storybook last week. What should you do?",
      icon: Book,
      item: "Book",
      options: [
        { text: "Return it clean and on time", correct: true, coins: 10 },
        { text: "Keep it forever", correct: false, coins: 0 },
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
        { text: "Replace it with a new pencil", correct: true, coins: 15 },
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
        { text: "Clean it and return with thanks", correct: true, coins: 20 },
        { text: "Return with low battery", correct: false, coins: 0 },
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
        { text: "As soon as possible, dried and clean", correct: true, coins: 25 },
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
        { text: "Take extra care and return it safely", correct: true, coins: 30 },
        { text: "Play rough - it's just a toy", correct: false, coins: 0 },
        { text: "Trade it with friends", correct: false, coins: 0 }
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
      onNext={currentLevel === 5 && answered ? () => navigate("/games/financial-literacy/kids") : null}
      nextEnabled={currentLevel === 5 && answered}
      nextLabel={"Finish & Claim Badge"}
      showConfetti={answered && selectedAnswer?.correct}
      score={totalCoins}
      gameId="finance-kids-110"
      gameType="finance"
    >
      <div className="text-center space-y-8 text-white">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Icon className="w-24 h-24 text-green-400 animate-bounce" />
            {answered && selectedAnswer?.correct && (
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        </div>

        {!answered ? (
          <div className="space-y-4">
            {currentLevelData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 rounded-full text-white font-bold hover:scale-105 transition-transform hover:shadow-lg"
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
              {selectedAnswer.correct ? `+${selectedAnswer.coins} Coins!` : 'Think Again!'}
            </h3>
            <p className="text-white/90 text-lg">
              {selectedAnswer.correct 
                ? currentLevelData.feedback.correct 
                : currentLevelData.feedback.wrong}
            </p>
            
            {earnedBadge && (
              <div className="mt-6 p-6 bg-gradient-to-r from-yellow-500/30 to-green-500/30 rounded-xl border-2 border-yellow-400 animate-pulse">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Trophy className="w-12 h-12 text-yellow-400" />
                  <Gift className="w-12 h-12 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-yellow-300 mb-2">
                  🏆 Good Borrower Badge Unlocked! 🏆
                </p>
                <p className="text-white/90">
                  You've proven you're a responsible borrower!
                </p>
                <p className="text-green-200 font-bold mt-2">
                  Total Coins Earned: {totalCoins} 💰
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
                  ? 'bg-yellow-400 animate-pulse'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {currentLevel === 5 && answered && (
          <div className="mt-4 p-4 bg-green-500/20 rounded-lg border border-green-400">
            <p className="text-sm text-green-200">
              💡 Remember: "Neither a borrower nor a lender be careless!" - Always be responsible!
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-white/5 rounded-lg backdrop-blur-sm">
          <p className="text-white/70 text-sm">
            Items Returned: {currentLevel - 1}/5
          </p>
          <div className="mt-2 flex justify-center gap-2">
            {levels.slice(0, currentLevel - 1).map((level) => (
              <level.icon key={level.id} className="w-6 h-6 text-green-400" />
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default BadgeGoodBorrower;