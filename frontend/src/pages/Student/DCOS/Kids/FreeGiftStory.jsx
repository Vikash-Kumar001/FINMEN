import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const FreeGiftStory = () => {
  const location = useLocation();
  const gameId = "dcos-kids-41";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentScenario, setCurrentScenario] = useState(0);
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
      popup: "🎁 Free iPhone! Just click this link!",
      emoji: "🎁",
      options: [
        { id: 1, text: "Click to claim the gift", emoji: "🖱️", isSafe: false },
        { id: 2, text: "Close the pop-up immediately", emoji: "🚫", isSafe: true },
        { id: 3, text: "Share link with friends", emoji: "📤", isSafe: false }
      ]
    },
    {
      id: 2,
      popup: "🤑 You won ₹10,000! Enter your card number to get it!",
      emoji: "💰",
      options: [
        { id: 1, text: "Enter card details", emoji: "💳", isSafe: false },
        { id: 2, text: "Ignore and tell a parent", emoji: "👨‍👩‍👧", isSafe: true },
        { id: 3, text: "Try it just once", emoji: "😬", isSafe: false }
      ]
    },
    {
      id: 3,
      popup: "📦 Your parcel is waiting! Click to track it!",
      emoji: "📦",
      options: [
        { id: 1, text: "Click and track", emoji: "🔗", isSafe: false },
        { id: 2, text: "Ask your parents before clicking", emoji: "👨‍👩‍👧", isSafe: true },
        { id: 3, text: "Download the tracking app", emoji: "📲", isSafe: false }
      ]
    },
    {
      id: 4,
      popup: "🎮 Free game coins! Just install this app!",
      emoji: "🎮",
      options: [
        { id: 1, text: "Install right now", emoji: "⬇️", isSafe: false },
        { id: 2, text: "Ignore suspicious links", emoji: "🚫", isSafe: true },
        { id: 3, text: "Ask friend if it's real", emoji: "🤔", isSafe: false }
      ]
    },
    {
      id: 5,
      popup: "💻 You are the lucky winner! Click here to claim now!",
      emoji: "💻",
      options: [
        { id: 1, text: "Click to claim prize", emoji: "🖱️", isSafe: false },
        { id: 2, text: "Close and report it", emoji: "🚨", isSafe: true },
        { id: 3, text: "Reply to ask more", emoji: "💬", isSafe: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentScenarioData = scenarios[currentScenario];
    const selectedOption = currentScenarioData.options.find(opt => opt.id === optionId);
    const isSafe = selectedOption?.isSafe || false;
    
    if (isSafe) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentScenarioData = scenarios[currentScenario];

  return (
    <GameShell
      title="Free Gift Story"
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
            <div className="bg-red-500/20 border-2 border-red-400/50 rounded-lg p-3 mb-4">
              <p className="text-red-200 text-xs font-semibold">
                ⚠️ Don't trust pop-ups that promise free gifts or prizes!
              </p>
            </div>

            <div className="text-6xl md:text-8xl mb-4 text-center">{currentScenarioData.emoji}</div>

            <div className="bg-yellow-500/20 rounded-lg p-4 mb-6">
              <p className="text-white italic text-lg md:text-xl text-center">
                Pop-up says: "{currentScenarioData.popup}"
              </p>
            </div>

            <p className="text-white/90 mb-4 text-center font-semibold text-lg">
              What should you do?
            </p>

            <div className="space-y-3">
              {currentScenarioData.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={answered}
                  className={`w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 md:p-5 transition-all transform hover:scale-102 ${
                    answered && option.isSafe
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !option.isSafe
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-3xl md:text-4xl">{option.emoji}</div>
                    <div className="text-white font-medium text-base md:text-lg">{option.text}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Safe Kid! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-4">
              {score === scenarios.length 
                ? "Excellent! You always make safe choices with suspicious pop-ups!"
                : `You made ${score} out of ${scenarios.length} safe choices!`}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Always close suspicious pop-ups and never click on "too good to be true" offers.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FreeGiftStory;
