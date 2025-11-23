import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeFutureJobExplorer = () => {
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
      text: "What is an AI Engineer?",
      options: [
        {
          id: "a",
          text: "Creates artificial intelligence systems",
          emoji: "🤖",
          description: "Perfect! AI Engineers develop intelligent systems!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Trains animals",
          emoji: "🐶",
          description: "Animal trainers work with real animals, not artificial intelligence!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Sells robots",
          emoji: "🏪",
          description: "Salespeople sell products, but AI Engineers create them!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why are green energy jobs important?",
      options: [
        {
          id: "a",
          text: "They help protect the environment",
          emoji: "🌱",
          description: "Exactly! Green energy jobs contribute to environmental protection!",
          isCorrect: true
        },
        {
          id: "b",
          text: "They pollute the air",
          emoji: "💨",
          description: "Green energy jobs reduce pollution, not increase it!",
          isCorrect: false
        },
        {
          id: "c",
          text: "They're easy to get",
          emoji: "😴",
          description: "All jobs require effort, but green energy jobs have environmental benefits!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What does a Data Scientist do?",
      options: [
        {
          id: "a",
          text: "Analyzes complex information",
          emoji: "📊",
          description: "Perfect! Data Scientists analyze large amounts of data!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only plays with data",
          emoji: "🎮",
          description: "Data Science is serious analytical work!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Cleans offices",
          emoji: "🧹",
          description: "Janitors clean offices, not analyze data!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is a Drone Pilot?",
      options: [
        {
          id: "a",
          text: "Operates unmanned aircraft",
          emoji: "🚁",
          description: "Exactly! Drone Pilots control flying robots!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Drives cars",
          emoji: "🚗",
          description: "Car drivers operate ground vehicles, not drones!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Sails boats",
          emoji: "⛵",
          description: "Sailors work with water vessels, not flying drones!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is it important to explore future careers?",
      options: [
        {
          id: "a",
          text: "To prepare for changing job markets",
          emoji: "📈",
          description: "Perfect! Exploring helps you adapt to future opportunities!",
          isCorrect: true
        },
        {
          id: "b",
          text: "To avoid all changes",
          emoji: "🔒",
          description: "Being open to change helps you succeed in the future!",
          isCorrect: false
        },
        {
          id: "c",
          text: "To stick to old jobs only",
          emoji: "🕰️",
          description: "While traditional jobs are valuable, new opportunities are also important!",
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
      title="Badge: Future Job Explorer"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-80"
      gameType="ehe"
      totalLevels={10}
      currentLevel={80}
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
            <h2 className="text-2xl font-bold text-white mb-6">Future Job Explorer</h2>
            
            {badgeEarned ? (
              <>
                <div className="mb-6">
                  <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 mb-4">
                    <span className="text-6xl">🏆</span>
                  </div>
                  <h3 className="text-3xl font-bold text-yellow-400 mb-2">Congratulations!</h3>
                  <p className="text-xl text-white/90">You've earned the Future Job Explorer Badge!</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Your Achievement</h4>
                  <p className="text-white/80">
                    You correctly identified {choices.filter(c => c.isCorrect).length} out of {questions.length} emerging career concepts!
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Keep Exploring Careers!</h3>
                <p className="text-white/80 mb-4">
                  You identified {choices.filter(c => c.isCorrect).length} out of {questions.length} emerging career concepts correctly.
                </p>
                <p className="text-white/80">
                  Continue learning about future careers to earn your Future Job Explorer Badge!
                </p>
              </div>
            )}
            
            <div className="mt-6">
              <p className="text-white/70">
                {badgeEarned 
                  ? "You're on your way to becoming a career expert!" 
                  : "Keep exploring future job opportunities to improve your skills!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeFutureJobExplorer;