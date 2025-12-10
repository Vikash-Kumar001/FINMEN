import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DataLabelingGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("ai-kids-56");
  const gameId = gameData?.id || "ai-kids-56";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Items to label with educational context
  const items = [
    { 
      id: 1, 
      image: "🍎", 
      correct: "Apple",
      explanation: "Red apples are a healthy snack rich in fiber and vitamins."
    },
    { 
      id: 2, 
      image: "🍌", 
      correct: "Banana",
      explanation: "Bananas are a great source of potassium and natural energy."
    },
    { 
      id: 3, 
      image: "🚗", 
      correct: "Car",
      explanation: "Cars are vehicles that help people travel from place to place."
    },
    { 
      id: 4, 
      image: "🚲", 
      correct: "Bicycle",
      explanation: "Bicycles are eco-friendly transportation with two wheels."
    },
    { 
      id: 5, 
      image: "🐱", 
      correct: "Cat",
      explanation: "Cats are furry pets that love to purr and play."
    }
  ];

  // Function to determine button order based on current item index
  const getButtonOrder = (itemIndex) => {
    // Alternate the position of the correct answer
    // For even indices: correct answer first, wrong label second
    // For odd indices: wrong label first, correct answer second
    return itemIndex % 2 === 0 ? 'normal' : 'swapped';
  };

  const currentItemData = items[currentItem];
  const buttonOrder = getButtonOrder(currentItem);

  const handleChoice = (choice) => {
    const isCorrect = choice === currentItemData.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1); // 1 coin per correct answer
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem(prev => prev + 1);
      }, isCorrect ? 1000 : 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentItem(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-gets-smarter");
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Data Labeling Game"
      score={coins}
      subtitle={`Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId={gameId}
      gameType="ai"
      totalLevels={20}
      currentLevel={56}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              What is this? Help the AI learn!
            </h3>
            
            <div className="bg-white/10 rounded-lg p-12 mb-6 flex justify-center items-center text-8xl">
              {currentItemData.image}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {buttonOrder === 'normal' ? (
                <>
                  <button
                    onClick={() => handleChoice(currentItemData.correct)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-8 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-5xl mb-2">{currentItemData.image}</div>
                    <div className="text-white font-bold text-xl">{currentItemData.correct}</div>
                  </button>
                  <button
                    onClick={() => handleChoice("Wrong Label")}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white p-8 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-5xl mb-2">❓</div>
                    <div className="text-white font-bold text-xl">Something Else</div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleChoice("Wrong Label")}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white p-8 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-5xl mb-2">❓</div>
                    <div className="text-white font-bold text-xl">Something Else</div>
                  </button>
                  <button
                    onClick={() => handleChoice(currentItemData.correct)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-8 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-5xl mb-2">{currentItemData.image}</div>
                    <div className="text-white font-bold text-xl">{currentItemData.correct}</div>
                  </button>
                </>
              )}
            </div>
            
            <div className="mt-6 bg-blue-500/20 rounded-lg p-4">
              <p className="text-white/90 text-sm text-center">
                💡 By labeling items correctly, you're teaching AI to recognize objects in the real world!
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {accuracy >= 70 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Data Labeling Pro!
                </h2>
                <p className="text-white/90 text-xl mb-4">
                  You labeled {score} out of {items.length} correctly! ({accuracy}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white/90 text-sm">
                    🌟 Teaching AI requires lots of correctly labeled examples. You're helping robots learn about the world!
                  </p>
                </div>
                <p className="text-white/80">
                  Each correct label helps AI get better at recognizing objects.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Keep Practicing!
                </h2>
                <p className="text-white/90 text-xl mb-4">
                  You labeled {score} out of {items.length} correctly. ({accuracy}%)
                </p>
                <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white/90 text-sm">
                    💡 AI needs thousands of correctly labeled examples to learn properly. Every correct label counts!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-semibold transition"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm mt-4">
                  Pay attention to each item and think about what it is before selecting.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DataLabelingGame;