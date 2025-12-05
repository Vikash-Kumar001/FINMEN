import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const OnlineCourseSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-94");
  const gameId = gameData?.id || "dcos-teen-94";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You have free time. What should you do?",
      options: [
        { 
          id: "binge", 
          text: "Random video binge", 
          emoji: "📺", 
          description: "Watch random videos all day",
          isCorrect: false
        },
        { 
          id: "coding", 
          text: "Enroll in coding course", 
          emoji: "✅", 
          description: "Learn valuable skills",
          isCorrect: true
        },
        { 
          id: "scroll", 
          text: "Scroll social media", 
          emoji: "📱", 
          description: "Spend time on social media",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the best use of your time online?",
      options: [
        { 
          id: "watch-shows", 
          text: "Watch entertainment shows", 
          emoji: "📺", 
          description: "Watch entertainment content",
          isCorrect: false
        },
        { 
          id: "learn-skills", 
          text: "Take an online course to learn skills", 
          emoji: "✅", 
          description: "Develop new skills",
          isCorrect: true
        },
        { 
          id: "play-games", 
          text: "Play games all day", 
          emoji: "🎮", 
          description: "Spend time gaming",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should you use technology for growth?",
      options: [
        { 
          id: "mindless-scroll", 
          text: "Mindless scrolling", 
          emoji: "📱", 
          description: "Scroll without purpose",
          isCorrect: false
        },
        { 
          id: "educational-course", 
          text: "Enroll in educational course", 
          emoji: "✅", 
          description: "Learn something new",
          isCorrect: true
        },
        { 
          id: "watch-videos", 
          text: "Watch random videos", 
          emoji: "📺", 
          description: "Watch entertainment",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What helps you grow and develop?",
      options: [
        { 
          id: "binge-watch", 
          text: "Binge watch shows", 
          emoji: "📺", 
          description: "Watch shows all day",
          isCorrect: false
        },
        { 
          id: "skill-course", 
          text: "Take a skill-building course", 
          emoji: "✅", 
          description: "Build valuable skills",
          isCorrect: true
        },
        { 
          id: "social-media", 
          text: "Spend time on social media", 
          emoji: "📱", 
          description: "Use social media",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the smart choice for your future?",
      options: [
        { 
          id: "entertainment", 
          text: "Only entertainment content", 
          emoji: "📺", 
          description: "Focus on entertainment",
          isCorrect: false
        },
        { 
          id: "learning", 
          text: "Online courses for learning", 
          emoji: "✅", 
          description: "Invest in learning",
          isCorrect: true
        },
        { 
          id: "waste-time", 
          text: "Waste time online", 
          emoji: "⏰", 
          description: "Spend time unproductively",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Online Course Simulation"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-3xl mb-3">{option.emoji}</div>
                      <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                      <p className="text-white/90 text-sm">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct!
                  You understand how to use tech for growth!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Use technology for learning and growth! Enroll in online courses to build skills instead of just watching entertainment!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember to use tech for learning and growth!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Choose online courses and learning opportunities over mindless entertainment. Invest in your growth!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OnlineCourseSimulation;
