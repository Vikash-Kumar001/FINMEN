import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const PosterSaveWater = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "sustainability-kids-16";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 25;
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
      console.log(`🎮 Poster: Save Water game completed! Score: ${coins}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
      question: "Which poster best promotes saving water?",
      posters: [
        {
          id: 1,
          title: "Waste All Water",
          description: "A poster encouraging wasting water",
          emoji: "💦",
          isCorrect: false
        },
        {
          id: 2,
          title: "Every Drop Counts",
          description: "A poster showing water drops with Earth",
          emoji: "💧🌍",
          isCorrect: true
        },
        {
          id: 3,
          title: "Water is Unlimited",
          description: "A poster saying water never runs out",
          emoji: "🌊",
          isCorrect: false
        }
      ],
      correctFeedback: "Every Drop Counts is the best message for water conservation!",
      explanation: "This poster reminds us that every drop of water is precious!"
    },
    {
      question: "Which poster encourages turning off taps?",
      posters: [
        {
          id: 1,
          title: "Leave Taps Running",
          description: "A poster showing taps always on",
          emoji: "💦",
          isCorrect: false
        },
        {
          id: 2,
          title: "Use All Water",
          description: "A poster encouraging using all water",
          emoji: "🌊",
          isCorrect: false
        },
        {
          id: 3,
          title: "Turn Off When Not Using",
          description: "A poster showing turning off taps",
          emoji: "🚰💧",
          isCorrect: true
        }
      ],
      correctFeedback: "Turn Off When Not Using encourages saving water!",
      explanation: "Turning off taps when not using them saves precious water!"
    },
    {
      question: "Which poster best shows fixing leaks?",
      posters: [
        {
          id: 1,
          title: "Report Leaks",
          description: "A poster showing how to report water leaks",
          emoji: "🔧💧",
          isCorrect: false
        },
        {
          id: 2,
          title: "Ignore Dripping Taps",
          description: "A poster showing ignoring dripping taps",
          emoji: "无视💧",
          isCorrect: false
        },
        {
          id: 3,
          title: "Fix Leaks Fast",
          description: "A poster showing quick leak repairs",
          emoji: "🛠️💧",
          isCorrect: true
        }
      ],
      correctFeedback: "Fix Leaks Fast is the responsible choice!",
      explanation: "Fixing leaks quickly prevents water waste and saves money!"
    },
    {
      question: "Which poster promotes shorter showers?",
      posters: [
        {
          id: 1,
          title: "Take Short Showers",
          description: "A poster showing timing your shower",
          emoji: "⏱️🚿",
          isCorrect: true
        },
        {
          id: 2,
          title: "Long Luxury Showers",
          description: "A poster showing long relaxing showers",
          emoji: "🛁",
          isCorrect: false
        },
        {
          id: 3,
          title: "Baths Only",
          description: "A poster showing only taking baths",
          emoji: "🛀",
          isCorrect: false
        }
      ],
      correctFeedback: "Take Short Showers helps conserve water!",
      explanation: "Shorter showers significantly reduce water usage!"
    },
    {
      question: "Which poster encourages collecting rainwater?",
      posters: [
        {
          id: 1,
          title: "Use Hose Always",
          description: "A poster showing using hose for everything",
          emoji: "🚿",
          isCorrect: false
        },
        {
          id: 2,
          title: "Collect Rainwater",
          description: "A poster showing rain collection barrels",
          emoji: "🌧️🪣",
          isCorrect: true
        },
        {
          id: 3,
          title: "Let Rain Run Off",
          description: "A poster showing ignoring rainfall",
          emoji: "🌧️➡️",
          isCorrect: false
        }
      ],
      correctFeedback: "Collect Rainwater is an excellent conservation method!",
      explanation: "Rainwater collection provides free water for gardens and reduces demand on municipal supplies!"
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
    navigate("/student/sustainability/kids/journal-green-habits");
  };

  return (
    <GameShell
      title="Poster: Save Water"
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
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-400/30">
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
            You earned {coins} coins! Keep promoting water conservation! 💧
          </p>
        </div>
      )}
    </GameShell>
  );
};

export default PosterSaveWater;

