import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const RoleModelTask = () => {
  const location = useLocation();
  const gameId = "dcos-teen-99";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [helpfulContent, setHelpfulContent] = useState("");
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
      situation: "You want to help your peers with their studies. You can share a blog post with study tips.",
      emoji: "📚",
      approaches: [
        { id: 1, text: "Keep it to yourself - they should figure it out", isCorrect: false },
        { id: 2, text: "Share the helpful blog post with your peers", isCorrect: true },
        { id: 3, text: "Only share with close friends", isCorrect: false }
      ]
    },
    {
      id: 2,
      situation: "You found a great resource about online safety. Your classmates could benefit from it.",
      emoji: "🛡️",
      approaches: [
        { id: 1, text: "Don't share - it's not your responsibility", isCorrect: false },
        { id: 2, text: "Share the resource to help others stay safe", isCorrect: true },
        { id: 3, text: "Share only if asked", isCorrect: false }
      ]
    },
    {
      id: 3,
      situation: "You created helpful notes for an upcoming exam. Others are struggling with the same subject.",
      emoji: "📝",
      approaches: [
        { id: 1, text: "Keep your notes private", isCorrect: false },
        { id: 2, text: "Share your notes to help classmates succeed", isCorrect: true },
        { id: 3, text: "Charge money for your notes", isCorrect: false }
      ]
    },
    {
      id: 4,
      situation: "You learned about mental health resources. Some peers might need this information.",
      emoji: "💚",
      approaches: [
        { id: 1, text: "It's personal - don't share", isCorrect: false },
        { id: 2, text: "Share mental health resources to help others", isCorrect: true },
        { id: 3, text: "Only share if someone asks directly", isCorrect: false }
      ]
    },
    {
      id: 5,
      situation: "You discovered useful productivity tips. Your friends are struggling with time management.",
      emoji: "⏰",
      approaches: [
        { id: 1, text: "Keep your productivity secrets", isCorrect: false },
        { id: 2, text: "Share productivity tips to help others", isCorrect: true },
        { id: 3, text: "Share only with best friends", isCorrect: false }
      ]
    }
  ];

  const handleSubmit = () => {
    if (answered) return;
    
    if (!selectedApproach || helpfulContent.trim().length < 20) return;
    
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
        setHelpfulContent("");
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
      console.log(`🎮 Role Model Task game completed! Score: ${score}/${scenarios.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
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
      title="Role Model Task"
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
            <div className="bg-blue-500/20 border-2 border-blue-400 rounded-lg p-4 md:p-5 mb-6">
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

            <h3 className="text-white font-bold mb-2">2. Describe the Helpful Content You'd Share (min 20 chars)</h3>
            <textarea
              value={helpfulContent}
              onChange={(e) => !answered && setHelpfulContent(e.target.value)}
              disabled={answered}
              placeholder="What helpful content would you share? How would it help others?..."
              className="w-full h-32 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{helpfulContent.length}/200</div>

            <button
              onClick={handleSubmit}
              disabled={!selectedApproach || helpfulContent.trim().length < 20 || answered}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedApproach && helpfulContent.trim().length >= 20 && !answered
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Response
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">{score === scenarios.length ? "🌟" : "😔"}</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Role Model! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Perfect! Sharing helpful content like study tips, resources, and knowledge creates a positive impact. Being a role model means helping others succeed and grow. Your generosity makes a difference in others' lives!"
                : "Great job! Keep learning to be a positive role model!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Share helpful content to help others - be a positive role model online!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleModelTask;
