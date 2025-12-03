import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const ViralPostStory = () => {
  const location = useLocation();
  const gameId = "dcos-teen-31";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
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
      title: "Celebrity Death Hoax",
      emoji: "📢",
      situation: "A viral message says 'Celebrity died!' Everyone is sharing it. What should you do?",
      options: [
        { id: 1, text: "Share it immediately", emoji: "📤", isCorrect: false },
        { id: 2, text: "Verify before sharing", emoji: "✅", isCorrect: true },
        { id: 3, text: "Forward to friends", emoji: "➡️", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Breaking News Alert",
      emoji: "🚨",
      situation: "A post claims 'Major disaster happened!' It's going viral. What's your action?",
      options: [
        { id: 1, text: "Share it right away", emoji: "📤", isCorrect: false },
        { id: 2, text: "Check official sources first", emoji: "✅", isCorrect: true },
        { id: 3, text: "Forward to everyone", emoji: "➡️", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Health Warning Viral",
      emoji: "⚠️",
      situation: "A message warns about a 'dangerous product' and asks you to share. What do you do?",
      options: [
        { id: 1, text: "Share to warn others", emoji: "📤", isCorrect: false },
        { id: 2, text: "Verify with health authorities first", emoji: "✅", isCorrect: true },
        { id: 3, text: "Forward immediately", emoji: "➡️", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Miracle Cure Post",
      emoji: "💊",
      situation: "A viral post claims a 'miracle cure' and asks you to share. What should you do?",
      options: [
        { id: 1, text: "Share to help people", emoji: "📤", isCorrect: false },
        { id: 2, text: "Verify with medical experts first", emoji: "✅", isCorrect: true },
        { id: 3, text: "Forward to family", emoji: "➡️", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Urgent Warning Message",
      emoji: "🔥",
      situation: "A message says 'URGENT! Share this or something bad will happen!' What's the right response?",
      options: [
        { id: 1, text: "Share to avoid bad luck", emoji: "📤", isCorrect: false },
        { id: 2, text: "Ignore - it's a hoax", emoji: "✅", isCorrect: true },
        { id: 3, text: "Forward to 10 people", emoji: "➡️", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    setSelectedChoice(optionId);
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
        setSelectedChoice(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentScenarioData = scenarios[currentScenario];

  return (
    <GameShell
      title="Viral Post Story"
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
                      : answered && !option.isCorrect && selectedChoice === option.id
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : selectedChoice === option.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
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
            <div className="text-7xl mb-4">✅</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Fact-Checker! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! Always verify viral posts before sharing. Check official sources, news websites, or fact-checking sites. Spreading unverified information can cause panic and harm. Verify before you share!"
                : "Great job! Keep learning to verify information!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Always verify viral posts with official sources before sharing!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ViralPostStory;
