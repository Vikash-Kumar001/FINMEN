import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const SharingGoodContentStory = () => {
  const location = useLocation();
  const gameId = "dcos-kids-97";
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
      title: "The Science Video Post",
      emoji: "🔬",
      situation: "A child shares a video of their fun science experiment instead of posting memes.",
      question: "What do you think about this choice?",
      options: [
        { id: 1, text: "It's great! Learning is cool!", emoji: "🤩", isCorrect: true },
        { id: 2, text: "That's boring, memes are better", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Ignore it and move on", emoji: "😐", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Encouraging Others",
      emoji: "💬",
      situation: "Some friends laugh at the science video and call it nerdy.",
      question: "What should you comment?",
      options: [
        { id: 1, text: "Say 'Nice experiment! I learned something!'", emoji: "👏", isCorrect: true },
        { id: 2, text: "Join the laughter", emoji: "😂", isCorrect: false },
        { id: 3, text: "Say nothing and scroll away", emoji: "😶", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Inspiration Time",
      emoji: "💡",
      situation: "The video inspires you to try a small experiment too.",
      question: "What should you do next?",
      options: [
        { id: 1, text: "Try your own science experiment", emoji: "🧪", isCorrect: true },
        { id: 2, text: "Complain that yours won't be good", emoji: "😞", isCorrect: false },
        { id: 3, text: "Forget about it", emoji: "😴", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Spreading Knowledge",
      emoji: "🌍",
      situation: "Your science post also gets shared by friends online.",
      question: "How should you feel about it?",
      options: [
        { id: 1, text: "Happy you inspired learning!", emoji: "😄", isCorrect: true },
        { id: 2, text: "Worried they copied you", emoji: "😕", isCorrect: false },
        { id: 3, text: "Delete your post", emoji: "🗑️", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Digital Role Model",
      emoji: "🏅",
      situation: "Your teacher praises you for sharing positive content online.",
      question: "What lesson do you learn?",
      options: [
        { id: 1, text: "Good content makes internet better!", emoji: "💖", isCorrect: true },
        { id: 2, text: "Only jokes get likes", emoji: "🙃", isCorrect: false },
        { id: 3, text: "Never post again", emoji: "🚫", isCorrect: false }
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
      title="Sharing Good Content Story"
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
              <p className="text-white text-base md:text-lg leading-relaxed mb-2">{currentScenarioData.situation}</p>
              <p className="text-white/80 text-base md:text-lg">{currentScenarioData.question}</p>
            </div>

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
              {score === scenarios.length ? "Perfect Great Choice! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! That's right! Sharing positive and educational content like science videos makes the internet a smarter, kinder place."
                : "Great job! Keep learning to share positive content online!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 That's right! Sharing positive and educational content like science videos makes the internet a smarter, kinder place.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SharingGoodContentStory;
