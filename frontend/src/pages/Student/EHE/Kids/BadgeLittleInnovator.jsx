import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeLittleInnovator = () => {
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
      text: "What's the first step in solving a problem creatively?",
      options: [
        {
          id: "c",
          text: "Copy someone else's solution",
          emoji: "📋",
          description: "That's not creative problem-solving!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Give up immediately",
          emoji: "🏳️",
          description: "That's not how innovators think!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Understand the problem deeply",
          emoji: "🔍",
          description: "Perfect! Deep understanding is key to innovation!",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "How can you generate new ideas?",
      options: [
        {
          id: "b",
          text: "Only think by yourself",
          emoji: "👤",
          description: "Collaboration often sparks better ideas!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stick to obvious solutions",
          emoji: "😴",
          description: "That's not creative thinking!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Brainstorm and think differently",
          emoji: "💭",
          description: "Exactly! Diverse thinking leads to innovation!",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What should you do with your ideas?",
      options: [
        {
          id: "b",
          text: "Keep them to yourself forever",
          emoji: "🔒",
          description: "Sharing ideas can lead to improvement!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Implement them without testing",
          emoji: "⚡",
          description: "Testing helps refine ideas!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Test and improve them",
          emoji: "🧪",
          description: "Perfect! Iteration makes ideas better!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Why is it important to learn from failures?",
      options: [
        {
          id: "c",
          text: "To avoid all future challenges",
          emoji: "🛡️",
          description: "That's not realistic or helpful!",
          isCorrect: false
        },
        {
          id: "b",
          text: "To blame others for mistakes",
          emoji: "😠",
          description: "That doesn't help learning!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To improve and grow stronger",
          emoji: "📈",
          description: "Exactly! Failures are learning opportunities!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What makes a good innovation mindset?",
      options: [
        {
          id: "b",
          text: "Being afraid to try new things",
          emoji: "😨",
          description: "Fear blocks innovation!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copying everything others do",
          emoji: "📸",
          description: "That's not innovation!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Being curious and persistent",
          emoji: "🚀",
          description: "Perfect! Curiosity and persistence drive innovation!",
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
      title="Badge: Little Innovator"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-40"
      gameType="ehe"
      totalLevels={10}
      currentLevel={40}
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
            <h2 className="text-2xl font-bold text-white mb-6">Little Innovator</h2>
            
            {badgeEarned ? (
              <>
                <div className="mb-6">
                  <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 mb-4">
                    <span className="text-6xl">🏆</span>
                  </div>
                  <h3 className="text-3xl font-bold text-yellow-400 mb-2">Congratulations!</h3>
                  <p className="text-xl text-white/90">You've earned the Little Innovator Badge!</p>
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
                  Continue learning about innovation to earn your Little Innovator Badge!
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

export default BadgeLittleInnovator;