import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { PenSquare } from "lucide-react";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const JournalOfGreenLiving = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-7");
  const gameId = gameData?.id || "sustainability-teens-7";
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
      const games = getSustainabilityTeenGames({});
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
      console.log(`🎮 Journal of Green Living game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
    { question: 'Write: "One way I reduced my carbon footprint today was ___."', minLength: 15 },
    { question: 'Write: "A sustainable habit I want to develop is ___."', minLength: 15 },
    { question: 'Write: "How can I encourage others to live more sustainably? ___."', minLength: 15 },
    { question: 'Write: "My biggest environmental concern is ___."', minLength: 15 },
    { question: 'Write: "I feel motivated to act because ___."', minLength: 15 }
  ];

  const handleSubmit = () => {
    if (showResult) return;
    resetFeedback();
    const entryText = entry.trim();
    if (entryText.length >= stages[currentStage].minLength) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      const isLastQuestion = currentStage === stages.length - 1;
      setTimeout(() => {
        if (isLastQuestion) {
          setShowResult(true);
        } else {
          setEntry("");
          setCurrentStage(prev => prev + 1);
        }
      }, 1500);
    }
  };

  return (
    <GameShell
      title="Journal of Green Living"
      score={score}
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Reflect on sustainability!` : "Journal Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score === stages.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <PenSquare className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold text-white">{stages[currentStage].question}</h3>
            </div>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-green-400 focus:outline-none h-32"
              placeholder="Write your thoughts here..."
            />
            <button
              onClick={handleSubmit}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-transform transform hover:scale-105"
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Journal Completed!</h3>
            <p>You reflected on {score} out of {stages.length} prompts.</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfGreenLiving;

