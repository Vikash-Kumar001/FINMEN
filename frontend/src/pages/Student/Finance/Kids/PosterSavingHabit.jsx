import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterSavingHabit = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-6";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stages = [
    {
      question: "Which poster best promotes good saving habits?",
      posters: [
        {
          id: 1,
          title: "Save First, Spend Later",
          description: "A poster showing a piggy bank first, then fun activities",
          emoji: "💰→🎉",
          isCorrect: true
        },
        {
          id: 2,
          title: "Spend First, Save Later",
          description: "A poster showing fun activities first, then piggy bank",
          emoji: "🎉→💰",
          isCorrect: false
        },
        {
          id: 3,
          title: "Save Nothing, Just Spend",
          description: "A poster showing only spending activities",
          emoji: "🛍️❌🏦",
          isCorrect: false
        }
      ],
      correctFeedback: "Save First, Spend Later is the best message for building good financial habits!",
      explanation: "This poster reminds us to save money first before spending on wants!"
    },
    {
      question: "Which poster encourages setting savings goals?",
      posters: [
        {
          id: 1,
          title: "Spend Everything Today",
          description: "A poster showing immediate spending without goals",
          emoji: "💸❌🎯",
          isCorrect: false
        },
        {
          id: 2,
          title: "Money Grows on Trees",
          description: "A poster with unrealistic money expectations",
          emoji: "🌳💵❌",
          isCorrect: false
        },
        {
          id: 3,
          title: "Save for Your Dreams",
          description: "A poster showing a goal chart with savings milestones",
          emoji: "🎯💰📈",
          isCorrect: true
        }
      ],
      correctFeedback: "Save for Your Dreams encourages goal-setting!",
      explanation: "Setting savings goals helps you stay focused and motivated!"
    },
    {
      question: "Which poster shows the importance of a savings account?",
      posters: [
        {
          id: 1,
          title: "Bank = Safe Money",
          description: "A poster showing money safely stored in a bank",
          emoji: "🏦🔒💰",
          isCorrect: true
        },
        {
          id: 2,
          title: "Keep Money Under Bed",
          description: "A poster showing money hidden at home",
          emoji: "🛏️💵❌",
          isCorrect: false
        },
        {
          id: 3,
          title: "Spend It All Now",
          description: "A poster showing no savings at all",
          emoji: "💸❌🏦",
          isCorrect: false
        }
      ],
      correctFeedback: "Bank = Safe Money is the right choice!",
      explanation: "Banks keep your money safe and can help it grow with interest!"
    },
    {
      question: "Which poster teaches about emergency savings?",
      posters: [
        {
          id: 1,
          title: "Save for Rainy Days",
          description: "A poster showing savings for unexpected needs",
          emoji: "☔💰🛡️",
          isCorrect: true
        },
        {
          id: 2,
          title: "Spend on Fun Only",
          description: "A poster showing only entertainment spending",
          emoji: "🎮🎉❌",
          isCorrect: false
        },
        {
          id: 3,
          title: "Borrow When Needed",
          description: "A poster promoting borrowing instead of saving",
          emoji: "💳❌💰",
          isCorrect: false
        }
      ],
      correctFeedback: "Save for Rainy Days teaches emergency savings!",
      explanation: "Having emergency savings helps you handle unexpected situations!"
    },
    {
      question: "Which poster promotes regular saving habits?",
      posters: [
        {
          id: 1,
          title: "Save a Little Every Day",
          description: "A poster showing daily savings routine",
          emoji: "📅💰✅",
          isCorrect: true
        },
        {
          id: 2,
          title: "Save Only on Special Days",
          description: "A poster showing irregular saving",
          emoji: "🎂💰❌",
          isCorrect: false
        },
        {
          id: 3,
          title: "Never Save, Always Spend",
          description: "A poster discouraging saving",
          emoji: "💸❌💰",
          isCorrect: false
        }
      ],
      correctFeedback: "Save a Little Every Day promotes good habits!",
      explanation: "Regular saving, even small amounts, builds strong financial habits!"
    }
  ];

  const currentStageData = stages[currentStage];
  const posters = currentStageData?.posters || [];

  const handlePosterSelect = (poster) => {
    setSelectedPoster(poster.id);
    
    if (poster.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      
      // Check if this is the last stage
      const isLastStage = currentStage === stages.length - 1;
      
      if (isLastStage) {
        // Last stage - show result and game over modal
        setShowResult(true);
      } else {
        // Automatically move to next question after showing feedback
        setTimeout(() => {
          setCurrentStage(currentStage + 1);
          setSelectedPoster(null);
          setShowResult(false);
          resetFeedback();
        }, 1500);
      }
    } else {
      // Show result immediately for incorrect
      setShowResult(true);
    }
  };

  const handleNext = () => {
    if (currentStage < stages.length - 1) {
      // Move to next question
      setCurrentStage(currentStage + 1);
      setSelectedPoster(null);
      setShowResult(false);
      resetFeedback();
    }
  };

  const handleTryAgain = () => {
    setSelectedPoster(null);
    setShowResult(false);
    resetFeedback();
  };

  const isLastStage = currentStage === stages.length - 1;
  const selectedPosterData = selectedPoster ? posters.find(p => p.id === selectedPoster) : null;
  const isCorrect = selectedPosterData?.isCorrect || false;

  return (
    <GameShell
      title="Poster: Saving Habit"
      subtitle={`Question ${currentStage + 1} of ${stages.length}`}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={showResult && selectedPoster && isCorrect && !isLastStage}
      showGameOver={showResult && isLastStage && isCorrect}
      score={coins}
      gameId={gameId}
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl font-bold mb-6 text-center">
                Question {currentStage + 1}: {currentStageData?.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {posters.map(poster => (
                  <button
                    key={poster.id}
                    onClick={() => handlePosterSelect(poster)}
                    disabled={showResult}
                    className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 ${
                      selectedPoster === poster.id
                        ? "ring-4 ring-yellow-400 bg-gradient-to-r from-blue-500 to-indigo-600"
                        : "bg-gradient-to-r from-green-500 to-emerald-600"
                    } ${showResult ? "opacity-75 cursor-not-allowed" : "hover:scale-105"}`}
                  >
                    <div className="text-4xl mb-4 text-center">{poster.emoji}</div>
                    <h3 className="font-bold text-xl text-white mb-2 text-center">{poster.title}</h3>
                    <p className="text-white/90 text-center">{poster.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {isCorrect ? (
              <div>
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-white mb-4">Creative Choice!</h3>
                <p className="text-white/90 text-lg mb-4">
                  {currentStageData?.correctFeedback}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+1 Coin</span>
                </div>
                <p className="text-white/80 mb-4">
                  {currentStageData?.explanation}
                </p>
                {!isLastStage && (
                  <p className="text-white/70 text-sm mt-4">
                    Question {currentStage + 1} of {stages.length} completed!
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">🤔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Think About It!</h3>
                <p className="text-white/90 text-lg mb-4">
                  {currentStageData?.correctFeedback || "That's not quite right. Try again!"}
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  {currentStageData?.explanation || "Look for the poster that promotes good saving habits."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterSavingHabit;