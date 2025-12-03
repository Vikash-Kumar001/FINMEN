import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const FakeFriendStory = () => {
  const location = useLocation();
  const gameId = "dcos-teen-7";
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
      title: "Suspicious Message",
      emoji: "👤",
      situation: 'A stranger online messages you: "Hey! I know your friend Sarah. She told me to add you. Can we chat?"',
      options: [
        { id: 1, text: "Trust them since they know my friend's name", emoji: "🤝", isCorrect: false },
        { id: 2, text: "Don't trust - verify with Sarah first", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Add them but don't share anything personal", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Mutual Friend Request",
      emoji: "👥",
      situation: 'Someone sends a friend request saying: "We have 5 mutual friends! Let\'s connect!"',
      options: [
        { id: 1, text: "Accept - we have mutual friends", emoji: "✅", isCorrect: false },
        { id: 2, text: "Verify with mutual friends first", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Accept but be cautious", emoji: "⚠️", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Urgent Request",
      emoji: "⏰",
      situation: 'Someone messages: "Your friend Mike is in trouble! Add me to help him!"',
      options: [
        { id: 1, text: "Add them immediately to help", emoji: "🚨", isCorrect: false },
        { id: 2, text: "Contact Mike directly to verify", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Add them but ask questions", emoji: "❓", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "School Connection",
      emoji: "🎓",
      situation: 'Someone claims: "I go to your school! Let\'s be friends on social media!"',
      options: [
        { id: 1, text: "Accept - they go to my school", emoji: "✅", isCorrect: false },
        { id: 2, text: "Verify they actually go to your school", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Accept but don't share details", emoji: "🤐", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Helpful Stranger",
      emoji: "💬",
      situation: 'Someone offers: "I can help you with homework! Just add me as a friend first."',
      options: [
        { id: 1, text: "Add them - they want to help", emoji: "📚", isCorrect: false },
        { id: 2, text: "Don't add - verify their identity first", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Add but be careful", emoji: "⚠️", isCorrect: false }
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
      title="Fake Friend Story"
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
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center text-red-400">{currentScenarioData.title}</h2>
            <div className="bg-red-500/20 border-2 border-red-400 rounded-lg p-4 md:p-5 mb-6">
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
            <div className="text-7xl mb-4">🌟</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Smart Move! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Perfect! Scammers often use names from public profiles to gain trust. ALWAYS verify with your friend directly (call or meet in person) before accepting friend requests from 'mutual friends' you don't know. Social engineering is a common tactic!"
                : "Great job! Keep learning to verify before trusting!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Never trust someone just because they know a name or claim to know your friends!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FakeFriendStory;
