import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../GameShell';
import { useGameFeedback } from '../../../../hooks/useGameFeedback';

const ReflexControl = () => {
  const navigate = useNavigate();
  const { feedback, triggerFeedback } = useGameFeedback();
  const [gameState, setGameState] = useState('waiting'); // waiting, active, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds total
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const challenges = [
    {
      id: 1,
      scenario: "You see limited-time 50% off designer jeans ($80 original price)",
      smartChoice: "Wait 2 days to check if you really need them",
      impulsiveChoice: "Buy immediately before sale ends",
      correct: "smart",
      explanation: "Taking time to evaluate needs vs wants prevents impulsive spending"
    },
    {
      id: 2,
      scenario: "Friend invites you to expensive restaurant, you have $20 budget",
      smartChoice: "Suggest a more affordable dining option",
      impulsiveChoice: "Go and overspend, worry about it later",
      correct: "smart",
      explanation: "Communicating financial boundaries maintains friendships and financial health"
    },
    {
      id: 3,
      scenario: "New video game release, $60 price tag",
      smartChoice: "Check reviews and wait for sale/discount",
      impulsiveChoice: "Buy immediately at full price",
      correct: "smart",
      explanation: "Research and patience often lead to better purchasing decisions"
    },
    {
      id: 4,
      scenario: "Online subscription offers free trial, requires credit card",
      smartChoice: "Read terms carefully and set calendar reminder",
      impulsiveChoice: "Sign up without reading terms",
      correct: "smart",
      explanation: "Understanding commitments prevents unexpected charges"
    },
    {
      id: 5,
      scenario: "See 'Buy 1 Get 1 Free' deal on items you don't need",
      smartChoice: "Pass on the deal since you don't need the items",
      impulsiveChoice: "Buy both items to 'save money'",
      correct: "smart",
      explanation: "Buying unnecessary items is wasteful regardless of deals"
    },
    {
      id: 6,
      scenario: "Emotional after bad grade, want to buy comfort food",
      smartChoice: "Take a walk and address feelings differently",
      impulsiveChoice: "Buy comfort food to feel better immediately",
      correct: "smart",
      explanation: "Finding healthy ways to cope with emotions prevents emotional spending"
    },
    {
      id: 7,
      scenario: "Peer pressure to buy expensive brand-name item",
      smartChoice: "Evaluate if item fits your budget and needs",
      impulsiveChoice: "Buy to fit in with peers",
      correct: "smart",
      explanation: "Making decisions based on personal values rather than peer pressure builds financial independence"
    },
    {
      id: 8,
      scenario: "See 'Flash Sale' ending in 10 minutes",
      smartChoice: "Ignore if item isn't on your shopping list",
      impulsiveChoice: "Buy immediately to not miss the deal",
      correct: "smart",
      explanation: "Sticking to planned purchases prevents unnecessary spending"
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
  }, []);

  // Start the game
  const startGame = () => {
    setGameState('active');
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    generateChallenge();
  };

  // Handle choice selection
  const handleChoice = (choiceType) => {
    if (!currentChallenge || gameState !== 'active') return;

    const isCorrect = choiceType === currentChallenge.correct;
    
    if (isCorrect) {
      const points = Math.max(1, Math.floor(10 - (reactionTime || 0) / 100));
      setScore(score + points);
      setStreak(streak + 1);
      if (streak + 1 > bestStreak) {
        setBestStreak(streak + 1);
      }
      triggerFeedback(true, `+${points} points!`);
    } else {
      setStreak(0);
      triggerFeedback(false, "Incorrect choice");
    }

    // Generate next challenge after delay
    setTimeout(() => {
      if (timeLeft > 0) {
        generateChallenge();
      }
    }, 1000);
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
    return score + (bestStreak * 5); // Bonus points for best streak
  };

  const handleGameComplete = () => {
    navigate('/student/finance');
  };

  return (
    <GameShell
      gameId="finance-teens-19"
      gameType="reflex"
      totalLevels={1}
      currentLevel={1}
      score={calculateTotalScore()}
      totalScore={200} // Adjust based on max possible score
      onGameComplete={handleGameComplete}
      feedback={feedback}
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
          </div>
        )}
        
        {gameState === 'active' && currentChallenge && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-bold text-indigo-700">Score: {score}</div>
              <div className="text-lg font-bold text-red-600">{timeLeft}s</div>
              <div className="text-lg font-bold text-green-600">Streak: {streak}</div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">Scenario:</h4>
              <p className="text-blue-700">{currentChallenge.scenario}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice('smart')}
                className="p-6 bg-green-100 hover:bg-green-200 border-2 border-green-300 rounded-xl transition duration-200 text-left"
              >
                <div className="font-bold text-green-800 mb-2">Smart Choice</div>
                <p className="text-green-700">{currentChallenge.smartChoice}</p>
              </button>
              
              <button
                onClick={() => handleChoice('impulsive')}
                className="p-6 bg-red-100 hover:bg-red-200 border-2 border-red-300 rounded-xl transition duration-200 text-left"
              >
                <div className="font-bold text-red-800 mb-2">Impulsive Choice</div>
                <p className="text-red-700">{currentChallenge.impulsiveChoice}</p>
              </button>
            </div>
            
            {feedback && (
              <div className={`p-4 rounded-lg mt-6 text-center ${
                feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <p className="font-medium">{feedback.message}</p>
                {feedback.explanation && (
                  <p className="mt-2 text-sm">{feedback.explanation}</p>
                )}
              </div>
            )}
          </div>
        )}
        
        {gameState === 'finished' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h4 className="text-xl font-bold mb-4 text-gray-800">Game Complete!</h4>
            <div className="grid grid-cols-3 gap-4 mb-6">
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
            
            <button
              onClick={startGame}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200 mr-4"
            >
              Play Again
            </button>
            
            <button
              onClick={handleGameComplete}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition duration-200"
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