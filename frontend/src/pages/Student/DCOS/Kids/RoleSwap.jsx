import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const RoleSwap = () => {
  const location = useLocation();
  const gameId = "dcos-kids-17";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedFeelings, setSelectedFeelings] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getDcosKidsGames({});
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

  const scenarios = [
    {
      id: 1,
      situation: "Someone posts a mean comment about your drawing online.",
      emoji: "🎨",
      feelings: [
        { id: 1, text: "Sad", emoji: "😢", isValid: true },
        { id: 2, text: "Happy", emoji: "😊", isValid: false },
        { id: 3, text: "Hurt", emoji: "💔", isValid: true }
      ]
    },
    {
      id: 2,
      situation: "Kids at school laugh at your new haircut.",
      emoji: "💇",
      feelings: [
        { id: 1, text: "Embarrassed", emoji: "😳", isValid: true },
        { id: 2, text: "Proud", emoji: "😌", isValid: false },
        { id: 3, text: "Upset", emoji: "😥", isValid: true }
      ]
    },
    {
      id: 3,
      situation: "Someone shares your secret without asking.",
      emoji: "🤫",
      feelings: [
        { id: 1, text: "Betrayed", emoji: "😞", isValid: true },
        { id: 2, text: "Grateful", emoji: "🙏", isValid: false },
        { id: 3, text: "Angry", emoji: "😠", isValid: true }
      ]
    },
    {
      id: 4,
      situation: "You're left out of a game everyone else is playing.",
      emoji: "🎮",
      feelings: [
        { id: 1, text: "Lonely", emoji: "😔", isValid: true },
        { id: 2, text: "Excited", emoji: "🎉", isValid: false },
        { id: 3, text: "Sad", emoji: "😢", isValid: true }
      ]
    },
    {
      id: 5,
      situation: "Someone spreads a rumor about you that isn't true.",
      emoji: "🗣️",
      feelings: [
        { id: 1, text: "Angry", emoji: "😠", isValid: true },
        { id: 2, text: "Happy", emoji: "😊", isValid: false },
        { id: 3, text: "Hurt", emoji: "💔", isValid: true }
      ]
    }
  ];

  const currentScenarioData = scenarios[currentScenario];

  const handleFeelingSelect = (feeling) => {
    if (selectedFeelings.includes(feeling.id)) {
      setSelectedFeelings(selectedFeelings.filter(id => id !== feeling.id));
    } else {
      setSelectedFeelings([...selectedFeelings, feeling.id]);
    }
  };

  const handleNext = () => {
    const hasValidSelection = selectedFeelings.some(id => 
      currentScenarioData.feelings.find(f => f.id === id && f.isValid)
    );
    
    if (hasValidSelection) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    resetFeedback();
    
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
        setSelectedFeelings([]);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const isFeelingSelected = (feelingId) => {
    return selectedFeelings.includes(feelingId);
  };

  return (
    <GameShell
      title="Role Swap Simulation"
      score={score}
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={scenarios.length}
      currentLevel={currentScenario + 1}
      maxScore={scenarios.length}
      showConfetti={showResult && score === scenarios.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl md:text-8xl mb-4 text-center">{currentScenarioData.emoji}</div>
            
            <div className="bg-blue-500/20 rounded-lg p-4 md:p-5 mb-6">
              <h3 className="text-white font-bold mb-2 text-center">Imagine...</h3>
              <p className="text-white text-base md:text-lg leading-relaxed text-center">
                {currentScenarioData.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">How would you feel? (Select all that apply)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {currentScenarioData.feelings.map(feeling => (
                <button
                  key={feeling.id}
                  onClick={() => handleFeelingSelect(feeling)}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    isFeelingSelected(feeling.id)
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-4xl mb-2">{feeling.emoji}</div>
                  <div className="text-white font-semibold text-sm md:text-base">{feeling.text}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedFeelings.length === 0}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedFeelings.length > 0
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              {currentScenario < scenarios.length - 1 ? "Next Scenario" : "Finish"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">💖</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Empathy! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! You understand how being bullied feels. This helps you be kinder and stand up against bullying!"
                : "Great job! Understanding others' feelings helps you be kinder and stand up against bullying!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Remember: Bullying hurts. Before you say or do something, think about how it would make YOU feel if someone did it to you.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleSwap;
