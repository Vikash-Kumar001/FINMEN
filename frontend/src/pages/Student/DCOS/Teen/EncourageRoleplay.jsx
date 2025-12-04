import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const EncourageRoleplay = () => {
  const location = useLocation();
  const gameId = "dcos-teen-16";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [encouragingWords, setEncouragingWords] = useState("");
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
      situation: "Your classmate Maya is being cyberbullied. She's posting about feeling sad and alone.",
      emoji: "😢",
      approaches: [
        { id: 1, text: "Ignore it - not my business", isCorrect: false },
        { id: 2, text: "Encourage her and report the bullying", isCorrect: true },
        { id: 3, text: "Tell her to just delete social media", isCorrect: false }
      ]
    },
    {
      id: 2,
      situation: "Your friend Sam is being trolled online and feels hopeless.",
      emoji: "💔",
      approaches: [
        { id: 1, text: "Stay out of it", isCorrect: false },
        { id: 2, text: "Support them and report the trolling", isCorrect: true },
        { id: 3, text: "Tell them to ignore it", isCorrect: false }
      ]
    },
    {
      id: 3,
      situation: "A classmate is being excluded and bullied in a group chat.",
      emoji: "😞",
      approaches: [
        { id: 1, text: "Don't get involved", isCorrect: false },
        { id: 2, text: "Include them and report the bullying", isCorrect: true },
        { id: 3, text: "Just watch", isCorrect: false }
      ]
    },
    {
      id: 4,
      situation: "Someone you know is being harassed online and feels scared.",
      emoji: "😰",
      approaches: [
        { id: 1, text: "It's not my problem", isCorrect: false },
        { id: 2, text: "Encourage them and report harassment", isCorrect: true },
        { id: 3, text: "Tell them to block everyone", isCorrect: false }
      ]
    },
    {
      id: 5,
      situation: "A friend is being cyberbullied and losing confidence.",
      emoji: "😔",
      approaches: [
        { id: 1, text: "Ignore the situation", isCorrect: false },
        { id: 2, text: "Support them and report the bullying", isCorrect: true },
        { id: 3, text: "Tell them to toughen up", isCorrect: false }
      ]
    }
  ];

  const handleSubmit = () => {
    if (answered) return;
    
    if (!selectedApproach || encouragingWords.trim().length < 20) return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentScenarioData = scenarios[currentScenario];
    const selectedApp = currentScenarioData.approaches.find(a => a.id === selectedApproach);
    const isCorrect = selectedApp?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
        setSelectedApproach(null);
        setEncouragingWords("");
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentScenarioData = scenarios[currentScenario];
  const selectedApp = currentScenarioData.approaches.find(a => a.id === selectedApproach);

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Encourage Roleplay game completed! Score: ${score}/${scenarios.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId, scenarios.length]);

  return (
    <GameShell
      title="Encourage Roleplay"
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
            <div className="bg-red-500/20 border-2 border-red-400 rounded-lg p-4 md:p-5 mb-6">
              <p className="text-white text-base md:text-lg leading-relaxed">{currentScenarioData.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">1. Choose Your Approach</h3>
            <div className="space-y-3 mb-6">
              {currentScenarioData.approaches.map(app => (
                <button
                  key={app.id}
                  onClick={() => !answered && setSelectedApproach(app.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 transition-all ${
                    selectedApproach === app.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : answered && app.isCorrect
                      ? 'bg-green-500/50 border-green-400'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-white font-semibold text-base md:text-lg">{app.text}</div>
                </button>
              ))}
            </div>

            <h3 className="text-white font-bold mb-2">2. Write Encouraging Words (min 20 chars)</h3>
            <textarea
              value={encouragingWords}
              onChange={(e) => !answered && setEncouragingWords(e.target.value)}
              disabled={answered}
              placeholder="What would you say to encourage them?..."
              className="w-full h-32 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{encouragingWords.length}/200</div>

            <button
              onClick={handleSubmit}
              disabled={!selectedApproach || encouragingWords.trim().length < 20 || answered}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedApproach && encouragingWords.trim().length >= 20 && !answered
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Response
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">{score === scenarios.length ? "💖" : "😔"}</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Compassionate Helper! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Perfect! Encouraging victims and reporting bullying are both essential. Your support can help them feel less alone and the report can stop the bullying. Be the friend who stands up and speaks out!"
                : "Great job! Keep learning to support bullying victims!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Always offer support and report bullying! Your kindness makes a difference!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EncourageRoleplay;
