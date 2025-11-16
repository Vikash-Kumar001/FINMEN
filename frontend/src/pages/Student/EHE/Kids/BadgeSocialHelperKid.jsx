import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgeSocialHelperKid = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What is social entrepreneurship?",
      options: [
        {
          id: "a",
          text: "Business for social good",
          emoji: "🤝",
          description: "Perfect! Using business methods to solve social problems!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only making money",
          emoji: "💰",
          description: "Social entrepreneurship focuses on social impact, not just profit!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Government work",
          emoji: "🏛️",
          description: "While governments help, social entrepreneurship is independent!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why is reducing food waste important?",
      options: [
        {
          id: "a",
          text: "Helps environment and people",
          emoji: "🌍",
          description: "Exactly! Reduces environmental impact and helps those in need!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only saves money",
          emoji: "💸",
          description: "While it saves money, the environmental and social benefits are greater!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Makes more garbage",
          emoji: "🗑️",
          description: "Reducing waste means less garbage, not more!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What are eco-friendly alternatives to plastic?",
      options: [
        {
          id: "a",
          text: "Cloth, jute, paper bags",
          emoji: "🌿",
          description: "Perfect! These materials are biodegradable and reusable!",
          isCorrect: true
        },
        {
          id: "b",
          text: "More plastic bags",
          emoji: "🛍️",
          description: "More plastic increases pollution!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Throwing them away",
          emoji: "🗑️",
          description: "Disposal isn't a solution to plastic pollution!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How does solar energy help villages?",
      options: [
        {
          id: "a",
          text: "Provides clean, renewable power",
          emoji: "💡",
          description: "Exactly! Solar energy enables education and economic activities!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only looks nice",
          emoji: "✨",
          description: "While solar installations look modern, their real value is functional!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Makes noise",
          emoji: "🔊",
          description: "Solar panels actually operate silently!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What makes a business ethical?",
      options: [
        {
          id: "a",
          text: "Fair treatment and transparency",
          emoji: "⚖️",
          description: "Perfect! Ethical businesses treat everyone fairly and honestly!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only high profits",
          emoji: "📈",
          description: "Profits are important, but ethics are about fair treatment!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignoring problems",
          emoji: "🙈",
          description: "Ethical businesses actively solve problems!",
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
      title="Badge: Social Helper Kid"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-90"
      gameType="ehe"
      totalLevels={10}
      currentLevel={90}
      showConfetti={gameFinished && badgeEarned}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
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
            <h2 className="text-2xl font-bold text-white mb-6">Social Helper Kid</h2>
            
            {badgeEarned ? (
              <>
                <div className="mb-6">
                  <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 mb-4">
                    <span className="text-6xl">🏆</span>
                  </div>
                  <h3 className="text-3xl font-bold text-yellow-400 mb-2">Congratulations!</h3>
                  <p className="text-xl text-white/90">You've earned the Social Helper Kid Badge!</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Your Achievement</h4>
                  <p className="text-white/80">
                    You correctly identified {choices.filter(c => c.isCorrect).length} out of {questions.length} social entrepreneurship concepts!
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Keep Helping Society!</h3>
                <p className="text-white/80 mb-4">
                  You identified {choices.filter(c => c.isCorrect).length} out of {questions.length} social entrepreneurship concepts correctly.
                </p>
                <p className="text-white/80">
                  Continue learning about social impact to earn your Social Helper Kid Badge!
                </p>
              </div>
            )}
            
            <div className="mt-6">
              <p className="text-white/70">
                {badgeEarned 
                  ? "You're on your way to becoming a social change expert!" 
                  : "Keep exploring social entrepreneurship to improve your skills!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeSocialHelperKid;