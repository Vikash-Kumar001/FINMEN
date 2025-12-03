import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const ConsentStory = () => {
  const location = useLocation();
  const gameId = "dcos-teen-51";
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
      title: "Photo Without Permission",
      emoji: "📸",
      situation: "A friend posts your picture without asking. What should you do?",
      options: [
        { id: 1, text: "Ignore it - it's just a photo", emoji: "😐", isCorrect: false },
        { id: 2, text: "Ask them to remove it", emoji: "💬", isCorrect: true },
        { id: 3, text: "Post their photo too", emoji: "📤", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Tagged Without Consent",
      emoji: "🏷️",
      situation: "Someone tags you in a post you don't like. What's the right action?",
      options: [
        { id: 1, text: "Leave it as is", emoji: "😐", isCorrect: false },
        { id: 2, text: "Ask them to remove the tag", emoji: "💬", isCorrect: true },
        { id: 3, text: "Tag them in something bad", emoji: "😡", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Shared Personal Info",
      emoji: "📱",
      situation: "A friend shares your phone number online without asking. What should you do?",
      options: [
        { id: 1, text: "It's okay, they're a friend", emoji: "🤷", isCorrect: false },
        { id: 2, text: "Ask them to remove it immediately", emoji: "🚨", isCorrect: true },
        { id: 3, text: "Share their number too", emoji: "📤", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Video Without Permission",
      emoji: "🎥",
      situation: "Someone posts a video of you without your consent. What's your response?",
      options: [
        { id: 1, text: "Let it stay", emoji: "😐", isCorrect: false },
        { id: 2, text: "Request them to take it down", emoji: "💬", isCorrect: true },
        { id: 3, text: "Report it without asking", emoji: "🚫", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Story Without Asking",
      emoji: "📖",
      situation: "A friend shares your personal story online without asking. What should you do?",
      options: [
        { id: 1, text: "It's fine, stories are meant to be shared", emoji: "🤷", isCorrect: false },
        { id: 2, text: "Politely ask them to remove it", emoji: "💬", isCorrect: true },
        { id: 3, text: "Share their story too", emoji: "📤", isCorrect: false }
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
      title="Consent Story"
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
            <div className="text-7xl mb-4">💬</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Consent Advocate! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! You have the right to control your own content and personal information. Always ask for permission before sharing someone else's photos, videos, or personal information. If someone shares yours without asking, politely request them to remove it!"
                : "Great job! Keep learning about consent and privacy!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Always ask for permission before sharing someone's content - consent matters!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ConsentStory;
