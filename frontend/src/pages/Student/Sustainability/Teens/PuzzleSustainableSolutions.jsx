import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const PuzzleSustainableSolutions = () => {
  const location = useLocation();
  
  const gameData = getGameDataById("sustainability-teens-4");
  const gameId = gameData?.id || "sustainability-teens-4";
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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
      console.log(`🎮 Puzzle: Sustainable Solutions game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId]);

  const problems = [
    { id: 1, name: "High Carbon Emissions", solution: "Renewable Energy", emoji: "🌫️" },
    { id: 2, name: "Plastic Pollution", solution: "Reduce Single-Use", emoji: "🥤" },
    { id: 3, name: "Water Waste", solution: "Water Conservation", emoji: "💧" },
    { id: 4, name: "Deforestation", solution: "Reforestation", emoji: "🌳" }
  ];

  const solutions = [
    { id: "renewable", name: "Renewable Energy", emoji: "☀️" },
    { id: "reduce", name: "Reduce Single-Use", emoji: "♻️" },
    { id: "conservation", name: "Water Conservation", emoji: "💧" },
    { id: "reforestation", name: "Reforestation", emoji: "🌱" }
  ];

  const handleDragStart = (e, problem) => {
    setDraggedItem(problem);
  };

  const handleDrop = (e, solution) => {
    e.preventDefault();
    if (draggedItem && draggedItem.solution === solution.name) {
      setMatches(prev => [...prev, { problem: draggedItem.id, solution: solution.id }]);
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    setDraggedItem(null);
  };

  const checkAnswers = () => {
    if (matches.length === problems.length) {
      setShowResult(true);
    }
  };

  const resetGame = () => {
    setMatches([]);
    setScore(0);
    setShowResult(false);
    resetFeedback();
  };

  const isMatched = (problemId) => matches.some(m => m.problem === problemId);

  return (
    <GameShell
      title="Puzzle: Sustainable Solutions"
      score={score}
      subtitle="Match problems with sustainable solutions!"
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={1}
      currentLevel={1}
      maxScore={problems.length}
      showConfetti={showResult && score === problems.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult ? (
          <>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Problems:</h3>
              <div className="grid grid-cols-2 gap-4">
                {problems.map(problem => (
                  !isMatched(problem.id) && (
                    <div
                      key={problem.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, problem)}
                      className="bg-red-500/20 p-4 rounded-lg cursor-move border border-red-400"
                    >
                      <span className="text-2xl mr-2">{problem.emoji}</span>
                      <span className="text-white">{problem.name}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Solutions:</h3>
              <div className="grid grid-cols-2 gap-4">
                {solutions.map(solution => (
                  <div
                    key={solution.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, solution)}
                    className="bg-green-500/20 p-4 rounded-lg border border-green-400 min-h-[80px]"
                  >
                    <span className="text-2xl mr-2">{solution.emoji}</span>
                    <span className="text-white">{solution.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={checkAnswers}
              disabled={matches.length !== problems.length}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
            >
              Check Answers
            </button>
          </>
        ) : (
          <div className="text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Great job!</h3>
            <p>You matched {score} out of {problems.length} correctly!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleSustainableSolutions;

