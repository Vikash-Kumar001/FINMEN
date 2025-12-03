import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const ScreenTimerReflex = () => {
  const location = useLocation();
  const gameId = "dcos-kids-21";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentRound, setCurrentRound] = useState(0);
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
      title: "⏰ Time's Up!",
      emoji: "⏰",
      message: "Your screen timer just hit 1 hour while playing a game.",
      options: [
        { id: 1, text: "Ignore and keep playing", emoji: "🎮", isCorrect: false },
        { id: 2, text: "Tap 'Switch Off' immediately", emoji: "🖐️", isCorrect: true },
        { id: 3, text: "Ask for 5 more minutes", emoji: "🕔", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "📱 Movie Marathon",
      emoji: "📱",
      message: "You've been watching videos for 2 hours. The timer says 'Time to rest!'",
      options: [
        { id: 1, text: "Close the app and stretch", emoji: "🤸‍♀️", isCorrect: true },
        { id: 2, text: "Skip the alert and continue", emoji: "⏭️", isCorrect: false },
        { id: 3, text: "Turn off timer notifications", emoji: "🚫", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "🎧 Music Mood",
      emoji: "🎧",
      message: "The timer buzzes while you're listening to songs.",
      options: [
        { id: 1, text: "Take a short break", emoji: "☕", isCorrect: true },
        { id: 2, text: "Increase timer limit", emoji: "⏫", isCorrect: false },
        { id: 3, text: "Ignore the reminder", emoji: "🙉", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "🕹️ Weekend Gaming",
      emoji: "🕹️",
      message: "Your reflex test app shows 'Screen limit crossed'.",
      options: [
        { id: 1, text: "Pause and do something offline", emoji: "🌳", isCorrect: true },
        { id: 2, text: "Continue gaming anyway", emoji: "💥", isCorrect: false },
        { id: 3, text: "Disable screen limit", emoji: "🔧", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "🌙 Night Scroll",
      emoji: "🌙",
      message: "It's bedtime but your screen timer says you've been scrolling too long.",
      options: [
        { id: 1, text: "Switch off device and sleep", emoji: "😴", isCorrect: true },
        { id: 2, text: "Lower brightness and continue", emoji: "💡", isCorrect: false },
        { id: 3, text: "Open one last app", emoji: "📲", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentScenarioData = scenarios[currentRound];
    const selectedOption = currentScenarioData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentRound < scenarios.length - 1) {
        setCurrentRound(prev => prev + 1);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentScenario = scenarios[currentRound];

  return (
    <GameShell
      title="Screen Timer Reflex"
      score={score}
      subtitle={!showResult ? `Scenario ${currentRound + 1} of ${scenarios.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={scenarios.length}
      currentLevel={currentRound + 1}
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
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">{currentScenario.title}</h2>
            <div className="bg-blue-500/20 border-2 border-blue-400 rounded-lg p-4 md:p-5 mb-6">
              <p className="text-white text-base md:text-lg leading-relaxed text-center font-semibold">
                {currentScenario.message}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What will you do?</h3>

            <div className="space-y-3 mb-6">
              {currentScenario.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 md:p-5 transition-all ${
                    answered && option.isCorrect
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !option.isCorrect
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-3xl md:text-4xl">{option.emoji}</div>
                    <div className="text-white font-semibold text-base md:text-lg">{option.text}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">⚡</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Reflex! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! You always respond quickly to screen timers and make healthy digital decisions!"
                : "Great job! Remember to respect screen time limits for your health."}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Limiting screen time helps your eyes and mind stay active!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ScreenTimerReflex;
