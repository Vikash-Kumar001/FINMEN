import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ShoppingSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-44");
  const gameId = gameData?.id || "dcos-teen-44";
  
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
      text: "Choose the safe website to shop:",
      options: [
        { 
          id: "freeshop", 
          text: "FreeShop123.com", 
          emoji: "❌", 
          description: "Unknown suspicious site",
          isCorrect: false
        },
        { 
          id: "amazon", 
          text: "Official Amazon", 
          emoji: "✅", 
          description: "Official trusted retailer",
          isCorrect: true
        },
        { 
          id: "unknown", 
          text: "Unknown-Store.net", 
          emoji: "❌", 
          description: "Unverified store",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which shopping site is trustworthy?",
      options: [
        { 
          id: "random-shop", 
          text: "Random-Shop.com", 
          emoji: "❌", 
          description: "Random unverified site",
          isCorrect: false
        },
        { 
          id: "verified", 
          text: "Verified Retailer", 
          emoji: "✅", 
          description: "Verified and trusted retailer",
          isCorrect: true
        },
        { 
          id: "suspicious", 
          text: "Suspicious-Deals.net", 
          emoji: "❌", 
          description: "Suspicious deals site",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Pick the safe online store:",
      options: [
        { 
          id: "unverified", 
          text: "Unverified-Store.com", 
          emoji: "❌", 
          description: "Unverified store",
          isCorrect: false
        },
        { 
          id: "official-brand", 
          text: "Official Brand Store", 
          emoji: "✅", 
          description: "Official brand website",
          isCorrect: true
        },
        { 
          id: "unknown-market", 
          text: "Unknown-Market.net", 
          emoji: "❌", 
          description: "Unknown marketplace",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which website is safe for shopping?",
      options: [
        { 
          id: "fake-store", 
          text: "Fake-Store.com", 
          emoji: "❌", 
          description: "Fake store website",
          isCorrect: false
        },
        { 
          id: "established", 
          text: "Established E-commerce Site", 
          emoji: "✅", 
          description: "Well-known e-commerce platform",
          isCorrect: true
        },
        { 
          id: "random-shop2", 
          text: "Random-Shop.net", 
          emoji: "❌", 
          description: "Random shop site",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Choose the trusted shopping platform:",
      options: [
        { 
          id: "unknown-website", 
          text: "Unknown-Website.com", 
          emoji: "❌", 
          description: "Unknown website",
          isCorrect: false
        },
        { 
          id: "official-platform", 
          text: "Official Shopping Platform", 
          emoji: "✅", 
          description: "Official trusted platform",
          isCorrect: true
        },
        { 
          id: "suspicious-site", 
          text: "Suspicious-Site.net", 
          emoji: "❌", 
          description: "Suspicious website",
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
      title="Shopping Simulation"
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
                  You understand how to shop safely online!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Always shop from official, verified, and established retailers. Avoid unknown or suspicious websites that could be scams!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember to shop from official and verified retailers!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Choose official brand stores, verified retailers, and established e-commerce platforms!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ShoppingSimulation;
