import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const StrangerGiftStory = () => {
  const location = useLocation();
  const gameId = "dcos-kids-44";
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
      title: "Free Game Code Offer",
      emoji: "🎮",
      situation: "A new online friend says: 'I can send you a free game code if you share your email!'",
      options: [
        { id: 1, text: "Share your email", emoji: "📧", isCorrect: false },
        { id: 2, text: "Refuse politely", emoji: "🙅‍♀️", isCorrect: true },
        { id: 3, text: "Ask for more codes", emoji: "😄", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Stranger Sends a Link",
      emoji: "🔗",
      situation: "Someone online says: 'Click this link to get 5000 free coins!'",
      options: [
        { id: 1, text: "Click the link fast!", emoji: "⚡", isCorrect: false },
        { id: 2, text: "Don't click and tell an adult", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Share link with friends", emoji: "👥", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Mystery Gift Pop-up",
      emoji: "🎁",
      situation: "A pop-up appears: 'You won a free tablet! Enter your home address to claim.'",
      options: [
        { id: 1, text: "Type your address", emoji: "🏠", isCorrect: false },
        { id: 2, text: "Close the pop-up", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Send it to a friend", emoji: "📤", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Friend Requests Personal Info",
      emoji: "💬",
      situation: "Your online gaming buddy says, 'Can I have your phone number to text you?'",
      options: [
        { id: 1, text: "Say no and tell a parent", emoji: "📞", isCorrect: true },
        { id: 2, text: "Share your number", emoji: "☎️", isCorrect: false },
        { id: 3, text: "Ignore and stay quiet", emoji: "🤐", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Gift Code for Friendship",
      emoji: "🎫",
      situation: "Someone says, 'I'll give you a secret code if you keep our chat private.'",
      options: [
        { id: 1, text: "Refuse and report them", emoji: "🚨", isCorrect: true },
        { id: 2, text: "Agree and keep it secret", emoji: "🤫", isCorrect: false },
        { id: 3, text: "Take the code first", emoji: "😬", isCorrect: false }
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
      title="Stranger Gift Story"
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

            <h3 className="text-white font-bold mb-4">What should you do?</h3>

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
            <div className="text-7xl mb-4">🎖️</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Safe Surfer! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! You learned to refuse online stranger gifts and protect your info!"
                : "Great job! Keep learning to stay safe from online strangers."}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Never share your personal info with strangers online — even if it sounds like a gift!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default StrangerGiftStory;
