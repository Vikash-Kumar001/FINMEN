import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const PeerPressureStory = () => {
  const location = useLocation();
  const gameId = "dcos-teen-12";
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
      title: "Trolling Pressure",
      emoji: "😈",
      situation: "Your friends create a group to troll and make fun of a classmate online. They say: \"Come on, join us! Everyone's doing it. It's just for fun!\"",
      options: [
        { id: 1, text: "Join them to fit in", emoji: "😞", isCorrect: false },
        { id: 2, text: "Refuse and stand up against trolling", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Watch but don't participate", emoji: "👀", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Gossip Pressure",
      emoji: "💬",
      situation: "Your friends want you to spread a rumor about someone. They say: \"It's just gossip, everyone does it!\"",
      options: [
        { id: 1, text: "Spread the rumor to fit in", emoji: "😞", isCorrect: false },
        { id: 2, text: "Refuse and stop the rumor", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Listen but don't share", emoji: "👂", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Hate Comment Pressure",
      emoji: "💔",
      situation: "Your group wants you to post mean comments about someone. They say: \"Come on, it's just a joke!\"",
      options: [
        { id: 1, text: "Post mean comments to fit in", emoji: "😞", isCorrect: false },
        { id: 2, text: "Refuse and defend the person", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Stay silent", emoji: "🤐", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Exclusion Pressure",
      emoji: "🚫",
      situation: "Your friends want to exclude someone from a group chat. They say: \"They're annoying, just block them!\"",
      options: [
        { id: 1, text: "Block them to fit in", emoji: "😞", isCorrect: false },
        { id: 2, text: "Refuse and include everyone", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Stay out of it", emoji: "😐", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Cyberbully Pressure",
      emoji: "👥",
      situation: "Your friends are cyberbullying someone and want you to join. They say: \"Everyone's doing it, just join us!\"",
      options: [
        { id: 1, text: "Join them to fit in", emoji: "😞", isCorrect: false },
        { id: 2, text: "Refuse and report the bullying", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Watch from the sidelines", emoji: "👀", isCorrect: false }
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
      title="Peer Pressure Story"
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
            <div className="text-7xl mb-4">💪</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Strong Character! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Perfect! True friends don't pressure you to hurt others. Trolling causes real harm - depression, anxiety, and even self-harm. Stand up for what's right, even if it means standing alone. Real strength is refusing to join cyberbullying!"
                : "Great job! Keep learning to stand up against peer pressure!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Real strength is refusing to join cyberbullying, even when pressured!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PeerPressureStory;
