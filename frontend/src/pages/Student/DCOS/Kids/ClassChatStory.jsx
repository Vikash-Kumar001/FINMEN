import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const ClassChatStory = () => {
  const location = useLocation();
  const gameId = "dcos-kids-83";
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
      title: "Group Chat Trouble",
      emoji: "💬",
      situation: "A classmate posts, 'You're so fat!' in the group chat. Everyone laughs.",
      options: [
        { id: 1, text: "Tell them to stop — it's not nice.", emoji: "🛑", isCorrect: true },
        { id: 2, text: "Laugh along with others.", emoji: "😂", isCorrect: false },
        { id: 3, text: "Ignore it and stay silent.", emoji: "😶", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Forward or Forget?",
      emoji: "📱",
      situation: "Someone sends a funny meme making fun of a classmate's picture.",
      options: [
        { id: 1, text: "Forward it to friends for fun.", emoji: "📤", isCorrect: false },
        { id: 2, text: "Tell them it's mean and delete it.", emoji: "🗑️", isCorrect: true },
        { id: 3, text: "Do nothing and keep it.", emoji: "🤷‍♀️", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Typing Back",
      emoji: "⌨️",
      situation: "You see a mean comment about your best friend online.",
      options: [
        { id: 1, text: "Join in and say worse things.", emoji: "😈", isCorrect: false },
        { id: 2, text: "Report the post and tell your friend.", emoji: "📢", isCorrect: true },
        { id: 3, text: "Just scroll past.", emoji: "👀", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Oops Message",
      emoji: "😳",
      situation: "You accidentally type something rude about a classmate in a group chat.",
      options: [
        { id: 1, text: "Apologize and delete it right away.", emoji: "🙏", isCorrect: true },
        { id: 2, text: "Blame someone else.", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Ignore and hope no one saw it.", emoji: "😬", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "After Class Chat",
      emoji: "🎓",
      situation: "Someone calls another student 'nerd' in chat. Everyone is watching.",
      options: [
        { id: 1, text: "Say 'That's not kind — stop it.'", emoji: "🗣️", isCorrect: true },
        { id: 2, text: "Join the teasing for fun.", emoji: "🤣", isCorrect: false },
        { id: 3, text: "Say nothing and leave group.", emoji: "🚪", isCorrect: false }
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
      title="Class Chat Story"
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
            <div className="text-7xl mb-4">🏅</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Respect Kid Badge! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! You stopped cyberbullying and stood up for kindness in the chat. You earned the 'Respect Kid' badge!"
                : "Great job! Keep learning to stand up for kindness online."}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Amazing! You stopped cyberbullying and stood up for kindness in the chat. You earned the "Respect Kid" badge! 🏅
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ClassChatStory;
