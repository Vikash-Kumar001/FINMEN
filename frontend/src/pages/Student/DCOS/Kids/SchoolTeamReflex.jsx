import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const SchoolTeamReflex = () => {
  const location = useLocation();
  const gameId = "dcos-kids-85";
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
      situation: "Your school football team just lost the match.",
      emoji: "⚽😢",
      options: [
        { id: 1, text: "Say 'You all are losers!'", emoji: "😠", isCorrect: false },
        { id: 2, text: "Say 'Good effort, we'll win next time!'", emoji: "👏", isCorrect: true },
        { id: 3, text: "Walk away without saying anything", emoji: "🚶‍♂️", isCorrect: false }
      ]
    },
    {
      id: 2,
      situation: "A classmate drops the relay baton during a race.",
      emoji: "🏃‍♀️💨",
      options: [
        { id: 1, text: "Laugh and call them clumsy", emoji: "😂", isCorrect: false },
        { id: 2, text: "Say 'It's okay, keep trying!'", emoji: "🤗", isCorrect: true },
        { id: 3, text: "Complain to teacher about losing", emoji: "📢", isCorrect: false }
      ]
    },
    {
      id: 3,
      situation: "Your debate team forgets a line on stage.",
      emoji: "🎤😬",
      options: [
        { id: 1, text: "Encourage from the audience", emoji: "👍", isCorrect: true },
        { id: 2, text: "Whisper jokes to your friend", emoji: "🤭", isCorrect: false },
        { id: 3, text: "Record it and share online", emoji: "📱", isCorrect: false }
      ]
    },
    {
      id: 4,
      situation: "During basketball, your friend misses an easy shot.",
      emoji: "🏀😔",
      options: [
        { id: 1, text: "Say 'You're terrible at this!'", emoji: "😡", isCorrect: false },
        { id: 2, text: "Clap and say 'You'll get it next time!'", emoji: "🙌", isCorrect: true },
        { id: 3, text: "Ignore and leave", emoji: "🚶‍♀️", isCorrect: false }
      ]
    },
    {
      id: 5,
      situation: "Your house team comes last in sports day.",
      emoji: "🏅😢",
      options: [
        { id: 1, text: "Cheer them and say 'We'll come back stronger!'", emoji: "💪", isCorrect: true },
        { id: 2, text: "Say 'You embarrassed us!'", emoji: "😤", isCorrect: false },
        { id: 3, text: "Complain about unfair rules", emoji: "🤷‍♂️", isCorrect: false }
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
      title="School Team Reflex"
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
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">
              {currentScenarioData.situation}
            </h2>

            <h3 className="text-white font-bold mb-4 text-center">Tap your reflex choice 👇</h3>

            <div className="space-y-3">
              {currentScenarioData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 md:p-5 transition-all ${
                    answered && option.isCorrect
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !option.isCorrect
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4 justify-center">
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
              {score === scenarios.length ? "Perfect Encouraging Spirit! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! That's the right reflex! Encouragement builds teamwork and confidence."
                : "Great job! Keep learning to encourage your teammates!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 That's the right reflex! Encouragement builds teamwork and confidence.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SchoolTeamReflex;
