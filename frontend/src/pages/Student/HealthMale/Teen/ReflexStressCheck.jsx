import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexStressCheck = () => {
  const navigate = useNavigate();
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
    { action: "Talk to Friend", emoji: "💬", isCorrect: true },
    { action: "Bottle Emotions", emoji: "🤐", isCorrect: false },
    { action: "Deep Breathing", emoji: "🫁", isCorrect: true },
    { action: "Hold It In", emoji: "😶", isCorrect: false },
    { action: "Ask for Help", emoji: "🆘", isCorrect: true },
    { action: "Hide Stress", emoji: "🙈", isCorrect: false },
    { action: "Exercise", emoji: "🏃", isCorrect: true },
    { action: "Worry More", emoji: "😟", isCorrect: false }
  ];

  const [currentScenario, setCurrentScenario] = useState(null);

  const handleChoice = (selectedOption) => {
    const endTime = Date.now();
    const time = endTime - startTimeRef.current;
    setReactionTime(time);

    const isCorrect = selectedOption.isCorrect;
    setGameState(isCorrect ? 'success' : 'fail');

    if (isCorrect) {
      setCoins(prev => prev + 3);
      showCorrectAnswerFeedback(3, true);
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
    const randomIndex = Math.floor(Math.random() * 4);
    const scenarioPair = [
      scenarios[randomIndex * 2],
      scenarios[randomIndex * 2 + 1]
    ];
    setCurrentScenario(scenarioPair);
    setGameState('showing');

    const randomDelay = Math.random() * 2000 + 1000;

    timerRef.current = setTimeout(() => {
      setGameState('ready');
      startTimeRef.current = Date.now();
    }, randomDelay);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/mind-body-match-puzzle");
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
      title="Reflex Stress Check"
      subtitle={`Round ${currentRound}/5`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-teen-53"
      gameType="health-male"
      totalLevels={60}
      currentLevel={53}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 relative">
          {showCoinFeedback && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-yellow-500 text-white px-3 py-1 rounded-full font-bold text-lg animate-bounce">
                +3
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
              {gameState === 'success' && '💬'}
              {gameState === 'fail' && '🤐'}
            </div>
            <p className="text-white/90 text-lg">
              {gameState === 'waiting' && 'Stress scenario loading...'}
              {gameState === 'showing' && 'Watch for the stress signal...'}
              {gameState === 'ready' && 'QUICK! Choose the healthy stress response!'}
              {gameState === 'success' && `Good choice! (${reactionTime}ms)`}
              {gameState === 'fail' && 'Too slow! Always choose healthy stress relief!'}
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

          {gameState === 'success' && currentScenario && (
            <div className="text-center space-y-4">
              <div className="text-green-400">
                <div className="text-6xl">{currentScenario.find(s => s.isCorrect)?.emoji}</div>
                <h3 className="text-xl font-bold text-white">Great Stress Relief!</h3>
                <p className="text-white/90">Reaction time: {reactionTime}ms</p>
              </div>
              <div className="flex justify-center gap-2">
                <span className="text-yellow-500 text-2xl">+3</span>
              </div>
            </div>
          )}

          {gameState === 'fail' && currentScenario && (
            <div className="text-center space-y-4">
              <div className="text-red-400">
                <div className="text-6xl">{currentScenario.find(s => !s.isCorrect)?.emoji}</div>
                <h3 className="text-xl font-bold text-white">Too Slow!</h3>
                <p className="text-white/90">Remember: Always choose healthy ways to handle stress!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default ReflexStressCheck;
