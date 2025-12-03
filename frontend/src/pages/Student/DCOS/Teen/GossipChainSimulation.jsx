import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const GossipChainSimulation = () => {
  const location = useLocation();
  const gameId = "dcos-teen-13";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAction, setSelectedAction] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getDcosTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);

  const steps = [
    {
      id: 1,
      chat: "Group Chat 1",
      message: "Did you hear? Alex failed the exam!",
      emoji: "💬",
      actions: [
        { id: 1, text: "Forward to another group", stops: false },
        { id: 2, text: "Stop and don't share", stops: true },
        { id: 3, text: "Ask if it's true first", stops: true }
      ]
    },
    {
      id: 2,
      chat: "Group Chat 2",
      message: "Someone said Alex cheated on the exam",
      emoji: "📱",
      actions: [
        { id: 1, text: "Share with more friends", stops: false },
        { id: 2, text: "Stop the rumor", stops: true },
        { id: 3, text: "Add your own details", stops: false }
      ]
    },
    {
      id: 3,
      chat: "Group Chat 3",
      message: "Everyone's saying Alex is a cheater",
      emoji: "💥",
      actions: [
        { id: 1, text: "Spread it further", stops: false },
        { id: 2, text: "Defend Alex and stop rumor", stops: true },
        { id: 3, text: "Stay silent", stops: false }
      ]
    },
    {
      id: 4,
      chat: "Group Chat 4",
      message: "I heard Alex got caught cheating!",
      emoji: "📢",
      actions: [
        { id: 1, text: "Forward the message", stops: false },
        { id: 2, text: "Stop and verify first", stops: true },
        { id: 3, text: "Add more details", stops: false }
      ]
    },
    {
      id: 5,
      chat: "Group Chat 5",
      message: "Alex is a known cheater now",
      emoji: "🔥",
      actions: [
        { id: 1, text: "Keep spreading", stops: false },
        { id: 2, text: "Defend and stop the rumor", stops: true },
        { id: 3, text: "Just watch", stops: false }
      ]
    }
  ];

  const handleAction = (actionId) => {
    if (answered) return;
    
    setSelectedAction(actionId);
    setAnswered(true);
    resetFeedback();
    
    const currentStepData = steps[currentStep];
    const action = currentStepData.actions.find(a => a.id === actionId);
    const isCorrect = action?.stops || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedAction(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentStepData = steps[currentStep];

  return (
    <GameShell
      title="Gossip Chain Simulation"
      score={score}
      subtitle={!showResult ? `Chat ${currentStep + 1} of ${steps.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={steps.length}
      currentLevel={currentStep + 1}
      maxScore={steps.length}
      showConfetti={showResult && score === steps.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl md:text-8xl mb-4 text-center">{currentStepData.emoji}</div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">{currentStepData.chat}</h2>
            
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-4 md:p-5 mb-6">
              <p className="text-white text-base md:text-lg font-semibold text-center">
                "{currentStepData.message}"
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What will you do?</h3>
            
            <div className="space-y-3">
              {currentStepData.actions.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 transition-all ${
                    answered && action.stops
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !action.stops
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-white font-semibold text-center text-base md:text-lg">{action.text}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">{score === steps.length ? "🛡️" : "💔"}</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === steps.length ? "Perfect Rumor Stopper! 🎉" : `You stopped ${score} out of ${steps.length} rumors!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === steps.length 
                ? "Excellent! You stopped all rumors from spreading further. Gossip and rumors can destroy reputations and cause serious emotional harm. Always verify information and refuse to spread unconfirmed stories. You protected Alex!"
                : `You stopped ${score} out of ${steps.length} rumors! Keep learning to stop gossip chains!`}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Always stop rumors, don't spread them! Gossip causes real damage - anxiety, depression, and social isolation.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GossipChainSimulation;
