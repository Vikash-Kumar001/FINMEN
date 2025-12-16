import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { PenSquare } from "lucide-react";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const JournalRecycling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "sustainability-kids-7";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);

  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityKidsGames({});
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

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Journal of Recycling game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId]);

  const stages = [
    { question: 'Write: "One thing I recycled today was ___."', minLength: 10 },
    { question: 'Write: "Recycling helps our planet by ___."', minLength: 10 },
    { question: 'Write: "I will recycle more by ___."', minLength: 10 },
    { question: 'Write: "My favorite thing to recycle is ___."', minLength: 10 },
    { question: 'Write: "I feel good when I recycle because ___."', minLength: 10 }
  ];

  const handleSubmit = () => {
    if (showResult) return;
    resetFeedback();
    const entryText = entry.trim();
    if (entryText.length >= stages[currentStage].minLength) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
      const isLastQuestion = currentStage === stages.length - 1;
      setTimeout(() => {
        if (isLastQuestion) {
          setShowResult(true);
          showAnswerConfetti();
        } else {
          setEntry("");
          setCurrentStage((prev) => prev + 1);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/student/sustainability/kids/plastic-bag-story");
  };

  const finalScore = score;
  const coins = finalScore;

  return (
    <GameShell
      title="Journal of Recycling"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Reflect on recycling!` : "Journal Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      score={score}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      maxScore={stages.length}
      showConfetti={showResult && score === stages.length}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      {flashPoints}
      {!showResult ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-400/30">
            <div className="flex items-center gap-3 mb-4">
              <PenSquare className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold text-white">{stages[currentStage].question}</h3>
            </div>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-white placeholder-gray-400 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <p className="text-sm text-gray-300 mt-2">
              Minimum {stages[currentStage].minLength} characters required
            </p>
            <button
              onClick={handleSubmit}
              disabled={entry.trim().length < stages[currentStage].minLength}
              className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-white">Journal Complete!</h3>
          <p className="text-gray-300">
            You completed {finalScore} out of {stages.length} journal entries!
          </p>
          <p className="text-green-400 font-semibold">
            You earned {coins} coins! Keep thinking about recycling! ♻️
          </p>
        </div>
      )}
    </GameShell>
  );
};

export default JournalRecycling;

