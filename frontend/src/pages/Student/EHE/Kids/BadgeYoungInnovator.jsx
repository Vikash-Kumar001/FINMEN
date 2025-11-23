import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeYoungInnovator = () => {
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
      text: "Which skill helps you come up with new ideas?",
      options: [
        {
          id: "a",
          text: "Creativity",
          emoji: "💡",
          description: "Correct! Creativity is essential for innovation!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Copying others exactly",
          emoji: "📋",
          description: "Copying doesn't create new ideas!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding challenges",
          emoji: "🚫",
          description: "Avoiding challenges limits your creativity!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should you do when you face a problem?",
      options: [
        {
          id: "c",
          text: "Blame others for your problems",
          emoji: "😠",
          description: "Blaming others doesn't fix anything!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Think of different solutions",
          emoji: "🤔",
          description: "Perfect! Problem-solving is key to innovation!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Give up immediately",
          emoji: "🏳️",
          description: "Giving up never solves problems!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can you improve an existing idea?",
      options: [
        {
          id: "c",
          text: "Destroy the original idea",
          emoji: "💣",
          description: "Destruction isn't improvement!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Never change anything",
          emoji: "🔒",
          description: "Sticking to old ways prevents improvement!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Build upon it with new features",
          emoji: "🔧",
          description: "Exactly! Innovation often improves existing ideas!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Why is teamwork important for innovation?",
      options: [
        {
          id: "c",
          text: "To copy what other teams are doing",
          emoji: "📸",
          description: "Copying isn't innovation!",
          isCorrect: false
        },
        {
          id: "b",
          text: "To let one person do all the work",
          emoji: "👤",
          description: "That's not real teamwork!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To combine different skills and perspectives",
          emoji: "🤝",
          description: "Perfect! Diverse perspectives fuel innovation!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What's the best way to learn from failure?",
      options: [
        {
          id: "c",
          text: "Never try anything new again",
          emoji: "🛡️",
          description: "Avoiding risks stops innovation!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Analyze what went wrong and improve",
          emoji: "📈",
          description: "Exactly! Learning from failure drives innovation!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hide your mistakes from everyone",
          emoji: "🙈",
          description: "Hiding mistakes prevents learning!",
          isCorrect: false
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
      title="Badge: Young Innovator"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-20"
      gameType="ehe"
      totalLevels={10}
      currentLevel={20}
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
            <h2 className="text-2xl font-bold text-white mb-6">Young Innovator</h2>
            
            {badgeEarned ? (
              <>
                <div className="mb-6">
                  <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 mb-4">
                    <span className="text-6xl">🏆</span>
                  </div>
                  <h3 className="text-3xl font-bold text-yellow-400 mb-2">Congratulations!</h3>
                  <p className="text-xl text-white/90">You've earned the Young Innovator Badge!</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Your Achievement</h4>
                  <p className="text-white/80">
                    You correctly identified {choices.filter(c => c.isCorrect).length} out of {questions.length} innovation skills!
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Keep Innovating!</h3>
                <p className="text-white/80 mb-4">
                  You identified {choices.filter(c => c.isCorrect).length} out of {questions.length} innovation skills correctly.
                </p>
                <p className="text-white/80">
                  Continue learning about innovation to earn your Young Innovator Badge!
                </p>
              </div>
            )}
            
            <div className="mt-6">
              <p className="text-white/70">
                {badgeEarned 
                  ? "You're on your way to becoming an innovation expert!" 
                  : "Keep exploring innovation concepts to improve your skills!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeYoungInnovator;