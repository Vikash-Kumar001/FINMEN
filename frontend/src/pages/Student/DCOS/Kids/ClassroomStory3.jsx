import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const ClassroomStory3 = () => {
  const location = useLocation();
  const gameId = "dcos-kids-79";
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
      emoji: "🏫",
      situation: "You're in class taking a test. You notice an AI app on your tablet that can give answers instantly. The teacher isn't watching. What do you do?",
      options: [
        { id: 1, text: "Use the AI app to answer every question fast", emoji: "🤖", isCorrect: false },
        { id: 2, text: "Ignore the app and do the test honestly", emoji: "✅", isCorrect: true },
        { id: 3, text: "Ask AI to give hints but not full answers", emoji: "💡", isCorrect: false }
      ]
    },
    {
      id: 2,
      emoji: "👩‍🏫",
      situation: "Your teacher assigns an essay. You find an AI tool that can write it for you. What's the best action?",
      options: [
        { id: 1, text: "Ask AI to help with ideas, but write it yourself", emoji: "🧠", isCorrect: true },
        { id: 2, text: "Copy the essay from AI and submit it", emoji: "📄", isCorrect: false },
        { id: 3, text: "Let AI write half and you write half", emoji: "✍️", isCorrect: false }
      ]
    },
    {
      id: 3,
      emoji: "🧑‍🤝‍🧑",
      situation: "Your classmate asks you to share an AI-generated summary of your textbook. What do you do?",
      options: [
        { id: 1, text: "Tell them to ask the teacher first", emoji: "🧑‍🏫", isCorrect: true },
        { id: 2, text: "Share it immediately to be helpful", emoji: "📤", isCorrect: false },
        { id: 3, text: "Post it in the group chat for everyone", emoji: "💬", isCorrect: false }
      ]
    },
    {
      id: 4,
      emoji: "💻",
      situation: "AI gives you an answer that looks wrong, but it sounds confident. What should you do?",
      options: [
        { id: 1, text: "Fact-check the answer from other trusted sources", emoji: "🔍", isCorrect: true },
        { id: 2, text: "Trust AI completely—it's always right", emoji: "🤖", isCorrect: false },
        { id: 3, text: "Share the wrong answer with friends", emoji: "📢", isCorrect: false }
      ]
    },
    {
      id: 5,
      emoji: "🧩",
      situation: "You use AI to make a class project presentation. What's the right way to show your work?",
      options: [
        { id: 1, text: "Give credit that AI helped and explain what you learned", emoji: "🏆", isCorrect: true },
        { id: 2, text: "Hide that AI helped you", emoji: "🙊", isCorrect: false },
        { id: 3, text: "Say AI made everything by itself", emoji: "🤖", isCorrect: false }
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
      title="Classroom Story"
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
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Amazing Work! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! You finished all 5 classroom challenges! You proved that honesty and responsibility make AI learning smarter and fairer."
                : `You got ${score} out of ${scenarios.length} correct!`}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Great thinking! You're learning how to use AI with honesty and wisdom.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ClassroomStory3;
