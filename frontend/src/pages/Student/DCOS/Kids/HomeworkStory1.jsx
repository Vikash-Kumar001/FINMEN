import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const HomeworkStory1 = () => {
  const location = useLocation();
  const gameId = "dcos-kids-94";
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
      emoji: "🧮",
      situation: "I found a YouTube channel explaining fractions — should I watch it?",
      options: [
        { id: 1, text: "Yes! It can help you learn.", emoji: "✅", isUseful: true },
        { id: 2, text: "No, YouTube is only for fun.", emoji: "❌", isUseful: false },
        { id: 3, text: "Ignore homework and play games instead.", emoji: "🎮", isUseful: false }
      ]
    },
    {
      id: 2,
      emoji: "📺",
      situation: "The video has too many ads — what should I do?",
      options: [
        { id: 1, text: "Click all ads for prizes!", emoji: "🎁", isUseful: false },
        { id: 2, text: "Ignore ads and focus on learning part.", emoji: "📚", isUseful: true },
        { id: 3, text: "Close YouTube and stop learning.", emoji: "🚫", isUseful: false }
      ]
    },
    {
      id: 3,
      emoji: "💡",
      situation: "I found another video teaching with examples — should I save it?",
      options: [
        { id: 1, text: "Yes, save useful learning videos.", emoji: "💾", isUseful: true },
        { id: 2, text: "Comment randomly for fun.", emoji: "💬", isUseful: false },
        { id: 3, text: "Share it to random people.", emoji: "📤", isUseful: false }
      ]
    },
    {
      id: 4,
      emoji: "💬",
      situation: "Someone in comments said wrong facts — what should I do?",
      options: [
        { id: 1, text: "Argue and fight in comments.", emoji: "😠", isUseful: false },
        { id: 2, text: "Ignore or report wrong info calmly.", emoji: "🚨", isUseful: true },
        { id: 3, text: "Believe everything you read.", emoji: "🤔", isUseful: false }
      ]
    },
    {
      id: 5,
      emoji: "🎓",
      situation: "I learned a trick from YouTube — should I tell my teacher?",
      options: [
        { id: 1, text: "Yes! Sharing learning is great.", emoji: "🤝", isUseful: true },
        { id: 2, text: "No, keep it secret.", emoji: "🤫", isUseful: false },
        { id: 3, text: "Forget it and watch cartoons.", emoji: "📺", isUseful: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentScenarioData = scenarios[currentScenario];
    const selectedOption = currentScenarioData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption?.isUseful || false;
    
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
      title="Homework Story"
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
            <div className="bg-green-500/20 border-2 border-green-400/50 rounded-lg p-3 mb-4">
              <p className="text-green-200 text-xs font-semibold">
                💡 Use the internet wisely to LEARN, not waste time!
              </p>
            </div>

            <div className="text-6xl md:text-8xl mb-4 text-center">{currentScenarioData.emoji}</div>

            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white italic text-base md:text-lg">
                Friend says: "{currentScenarioData.situation}"
              </p>
            </div>

            <p className="text-white/90 mb-4 text-center font-semibold text-lg">
              What should your friend do?
            </p>

            <div className="space-y-3">
              {currentScenarioData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 md:p-5 transition-all text-left ${
                    answered && option.isUseful
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !option.isUseful
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
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
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Smart Learner Badge! 🎉" : `You made ${score} out of ${scenarios.length} smart choices!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! You made smart choices about using YouTube for learning!"
                : "Great job! Keep learning to use YouTube wisely for your studies!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Remember: YouTube can be a powerful learning tool — use it wisely for your studies!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HomeworkStory1;
