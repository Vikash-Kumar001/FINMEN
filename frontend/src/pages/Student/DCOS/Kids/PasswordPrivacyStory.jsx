import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const PasswordPrivacyStory = () => {
  const location = useLocation();
  const gameId = "dcos-kids-51";
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
      title: "Best Friend Request",
      emoji: "🤝",
      situation: "Your best friend asks for your game password to help you get more points.",
      options: [
        { id: 1, text: "Share it with them", emoji: "🔓", isCorrect: false },
        { id: 2, text: "Say no and keep it private", emoji: "🔒", isCorrect: true },
        { id: 3, text: "Change password later", emoji: "🔁", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Group Chat Login",
      emoji: "💬",
      situation: "Your classmates make a group account and ask for your login to join.",
      options: [
        { id: 1, text: "Give them your password", emoji: "📤", isCorrect: false },
        { id: 2, text: "Create your own account", emoji: "🧠", isCorrect: true },
        { id: 3, text: "Share it just this once", emoji: "🤫", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Teacher's Laptop",
      emoji: "💻",
      situation: "A friend uses your school laptop and asks for your saved login password.",
      options: [
        { id: 1, text: "Tell them since it's school work", emoji: "🏫", isCorrect: false },
        { id: 2, text: "Say no, it's your account", emoji: "🙅‍♀️", isCorrect: true },
        { id: 3, text: "Ask teacher if it's okay", emoji: "👩‍🏫", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Cousin Curiosity",
      emoji: "👧",
      situation: "Your cousin wants to play your favorite game using your account.",
      options: [
        { id: 1, text: "Let them play on your account", emoji: "🎮", isCorrect: false },
        { id: 2, text: "Help them make their own", emoji: "✨", isCorrect: true },
        { id: 3, text: "Tell them your password secretly", emoji: "🤐", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Online Offer",
      emoji: "🌐",
      situation: "A stranger online says you'll win a reward if you share your password.",
      options: [
        { id: 1, text: "Share it to get the reward", emoji: "💰", isCorrect: false },
        { id: 2, text: "Ignore the message and report", emoji: "🚨", isCorrect: true },
        { id: 3, text: "Ask your friend if it's safe", emoji: "🤔", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentScenarioData = scenarios[currentScenario];
    const selectedOption = currentScenarioData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption?.isCorrect || false;
    
    if (isCorrect) {
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
      title="Password Privacy Story"
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
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">{currentScenarioData.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-4 md:p-5 mb-6">
              <p className="text-white text-base md:text-lg leading-relaxed">{currentScenarioData.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentScenarioData.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 md:p-5 transition-all text-left ${
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
            <div className="text-7xl mb-4">🔒</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Private Keeper! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! You protected your account and proved you're a Private Keeper. Never share passwords, even with friends or family!"
                : "Great job! Keep learning to protect your passwords and stay safe online."}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Privacy keeps you safe online. Never share passwords, even with friends or family!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PasswordPrivacyStory;
