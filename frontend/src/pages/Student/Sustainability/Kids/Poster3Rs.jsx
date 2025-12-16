import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const Poster3Rs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "sustainability-kids-6";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
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
      console.log(`🎮 Poster: Reduce, Reuse, Recycle game completed! Score: ${coins}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, coins, gameId, nextGamePath, nextGameId]);

  const stages = [
    {
      question: "Which poster best promotes the 3 Rs: Reduce, Reuse, Recycle?",
      posters: [
        {
          id: 1,
          title: "3 Rs Save Our Planet",
          description: "A poster showing Reduce, Reuse, Recycle with Earth",
          emoji: "♻️🌍",
          isCorrect: true
        },
        {
          id: 2,
          title: "Just Throw It Away",
          description: "A poster showing only throwing things away",
          emoji: "🗑️",
          isCorrect: false
        },
        {
          id: 3,
          title: "Buy More Stuff",
          description: "A poster encouraging buying new things",
          emoji: "🛍️",
          isCorrect: false
        }
      ],
      correctFeedback: "3 Rs Save Our Planet is the best message for sustainability!",
      explanation: "This poster reminds us to Reduce, Reuse, and Recycle to protect our planet!"
    },
    {
      question: "Which poster encourages reducing waste?",
      posters: [
        {
          id: 1,
          title: "Use Less, Waste Less",
          description: "A poster showing using fewer resources",
          emoji: "📉♻️",
          isCorrect: true
        },
        {
          id: 2,
          title: "Buy Everything",
          description: "A poster encouraging buying lots of things",
          emoji: "🛒",
          isCorrect: false
        },
        {
          id: 3,
          title: "Throw It All Away",
          description: "A poster showing throwing everything away",
          emoji: "🗑️",
          isCorrect: false
        }
      ],
      correctFeedback: "Use Less, Waste Less encourages reducing waste!",
      explanation: "Reducing what we use helps save resources and protect the environment!"
    }
  ];

  const handlePosterSelect = (poster) => {
    if (showResult) return;
    setSelectedPoster(poster);
    if (poster.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      setTimeout(() => {
        if (currentStage < stages.length - 1) {
          setCurrentStage(prev => prev + 1);
          setSelectedPoster(null);
        } else {
          setShowResult(true);
          showAnswerConfetti();
        }
      }, 2000);
    }
  };

  const handleNext = () => {
    navigate("/student/sustainability/kids/journal-recycling");
  };

  return (
    <GameShell
      title="Poster: Reduce, Reuse, Recycle"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Choose the best poster!` : "Poster Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      score={coins}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      maxScore={stages.length}
      showConfetti={showResult && coins === stages.length}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      {flashPoints}
      {!showResult ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              {stages[currentStage].question}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {stages[currentStage].posters.map((poster) => (
                <button
                  key={poster.id}
                  onClick={() => handlePosterSelect(poster)}
                  className={`bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 border-2 transition-all transform hover:scale-105 text-left ${
                    selectedPoster?.id === poster.id
                      ? poster.isCorrect
                        ? "border-green-400"
                        : "border-red-400"
                      : "border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{poster.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-lg mb-2">{poster.title}</div>
                      <div className="text-sm text-gray-300">{poster.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {selectedPoster && (
              <div className={`mt-4 p-4 rounded-lg ${
                selectedPoster.isCorrect ? "bg-green-500/20 border border-green-400" : "bg-red-500/20 border border-red-400"
              }`}>
                <p className="text-white font-semibold">
                  {selectedPoster.isCorrect ? stages[currentStage].correctFeedback : "Not quite! Try again."}
                </p>
                {selectedPoster.isCorrect && (
                  <p className="text-gray-300 text-sm mt-2">{stages[currentStage].explanation}</p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-2xl font-bold text-white">Great job!</h3>
          <p className="text-gray-300">
            You selected {coins} out of {stages.length} correct posters!
          </p>
          <p className="text-green-400 font-semibold">
            You earned {coins} coins! Keep promoting the 3 Rs! ♻️
          </p>
        </div>
      )}
    </GameShell>
  );
};

export default Poster3Rs;

