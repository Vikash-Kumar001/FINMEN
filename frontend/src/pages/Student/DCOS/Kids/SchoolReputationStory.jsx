import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const SchoolReputationStory = () => {
  const location = useLocation();
  const gameId = "dcos-kids-66";
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
      title: "Angry Post",
      emoji: "😡",
      situation: "You had a bad day and feel like posting 'This school is so stupid!' online.",
      options: [
        { id: 1, text: "Post it anyway", emoji: "🚫", isCorrect: false },
        { id: 2, text: "Talk to a teacher instead", emoji: "💬", isCorrect: true },
        { id: 3, text: "Tell your friends to post it too", emoji: "📣", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Funny Meme",
      emoji: "😂",
      situation: "A friend made a meme making fun of a school teacher and wants you to share it.",
      options: [
        { id: 1, text: "Share it—it's just a joke", emoji: "😅", isCorrect: false },
        { id: 2, text: "Say no, that's disrespectful", emoji: "🙅‍♀️", isCorrect: true },
        { id: 3, text: "Tag the teacher for fun", emoji: "🏷️", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Photo Post",
      emoji: "📸",
      situation: "You took a picture of a messy classroom. Should you post it online?",
      options: [
        { id: 1, text: "Yes, so everyone sees how bad it is", emoji: "🤳", isCorrect: false },
        { id: 2, text: "No, it could hurt the school's image", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Only share it in group chat", emoji: "💬", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Parent Visit",
      emoji: "👩‍🏫",
      situation: "A parent asks you online if your school is good. What should you say?",
      options: [
        { id: 1, text: "Say something positive and honest", emoji: "😊", isCorrect: true },
        { id: 2, text: "Complain about boring classes", emoji: "😒", isCorrect: false },
        { id: 3, text: "Ignore them", emoji: "🤷‍♀️", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Friend's Post",
      emoji: "👫",
      situation: "Your friend posted something rude about school. What should you do?",
      options: [
        { id: 1, text: "Laugh and comment 😂", emoji: "😆", isCorrect: false },
        { id: 2, text: "Tell them it's not right and delete it", emoji: "🧹", isCorrect: true },
        { id: 3, text: "Share it for fun", emoji: "🔁", isCorrect: false }
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
      title="School Reputation Story"
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
            <div className="text-7xl mb-4">🏫</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect School Pride! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! You respect your school online and show pride and kindness!"
                : "Great job! Keep learning to respect your school's reputation online."}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Perfect! Respecting your school online shows pride and kindness. Think before posting—keep your school's reputation strong!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SchoolReputationStory;
