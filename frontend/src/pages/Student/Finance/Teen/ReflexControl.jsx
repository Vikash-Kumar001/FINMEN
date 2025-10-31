import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../GameShell';
import { useGameFeedback } from '../../../../hooks/useGameFeedback';

const ReflexControl = () => {
  const navigate = useNavigate();
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [gameState, setGameState] = useState('waiting'); // waiting, active, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds total
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [multiplier, setMultiplier] = useState(1); // Score multiplier for streaks
  const [showExplanation, setShowExplanation] = useState(false);

  const challenges = [
    {
      id: 1,
      scenario: "You see limited-time 50% off designer jeans ($80 original price)",
      smartChoice: "Wait 2 days to check if you really need them",
      impulsiveChoice: "Buy immediately before sale ends",
      correct: "smart",
      explanation: "Taking time to evaluate needs vs wants prevents impulsive spending",
      category: "Shopping"
    },
    {
      id: 2,
      scenario: "Friend invites you to expensive restaurant, you have $20 budget",
      smartChoice: "Suggest a more affordable dining option",
      impulsiveChoice: "Go and overspend, worry about it later",
      correct: "smart",
      explanation: "Communicating financial boundaries maintains friendships and financial health",
      category: "Social"
    },
    {
      id: 3,
      scenario: "New video game release, $60 price tag",
      smartChoice: "Check reviews and wait for sale/discount",
      impulsiveChoice: "Buy immediately at full price",
      correct: "smart",
      explanation: "Research and patience often lead to better purchasing decisions",
      category: "Entertainment"
    },
    {
      id: 4,
      scenario: "Online subscription offers free trial, requires credit card",
      smartChoice: "Read terms carefully and set calendar reminder",
      impulsiveChoice: "Sign up without reading terms",
      correct: "smart",
      explanation: "Understanding commitments prevents unexpected charges",
      category: "Subscriptions"
    },
    {
      id: 5,
      scenario: "See 'Buy 1 Get 1 Free' deal on items you don't need",
      smartChoice: "Pass on the deal since you don't need the items",
      impulsiveChoice: "Buy both items to 'save money'",
      correct: "smart",
      explanation: "Buying unnecessary items is wasteful regardless of deals",
      category: "Deals"
    },
    {
      id: 6,
      scenario: "Emotional after bad grade, want to buy comfort food",
      smartChoice: "Take a walk and address feelings differently",
      impulsiveChoice: "Buy comfort food to feel better immediately",
      correct: "smart",
      explanation: "Finding healthy ways to cope with emotions prevents emotional spending",
      category: "Emotions"
    },
    {
      id: 7,
      scenario: "Peer pressure to buy expensive brand-name item",
      smartChoice: "Evaluate if item fits your budget and needs",
      impulsiveChoice: "Buy to fit in with peers",
      correct: "smart",
      explanation: "Making decisions based on personal values rather than peer pressure builds financial independence",
      category: "Peer Pressure"
    },
    {
      id: 8,
      scenario: "See 'Flash Sale' ending in 10 minutes",
      smartChoice: "Ignore if item isn't on your shopping list",
      impulsiveChoice: "Buy immediately to not miss the deal",
      correct: "smart",
      explanation: "Sticking to planned purchases prevents unnecessary spending",
      category: "Urgency"
    },
    {
      id: 9,
      scenario: "You have $50 saved for textbooks, but see concert tickets on sale",
      smartChoice: "Stick to your savings goal for textbooks",
      impulsiveChoice: "Redirect savings to buy concert tickets",
      correct: "smart",
      explanation: "Prioritizing essential expenses helps achieve important goals",
      category: "Prioritization"
    },
    {
      id: 10,
      scenario: "You receive an unexpected $100 gift",
      smartChoice: "Save 50% and spend 50% on something meaningful",
      impulsiveChoice: "Spend it all on whatever you want immediately",
      correct: "smart",
      explanation: "Balancing saving and spending helps build healthy money habits",
      category: "Windfalls"
    }
  ];

  // Timer countdown
  useEffect(() => {
    if (gameState === 'active' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'active') {
      setGameState('finished');
    }
  }, [gameState, timeLeft]);

  // Generate new challenge
  const generateChallenge = useCallback(() => {
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setCurrentChallenge(randomChallenge);
    setReactionTime(null);
    setShowExplanation(false);
  }, []);

  // Start the game
  const startGame = () => {
    setGameState('active');
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setMultiplier(1);
    generateChallenge();
  };

  // Handle choice selection
  const handleChoice = (choiceType) => {
    if (!currentChallenge || gameState !== 'active') return;

    resetFeedback();
    const isCorrect = choiceType === currentChallenge.correct;
    
    if (isCorrect) {
      // Calculate points with multiplier
      const basePoints = Math.max(10, Math.floor(20 - (reactionTime || 0) / 100));
      const points = basePoints * multiplier;
      
      setScore(score + points);
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Update multiplier based on streak
      if (newStreak >= 5) {
        setMultiplier(3);
      } else if (newStreak >= 3) {
        setMultiplier(2);
      }
      
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      
      showCorrectAnswerFeedback(points, true);
      setFeedbackMessage(`+${points} points! Streak: ${newStreak}x`);
      setIsSuccess(true);
    } else {
      setStreak(0);
      setMultiplier(1); // Reset multiplier on wrong answer
      setFeedbackMessage("Incorrect choice! Streak reset.");
      setIsSuccess(false);
    }

    // Show explanation
    setShowExplanation(true);

    // Clear feedback after delay
    setTimeout(() => {
      setFeedbackMessage('');
      setShowExplanation(false);
      
      // Generate next challenge after delay
      setTimeout(() => {
        if (timeLeft > 0) {
          generateChallenge();
        }
      }, 500);
    }, 2000);
  };

  // Handle screen tap for reaction time
  const handleScreenTap = () => {
    if (gameState === 'waiting') {
      startGame();
    } else if (gameState === 'active' && currentChallenge && reactionTime === null) {
      setReactionTime(Date.now());
    }
  };

  const calculateTotalScore = () => {
    return score + (bestStreak * 10); // Bonus points for best streak
  };

  const handleGameComplete = () => {
    navigate('/games/financial-literacy/teen');
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      "Shopping": "bg-purple-100 text-purple-800",
      "Social": "bg-blue-100 text-blue-800",
      "Entertainment": "bg-green-100 text-green-800",
      "Subscriptions": "bg-yellow-100 text-yellow-800",
      "Deals": "bg-red-100 text-red-800",
      "Emotions": "bg-pink-100 text-pink-800",
      "Peer Pressure": "bg-indigo-100 text-indigo-800",
      "Urgency": "bg-orange-100 text-orange-800",
      "Prioritization": "bg-teal-100 text-teal-800",
      "Windfalls": "bg-cyan-100 text-cyan-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <GameShell
      gameId="finance-teens-19"
      gameType="reflex"
      totalLevels={1}
      currentLevel={1}
      score={calculateTotalScore()}
      totalScore={500} // Adjust based on max possible score
      onGameComplete={handleGameComplete}
    >
      <div className="game-content">
        <h3 className="text-xl font-bold mb-6 text-indigo-700">Spending Control Reflex</h3>
        
        {gameState === 'waiting' && (
          <div 
            className="bg-white rounded-xl shadow-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition duration-200"
            onClick={handleScreenTap}
          >
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Test Your Spending Control</h4>
            <p className="mb-6 text-gray-600">Quickly identify smart financial choices when tempted to spend impulsively</p>
            <div className="text-2xl font-bold text-indigo-600 mb-4">Tap to Start</div>
            <p className="text-sm text-gray-500">You'll have 60 seconds to make as many correct choices as possible</p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">Tip: Build streaks for higher multipliers!</p>
              <p className="text-blue-700 text-sm mt-1">3+ correct = 2x points, 5+ correct = 3x points</p>
            </div>
          </div>
        )}
        
        {gameState === 'active' && currentChallenge && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
              <div className="flex items-center gap-4">
                <div className="text-lg font-bold text-indigo-700">Score: {score}</div>
                <div className="text-lg font-bold text-green-600">Streak: {streak}x</div>
                {multiplier > 1 && (
                  <div className="text-lg font-bold text-orange-600">Multiplier: {multiplier}x</div>
                )}
              </div>
              <div className="text-lg font-bold text-red-600">{timeLeft}s</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-blue-800">Scenario:</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(currentChallenge.category)}`}>
                  {currentChallenge.category}
                </span>
              </div>
              <p className="text-blue-700 font-medium">{currentChallenge.scenario}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => handleChoice('smart')}
                className="p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-300 rounded-xl transition duration-200 text-left transform hover:scale-[1.02]"
              >
                <div className="font-bold text-green-800 mb-2 flex items-center">
                  <span className="mr-2">✅</span> Smart Choice
                </div>
                <p className="text-green-700">{currentChallenge.smartChoice}</p>
              </button>
              
              <button
                onClick={() => handleChoice('impulsive')}
                className="p-6 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-2 border-red-300 rounded-xl transition duration-200 text-left transform hover:scale-[1.02]"
              >
                <div className="font-bold text-red-800 mb-2 flex items-center">
                  <span className="mr-2">❌</span> Impulsive Choice
                </div>
                <p className="text-red-700">{currentChallenge.impulsiveChoice}</p>
              </button>
            </div>
            
            {feedbackMessage && (
              <div className={`p-4 rounded-lg mt-4 text-center ${
                isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <p className="font-medium text-lg">{feedbackMessage}</p>
              </div>
            )}
            
            {showExplanation && currentChallenge && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mt-4">
                <h5 className="font-bold text-yellow-800 mb-2">Explanation:</h5>
                <p className="text-yellow-700">{currentChallenge.explanation}</p>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Best Streak: {bestStreak}</span>
                <span>Bonus Points: {bestStreak * 10}</span>
              </div>
            </div>
          </div>
        )}
        
        {gameState === 'finished' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h4 className="text-xl font-bold mb-4 text-gray-800">Game Complete!</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-indigo-700">{score}</div>
                <div className="text-sm text-gray-600">Base Score</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-700">{bestStreak}</div>
                <div className="text-sm text-gray-600">Best Streak</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">{calculateTotalScore()}</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">
                {bestStreak >= 5 
                  ? "🏆 Excellent! You're a financial reflex expert!" 
                  : bestStreak >= 3 
                    ? "👏 Good job! Keep building those smart habits!" 
                    : "💪 Keep practicing to improve your financial reflexes!"}
              </p>
            </div>
            
            <button
              onClick={startGame}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200 mr-4 transform hover:scale-105"
            >
              Play Again
            </button>
            
            <button
              onClick={handleGameComplete}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition duration-200 transform hover:scale-105"
            >
              Finish Game
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexControl;