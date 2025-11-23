import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexTeenFutureCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameState, setGameState] = useState('waiting');
  const [reactionTime, setReactionTime] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showCoinFeedback, setShowCoinFeedback] = useState(false);
  const startTimeRef = useRef(0);
  const timerRef = useRef(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    { action: "Cybersecurity Jobs", emoji: "🛡️", isCorrect: true },
    { action: "Ghost Hunters", emoji: "👻", isCorrect: false },
    { action: "AI Development", emoji: "🤖", isCorrect: true },
    { action: "Dinosaur Hunters", emoji: "🦕", isCorrect: false },
    { action: "Green Energy", emoji: "☀️", isCorrect: true },
    { action: "Time Travel Guides", emoji: "⏳", isCorrect: false },
    { action: "Data Science", emoji: "📊", isCorrect: true },
    { action: "Alien Communicators", emoji: "👽", isCorrect: false }
  ];

  const [currentScenario, setCurrentScenario] = useState(null);

  const handleChoice = (selectedOption) => {
    const endTime = Date.now();
    const time = endTime - startTimeRef.current;
    setReactionTime(time);

    const isCorrect = selectedOption.isCorrect;
    setGameState(isCorrect ? 'success' : 'fail');

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      setShowCoinFeedback(true);
      setTimeout(() => setShowCoinFeedback(false), 1500);
    }

    setTimeout(() => {
      if (currentRound < 5) {
        setCurrentRound(prev => prev + 1);
        setGameState('waiting');
        setTimeout(() => startRound(), 500);
      } else {
        setGameFinished(true);
      }
    }, isCorrect ? 1500 : 1000);
  };

  const startRound = () => {
    // Randomly select a scenario pair (correct and incorrect)
    const randomIndex = Math.floor(Math.random() * 4); // 0-3 for 4 pairs
    
    // Create scenario pair and randomize their order
    const correctOption = scenarios[randomIndex * 2];
    const incorrectOption = scenarios[randomIndex * 2 + 1];
    
    // Randomly decide the order (50/50 chance)
    const scenarioPair = Math.random() > 0.5 
      ? [correctOption, incorrectOption]  // Correct on left
      : [incorrectOption, correctOption]; // Correct on right
      
    setCurrentScenario(scenarioPair);
    setGameState('showing');

    const randomDelay = Math.random() * 2000 + 1000;

    timerRef.current = setTimeout(() => {
      setGameState('ready');
      startTimeRef.current = Date.now();
    }, randomDelay);
  };

  const handleNext = () => {
    navigate("/student/ehe/teens/puzzle-match-careers");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentRound === 1 && gameState === 'waiting') {
        startRound();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <GameShell
      title="Reflex Teen Future Check"
      subtitle={`Round ${currentRound}/5`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-teen-73"
      gameType="ehe"
      totalLevels={80}
      currentLevel={73}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={80} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 relative">
          {showCoinFeedback && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-yellow-500 text-white px-3 py-1 rounded-full font-bold text-lg animate-bounce">
                +1
              </div>
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Round {currentRound}/5</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl mb-4">
              {gameState === 'waiting' && '⏳'}
              {gameState === 'showing' && '🧠'}
              {gameState === 'ready' && '⚡'}
              {gameState === 'success' && '✅'}
              {gameState === 'fail' && '❌'}
            </div>
            <p className="text-white/90 text-lg">
              {gameState === 'waiting' && 'Get ready for future career decisions...'}
              {gameState === 'showing' && 'Watch for the career signal...'}
              {gameState === 'ready' && 'QUICK! Choose the real future career!'}
              {gameState === 'success' && `Great choice! (${reactionTime}ms)`}
              {gameState === 'fail' && 'Too slow! Future careers need quick recognition!'}
            </p>
          </div>

          {gameState === 'ready' && currentScenario && (
            <div className="grid grid-cols-2 gap-4">
              {currentScenario.map((scenario, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(scenario)}
                  className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    scenario.isCorrect
                      ? 'bg-blue-100/20 border-blue-500 text-white hover:bg-blue-200/20'
                      : 'bg-red-100/20 border-red-500 text-white hover:bg-red-200/20'
                  }`}
                >
                  <div className="text-4xl mb-2">{scenario.emoji}</div>
                  <div className="font-bold text-lg">{scenario.action}</div>
                </button>
              ))}
            </div>
          )}

          {gameState === 'success' && currentScenario && (
            <div className="text-center space-y-4">
              <div className="text-green-400">
                <div className="text-6xl">{currentScenario.find(s => s.isCorrect)?.emoji}</div>
                <h3 className="text-xl font-bold text-white">Excellent Career Choice!</h3>
                <p className="text-white/90">Reaction time: {reactionTime}ms</p>
              </div>
              <div className="flex justify-center gap-2">
                <span className="text-yellow-500 text-2xl">+1</span>
              </div>
            </div>
          )}

          {gameState === 'fail' && currentScenario && (
            <div className="text-center space-y-4">
              <div className="text-red-400">
                <div className="text-6xl">{currentScenario.find(s => !s.isCorrect)?.emoji}</div>
                <h3 className="text-xl font-bold text-white">Not a Real Future Career!</h3>
                <p className="text-white/90">Remember: Focus on legitimate emerging career fields!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexTeenFutureCheck;