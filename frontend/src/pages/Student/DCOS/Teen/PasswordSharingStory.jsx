import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const PasswordSharingStory = () => {
  const location = useLocation();
  const gameId = "dcos-teen-1";
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

  const scenarios = [
    {
      id: 1,
      title: "Password Request",
      emoji: "🔐",
      situation: "Your best friend asks: 'Can I borrow your password to check something on your account? I promise I'll just look quickly and won't change anything.'",
      options: [
        { id: 1, text: "Share it - they're my best friend", emoji: "🤝", isCorrect: false },
        { id: 2, text: "Never share passwords with anyone", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Share it but change it later", emoji: "🔄", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Sibling Request",
      emoji: "👨‍👩‍👧",
      situation: "Your sibling says: 'I need to use your account for a game. Just tell me your password, I won't mess with anything.'",
      options: [
        { id: 1, text: "Share it - they're family", emoji: "👨‍👩‍👧", isCorrect: false },
        { id: 2, text: "Never share passwords, even with family", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Share it temporarily", emoji: "⏰", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Classmate Help",
      emoji: "👥",
      situation: "A classmate asks: 'Can I use your account to submit my assignment? I'll just log in once.'",
      options: [
        { id: 1, text: "Share it to help them", emoji: "🤝", isCorrect: false },
        { id: 2, text: "Never share passwords with anyone", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Share it but monitor the account", emoji: "👀", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Online Friend",
      emoji: "💬",
      situation: "Someone you've chatted with online asks: 'Can I access your account to help you with something?'",
      options: [
        { id: 1, text: "Share it - they seem trustworthy", emoji: "😊", isCorrect: false },
        { id: 2, text: "Never share passwords with anyone", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Share it but change it immediately after", emoji: "🔄", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Tech Support Scam",
      emoji: "📞",
      situation: "Someone claiming to be tech support calls: 'We need your password to fix your account. Can you share it?'",
      options: [
        { id: 1, text: "Share it - they're tech support", emoji: "🔧", isCorrect: false },
        { id: 2, text: "Never share passwords - this is a scam", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Share it but verify first", emoji: "🤔", isCorrect: false }
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
      title="Password Sharing Story"
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

            <div className="space-y-3">
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
            <div className="text-7xl mb-4">🛡️</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Password Security! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! Never share your password with anyone - not even your best friend. Passwords are personal security keys. Even with good intentions, sharing them puts your account, data, and privacy at risk."
                : "Great job! Keep learning to protect your passwords!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Use secure password managers if you need to share access to something.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PasswordSharingStory;
