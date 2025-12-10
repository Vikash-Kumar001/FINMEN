import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeachRobotColors = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
    {
      id: 1,
      name: "Apple",
      emoji: "🍎",
      choices: [
        { id: 1, text: "Red Box", color: "red", isCorrect: true },
        { id: 2, text: "Yellow Box", color: "yellow", isCorrect: false },
        { id: 3, text: "Green Box", color: "green", isCorrect: false }
      ]
    },
    {
      id: 2,
      name: "Banana",
      emoji: "🍌",
      choices: [
        { id: 1, text: "Red Box", color: "red", isCorrect: false },
        { id: 2, text: "Yellow Box", color: "yellow", isCorrect: true },
        { id: 3, text: "Blue Box", color: "blue", isCorrect: false }
      ]
    },
    {
      id: 3,
      name: "Cherry",
      emoji: "🍒",
      choices: [
        { id: 1, text: "Purple Box", color: "purple", isCorrect: false },
        { id: 2, text: "Red Box", color: "red", isCorrect: true },
        { id: 3, text: "Yellow Box", color: "yellow", isCorrect: false }
      ]
    },
    {
      id: 4,
      name: "Lemon",
      emoji: "🍋",
      choices: [
        { id: 1, text: "Orange Box", color: "orange", isCorrect: false },
        { id: 2, text: "Red Box", color: "red", isCorrect: false },
        { id: 3, text: "Yellow Box", color: "yellow", isCorrect: true }
      ]
    },
    {
      id: 5,
      name: "Strawberry",
      emoji: "🍓",
      choices: [
        { id: 1, text: "Pink Box", color: "pink", isCorrect: false },
        { id: 2, text: "Red Box", color: "red", isCorrect: true },
        { id: 3, text: "Green Box", color: "green", isCorrect: false }
      ]
    }
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choiceId) => {
    const choice = currentItemData.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentItemData.id, 
      choice: choiceId,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentItem(0);
    setScore(0);
    setCoins(0);
    setChoices([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/robot-mistake-story"); // Update next game path
  };

  return (
    <GameShell
      title="Teach the Robot Colors"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      maxScore={items.length}
      gameId="ai-kids-51"
      gameType="ai"
      totalLevels={items.length}
      currentLevel={currentItem + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Help the robot sort items by color!
            </h3>

            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <div className="text-6xl mb-3 text-center">{currentItemData.emoji}</div>
              <p className="text-white text-xl font-semibold text-center">{currentItemData.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentItemData.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                >
                  <h3 className="font-bold text-xl mb-2">{choice.text}</h3>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-4">Robot Learned Colors!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You sorted {finalScore} out of {items.length} correctly! ({Math.round((finalScore / items.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 Robots learn from examples you provide. Sorting colors is like giving training data!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Training!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You sorted {finalScore} out of {items.length} correctly. ({Math.round((finalScore / items.length) * 100)}%)
                  Keep practicing to teach the robot better!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 Robots learn from examples you provide. Sorting colors is like giving training data!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TeachRobotColors;
