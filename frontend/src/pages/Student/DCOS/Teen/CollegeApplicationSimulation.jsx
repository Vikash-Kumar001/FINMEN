import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CollegeApplicationSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-64");
  const gameId = gameData?.id || "dcos-teen-64";
  
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
      text: "College checks social media. Which profile is better?",
      options: [
        { 
          id: "clean", 
          text: "Clean and respectful posts", 
          emoji: "✅", 
          description: "Professional and positive content",
          isCorrect: true
        },
        { 
          id: "rude", 
          text: "Rude and offensive content", 
          emoji: "❌", 
          description: "Negative and inappropriate posts",
          isCorrect: false
        },
        { 
          id: "inappropriate", 
          text: "Inappropriate jokes and memes", 
          emoji: "❌", 
          description: "Unprofessional content",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which social media profile would impress colleges?",
      options: [
        { 
          id: "professional", 
          text: "Professional and positive content", 
          emoji: "✅", 
          description: "Mature and respectful posts",
          isCorrect: true
        },
        { 
          id: "negative", 
          text: "Negative and complaining posts", 
          emoji: "❌", 
          description: "Complaining and negative",
          isCorrect: false
        },
        { 
          id: "controversial", 
          text: "Controversial and argumentative", 
          emoji: "❌", 
          description: "Argumentative content",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What kind of profile helps college applications?",
      options: [
        { 
          id: "respectful", 
          text: "Respectful and achievement-focused", 
          emoji: "✅", 
          description: "Shows maturity and accomplishments",
          isCorrect: true
        },
        { 
          id: "insulting", 
          text: "Insulting and disrespectful", 
          emoji: "❌", 
          description: "Disrespectful behavior",
          isCorrect: false
        },
        { 
          id: "immature", 
          text: "Unprofessional and immature", 
          emoji: "❌", 
          description: "Immature content",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which profile shows good character to colleges?",
      options: [
        { 
          id: "positive", 
          text: "Positive and supportive posts", 
          emoji: "✅", 
          description: "Shows kindness and support",
          isCorrect: true
        },
        { 
          id: "mean", 
          text: "Mean and hurtful comments", 
          emoji: "❌", 
          description: "Hurtful behavior",
          isCorrect: false
        },
        { 
          id: "offensive", 
          text: "Inappropriate and offensive", 
          emoji: "❌", 
          description: "Offensive content",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What profile would colleges prefer to see?",
      options: [
        { 
          id: "mature", 
          text: "Clean, respectful, and mature", 
          emoji: "✅", 
          description: "Professional and mature presence",
          isCorrect: true
        },
        { 
          id: "immature2", 
          text: "Rude, negative, and immature", 
          emoji: "❌", 
          description: "Unprofessional behavior",
          isCorrect: false
        },
        { 
          id: "unprofessional", 
          text: "Controversial and unprofessional", 
          emoji: "❌", 
          description: "Unprofessional content",
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
      title="College Application Simulation"
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
                  You understand how to build a positive online presence!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Colleges check social media! Keep your profile clean, respectful, professional, and positive to make a good impression!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember to keep your social media profile clean and professional!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Colleges prefer clean, respectful, professional, and positive profiles. Keep your online presence mature!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CollegeApplicationSimulation;
