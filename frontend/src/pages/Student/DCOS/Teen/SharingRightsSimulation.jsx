import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SharingRightsSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-54");
  const gameId = gameData?.id || "dcos-teen-54";
  
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
      text: "Should you share your homework online?",
      options: [
        { 
          id: "share", 
          text: "Share it online", 
          emoji: "📤", 
          description: "Post homework publicly",
          isCorrect: false
        },
        { 
          id: "keep-private", 
          text: "Keep it private", 
          emoji: "🔒", 
          description: "Keep homework private",
          isCorrect: true
        },
        { 
          id: "friends-only", 
          text: "Share with friends only", 
          emoji: "👥", 
          description: "Share only with friends",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should you do with personal documents?",
      options: [
        { 
          id: "post-public", 
          text: "Post them publicly", 
          emoji: "🌐", 
          description: "Share documents publicly",
          isCorrect: false
        },
        { 
          id: "keep-private-docs", 
          text: "Keep them private", 
          emoji: "🔒", 
          description: "Keep documents private",
          isCorrect: true
        },
        { 
          id: "share-social", 
          text: "Share on social media", 
          emoji: "📱", 
          description: "Post on social media",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Should you share your test answers online?",
      options: [
        { 
          id: "yes-share", 
          text: "Yes, share them", 
          emoji: "✅", 
          description: "Share test answers",
          isCorrect: false
        },
        { 
          id: "no-private", 
          text: "No, keep them private", 
          emoji: "🔒", 
          description: "Keep answers private",
          isCorrect: true
        },
        { 
          id: "share-classmates", 
          text: "Share with classmates", 
          emoji: "👥", 
          description: "Share with classmates",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What about your personal photos?",
      options: [
        { 
          id: "share-all", 
          text: "Share everything publicly", 
          emoji: "🌐", 
          description: "Post all photos publicly",
          isCorrect: false
        },
        { 
          id: "selective", 
          text: "Be selective and keep private ones safe", 
          emoji: "🔒", 
          description: "Be careful about what you share",
          isCorrect: true
        },
        { 
          id: "post-all", 
          text: "Post all photos", 
          emoji: "📤", 
          description: "Share all photos",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Should you share your private thoughts online?",
      options: [
        { 
          id: "share-everything", 
          text: "Share everything", 
          emoji: "📤", 
          description: "Share all thoughts",
          isCorrect: false
        },
        { 
          id: "keep-thoughts", 
          text: "Keep private thoughts private", 
          emoji: "🔒", 
          description: "Keep personal thoughts private",
          isCorrect: true
        },
        { 
          id: "share-everyone", 
          text: "Share with everyone", 
          emoji: "🌐", 
          description: "Share publicly",
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
      title="Sharing Rights Simulation"
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
                  You understand how to protect your privacy and rights!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Keep personal information, homework, documents, and private thoughts private. Be selective about what you share online!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember to keep personal information and private content private!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Keep homework, documents, personal photos, and private thoughts private. Protect your privacy!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SharingRightsSimulation;
