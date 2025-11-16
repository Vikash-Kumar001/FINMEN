import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BadgePathExplorerKid = () => {
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
      text: "What's an important factor when choosing a career path?",
      options: [
        {
          id: "c",
          text: "Only what pays the most money",
          emoji: "💰",
          description: "Money is important but not the only factor!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only what your friends are doing",
          emoji: "👥",
          description: "Your path should be based on your own interests!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Your interests, skills, and values",
          emoji: "🎯",
          description: "Perfect! Personal interests, skills, and values are key factors!",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Why is it important to explore different paths?",
      options: [
        {
          id: "b",
          text: "To copy others exactly",
          emoji: "📋",
          description: "Exploration is about finding your own path!",
          isCorrect: false
        },
        {
          id: "c",
          text: "To avoid making decisions",
          emoji: "🤔",
          description: "Exploration helps you make informed decisions!",
          isCorrect: false
        },
        {
          id: "a",
          text: "To find what fits you best",
          emoji: "🔍",
          description: "Exactly! Exploration helps you find your best fit!",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What's a benefit of vocational training?",
      options: [
        {
          id: "b",
          text: "No need to work hard",
          emoji: "😴",
          description: "All paths require dedication and hard work!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Automatic success",
          emoji: "🚀",
          description: "Training helps but doesn't guarantee success!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Practical skills for specific careers",
          emoji: "🔧",
          description: "Perfect! Vocational training provides practical, job-specific skills!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "How can apprenticeships benefit someone?",
      options: [
        {
          id: "c",
          text: "Free money without work",
          emoji: "💸",
          description: "Apprenticeships involve learning and working!",
          isCorrect: false
        },
        {
          id: "b",
          text: "Avoiding all responsibilities",
          emoji: "😴",
          description: "Apprenticeships teach responsibility!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Paid learning with mentorship",
          emoji: "👨‍🏫",
          description: "Exactly! Apprenticeships offer paid learning with mentorship!",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What should you do to prepare for your future path?",
      options: [
        {
          id: "b",
          text: "Wait for opportunities to come",
          emoji: "⏳",
          description: "Proactive preparation is more effective!",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only focus on one option",
          emoji: " tunnel vision",
          description: "Keep an open mind to various possibilities!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Explore options and build skills",
          emoji: "🛠️",
          description: "Perfect! Exploring options and building skills prepares you well!",
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
      title="Badge: Path Explorer Kid"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-60"
      gameType="ehe"
      totalLevels={10}
      currentLevel={60}
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
            <h2 className="text-2xl font-bold text-white mb-6">Path Explorer Kid</h2>
            
            {badgeEarned ? (
              <>
                <div className="mb-6">
                  <div className="inline-block bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 mb-4">
                    <span className="text-6xl">🏆</span>
                  </div>
                  <h3 className="text-3xl font-bold text-yellow-400 mb-2">Congratulations!</h3>
                  <p className="text-xl text-white/90">You've earned the Path Explorer Kid Badge!</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10 mb-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Your Achievement</h4>
                  <p className="text-white/80">
                    You correctly identified {choices.filter(c => c.isCorrect).length} out of {questions.length} pathway planning skills!
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Keep Exploring Paths!</h3>
                <p className="text-white/80 mb-4">
                  You identified {choices.filter(c => c.isCorrect).length} out of {questions.length} pathway planning skills correctly.
                </p>
                <p className="text-white/80">
                  Continue learning about career pathways to earn your Path Explorer Kid Badge!
                </p>
              </div>
            )}
            
            <div className="mt-6">
              <p className="text-white/70">
                {badgeEarned 
                  ? "You're on your way to becoming a pathway expert!" 
                  : "Keep exploring career pathways to improve your skills!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgePathExplorerKid;