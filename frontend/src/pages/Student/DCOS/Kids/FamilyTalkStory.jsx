import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const FamilyTalkStory = () => {
  const location = useLocation();
  const gameId = "dcos-kids-36";
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
      title: "Forwarded Message 🚨",
      emoji: "📱",
      situation: "Grandpa sends a WhatsApp message saying: 'This new medicine cures all diseases!'",
      options: [
        { id: 1, text: "Believe it and share to everyone", emoji: "📤", isCorrect: false },
        { id: 2, text: "Tell Grandpa kindly that it's fake news", emoji: "💬", isCorrect: true },
        { id: 3, text: "Laugh and ignore it", emoji: "😅", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Scary Headline 😱",
      emoji: "📰",
      situation: "Grandpa says: 'The city will be locked down tomorrow! It's all over WhatsApp!'",
      options: [
        { id: 1, text: "Tell Grandpa to verify from news channels", emoji: "🧐", isCorrect: true },
        { id: 2, text: "Forward it to friends immediately", emoji: "📲", isCorrect: false },
        { id: 3, text: "Stay silent and confused", emoji: "😕", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Fake Prize Message 🎁",
      emoji: "🎯",
      situation: "Grandpa gets a message saying: 'You won ₹1,00,000! Click the link to claim.'",
      options: [
        { id: 1, text: "Click the link fast", emoji: "⚡", isCorrect: false },
        { id: 2, text: "Warn Grandpa not to click suspicious links", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Ignore but say nothing", emoji: "🤐", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Funny Meme 🧓😂",
      emoji: "🤣",
      situation: "Grandpa shares a funny meme that makes fun of someone's religion.",
      options: [
        { id: 1, text: "Laugh and forward it too", emoji: "😆", isCorrect: false },
        { id: 2, text: "Tell Grandpa kindly that jokes shouldn't hurt feelings", emoji: "💖", isCorrect: true },
        { id: 3, text: "Ignore the message", emoji: "🙈", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Health Tips 👴🍵",
      emoji: "🫖",
      situation: "Grandpa forwards: 'Drink only turmeric water daily, no need for doctors!'",
      options: [
        { id: 1, text: "Tell Grandpa to check with real doctors", emoji: "👩‍⚕️", isCorrect: true },
        { id: 2, text: "Follow it blindly", emoji: "😇", isCorrect: false },
        { id: 3, text: "Make fun of the message", emoji: "😜", isCorrect: false }
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
      title="Family Talk Story"
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
            <div className="bg-purple-500/20 rounded-lg p-4 md:p-5 mb-6">
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
            <div className="text-7xl mb-4">🏅</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Kind Corrector! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! You helped Grandpa learn about fake news with kindness and truth. You're a real Kind Corrector!"
                : "Great job! Teaching family members how to spot fake news makes you a real Kind Corrector!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Always fact-check and spread positivity online!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FamilyTalkStory;
