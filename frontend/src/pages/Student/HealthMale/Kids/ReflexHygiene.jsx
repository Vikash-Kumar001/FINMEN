import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexHygiene = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameState, setGameState] = useState('waiting'); // waiting, showing, ready, success, fail
  const [reactionTime, setReactionTime] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const startTimeRef = useRef(0);
  const timerRef = useRef(null);
  const { showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const getCurrentRoundScenario = () => {
    const currentScenario = roundScenarios.find(s => s.id === currentRound);
    return [
      { action: currentScenario.correctAction, emoji: "🧼", isCorrect: true },
      { action: currentScenario.wrongAction, emoji: "❌", isCorrect: false }
    ];
  };

  const roundScenarios = [
    {
      id: 1,
      title: "Before Eating",
      message: "You just played outside! QUICK! Choose what to do before eating!",
      correctAction: "Wash Hands",
      wrongAction: "Eat Dirty Food"
    },
    {
      id: 2,
      title: "After Bathroom",
      message: "You used the bathroom! QUICK! What should you do next?",
      correctAction: "Wash Hands",
      wrongAction: "Touch Everything"
    },
    {
      id: 3,
      title: "Dirty Hands",
      message: "Your hands are dirty from playing! QUICK! Choose the healthy option!",
      correctAction: "Wash Hands",
      wrongAction: "Eat Without Washing"
    },
    {
      id: 4,
      title: "Before Dinner",
      message: "Dinner time! Your hands have germs! QUICK! What do you do?",
      correctAction: "Wash Hands",
      wrongAction: "Eat Anyway"
    },
    {
      id: 5,
      title: "Hygiene Hero",
      message: "Final round! You touched something dirty! QUICK! Make the healthy choice!",
      correctAction: "Wash Hands",
      wrongAction: "Stay Dirty"
    }
  ];

  const handleChoice = (selectedOption) => {
    const endTime = Date.now();
    const time = endTime - startTimeRef.current;
    setReactionTime(time);

    const isCorrect = selectedOption.isCorrect;
    setGameState(isCorrect ? 'success' : 'fail');

    if (isCorrect) {
      setCoins(prev => prev + 3); // +3 coins for reflex game
      showCorrectAnswerFeedback(3, true);
    }

    setTimeout(() => {
      if (currentRound < 5) {
        setCurrentRound(prev => prev + 1);
        setGameState('waiting');
        // Start next round directly
        setTimeout(() => startRound(), 500);
      } else {
        // Game finished - all 5 rounds completed
        setGameFinished(true);
      }
    }, isCorrect ? 1500 : 1000);
  };

  const startRound = () => {
    setGameState('showing');
    const randomDelay = Math.random() * 2000 + 1000; // 1-3 seconds random delay

    timerRef.current = setTimeout(() => {
      setGameState('ready');
      startTimeRef.current = Date.now();
    }, randomDelay);
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/hygiene-items-puzzle");
  };

  useEffect(() => {
    // Start the first round when component mounts
    const timer = setTimeout(() => {
      if (currentRound === 1 && gameState === 'waiting') {
        startRound();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line
  }, []); // Only run on mount

  const currentScenario = roundScenarios.find(s => s.id === currentRound);

  return (
    <GameShell
      title={`Reflex Hygiene - ${currentScenario.title}`}
      subtitle={`Round ${currentRound}/5`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-3"
      gameType="health-male"
      totalLevels={10}
      currentLevel={3}
      showConfetti={gameFinished}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={10} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Round {currentRound}/5: {currentScenario.title}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl mb-4">
              {gameState === 'waiting' && '⏳'}
              {gameState === 'showing' && '🤔'}
              {gameState === 'ready' && '⚡'}
              {gameState === 'success' && '🎉'}
              {gameState === 'fail' && '😅'}
            </div>
            <p className="text-white/90 text-lg">
              {gameState === 'waiting' && 'Get ready for the next scenario...'}
              {gameState === 'showing' && 'Watch for the signal...'}
              {gameState === 'ready' && currentScenario.message}
              {gameState === 'success' && `Great reflex! (${reactionTime}ms)`}
              {gameState === 'fail' && 'Too slow! Remember to choose healthy options quickly!'}
            </p>
          </div>

          {gameState === 'ready' && (
            <div className="grid grid-cols-2 gap-4">
              {getCurrentRoundScenario().map((scenario, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(scenario)}
                  className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    scenario.isCorrect
                      ? 'bg-green-100/20 border-green-500 text-white hover:bg-green-200/20'
                      : 'bg-red-100/20 border-red-500 text-white hover:bg-red-200/20'
                  }`}
                >
                  <div className="text-4xl mb-2">{scenario.emoji}</div>
                  <div className="font-bold text-lg">{scenario.action}</div>
                </button>
              ))}
            </div>
          )}

          {gameState === 'success' && (
            <div className="text-center space-y-4">
              <div className="text-green-400">
                <div className="text-6xl">🎉</div>
                <h3 className="text-xl font-bold text-white">Excellent Reflex!</h3>
                <p className="text-white/90">Reaction time: {reactionTime}ms</p>
              </div>
              <div className="flex justify-center gap-2">
                <span className="text-yellow-500 text-2xl">+3</span>
              </div>
            </div>
          )}

          {gameState === 'fail' && (
            <div className="text-center space-y-4">
              <div className="text-red-400">
                <div className="text-6xl">😅</div>
                <h3 className="text-xl font-bold text-white">Too Slow!</h3>
                <p className="text-white/90">Remember: Always choose healthy options quickly!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexHygiene;