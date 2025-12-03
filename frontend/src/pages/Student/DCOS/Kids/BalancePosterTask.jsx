import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const BalancePosterTask = () => {
  const location = useLocation();
  const gameId = "dcos-kids-26";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
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

  const stages = [
    {
      id: 1,
      messages: [
        { id: 1, text: "Balance Study, Play & Rest!", emoji: "⚖️", color: "from-green-400 to-blue-400", isCorrect: true },
        { id: 2, text: "Play All Day!", emoji: "🎮", color: "from-purple-400 to-indigo-400", isCorrect: false },
        { id: 3, text: "Study Only!", emoji: "📚", color: "from-orange-400 to-yellow-400", isCorrect: false }
      ],
      correctMessage: 1
    },
    {
      id: 2,
      messages: [
        { id: 1, text: "Play Outside, Stay Bright!", emoji: "🌳", color: "from-lime-400 to-green-400", isCorrect: true },
        { id: 2, text: "Stay Inside Always", emoji: "🏠", color: "from-sky-400 to-teal-400", isCorrect: false },
        { id: 3, text: "Never Go Outside", emoji: "🚫", color: "from-yellow-400 to-orange-400", isCorrect: false }
      ],
      correctMessage: 1
    },
    {
      id: 3,
      messages: [
        { id: 1, text: "Eat Smart, Feel Strong!", emoji: "🍎", color: "from-red-400 to-pink-400", isCorrect: true },
        { id: 2, text: "Eat Junk Food Only", emoji: "🍔", color: "from-green-400 to-yellow-400", isCorrect: false },
        { id: 3, text: "Skip Meals", emoji: "⏭️", color: "from-orange-400 to-amber-400", isCorrect: false }
      ],
      correctMessage: 1
    },
    {
      id: 4,
      messages: [
        { id: 1, text: "Sleep Early, Rise Fresh!", emoji: "🛌", color: "from-indigo-400 to-blue-400", isCorrect: true },
        { id: 2, text: "Stay Up All Night", emoji: "🌙", color: "from-purple-400 to-pink-400", isCorrect: false },
        { id: 3, text: "Never Sleep", emoji: "😴", color: "from-yellow-400 to-orange-400", isCorrect: false }
      ],
      correctMessage: 1
    },
    {
      id: 5,
      messages: [
        { id: 1, text: "Study + Play + Sleep = Success!", emoji: "🏆", color: "from-pink-400 to-red-400", isCorrect: true },
        { id: 2, text: "Only Play Games", emoji: "🎮", color: "from-cyan-400 to-teal-400", isCorrect: false },
        { id: 3, text: "Only Study", emoji: "📖", color: "from-indigo-400 to-purple-400", isCorrect: false }
      ],
      correctMessage: 1
    }
  ];

  const designs = [
    { id: 1, name: "Balance Scale", emoji: "⚖️" },
    { id: 2, name: "Clock Circle", emoji: "⏰" },
    { id: 3, name: "Smiling Sun", emoji: "🌞" }
  ];

  const currentStageData = stages[currentStage];

  const handleCreatePoster = () => {
    if (!selectedMessage || !selectedDesign) return;
    
    resetFeedback();
    const isCorrect = selectedMessage === currentStageData.correctMessage;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentStage < stages.length - 1) {
        setCurrentStage(prev => prev + 1);
        setSelectedMessage(null);
        setSelectedDesign(null);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const selectedMsg = currentStageData.messages.find(m => m.id === selectedMessage);
  const selectedDsgn = designs.find(d => d.id === selectedDesign);

  return (
    <GameShell
      title="Balance Poster Task"
      score={score}
      subtitle={!showResult ? `Poster ${currentStage + 1} of ${stages.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score === stages.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <h3 className="text-white text-lg md:text-xl font-bold mb-4">
              {currentStage + 1}. Choose Poster Message
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {currentStageData.messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg.id)}
                  className={`border-3 rounded-xl p-4 transition-all bg-gradient-to-br ${msg.color} ${
                    selectedMessage === msg.id ? "ring-4 ring-white" : ""
                  }`}
                >
                  <div className="text-3xl md:text-4xl mb-2">{msg.emoji}</div>
                  <div className="text-white font-bold text-xs md:text-sm text-center">{msg.text}</div>
                </button>
              ))}
            </div>

            <h3 className="text-white text-lg md:text-xl font-bold mb-4">Choose Design Style</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {designs.map((design) => (
                <button
                  key={design.id}
                  onClick={() => setSelectedDesign(design.id)}
                  className={`border-2 rounded-xl p-3 transition-all ${
                    selectedDesign === design.id
                      ? "bg-blue-500/50 border-blue-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-3xl mb-1">{design.emoji}</div>
                  <div className="text-white text-xs">{design.name}</div>
                </button>
              ))}
            </div>

            {selectedMessage && selectedDesign && (
              <div className="mb-6">
                <h3 className="text-white text-lg font-bold mb-4">Preview Poster</h3>
                <div
                  className={`rounded-xl p-6 md:p-8 bg-gradient-to-br ${selectedMsg.color} min-h-[150px] md:min-h-[200px] flex flex-col items-center justify-center border-4 border-white`}
                >
                  <div className="text-5xl md:text-6xl mb-4">{selectedDsgn.emoji}</div>
                  <div className="text-white text-xl md:text-2xl font-bold text-center mb-2">
                    {selectedMsg.text}
                  </div>
                  <div className="text-4xl md:text-5xl">{selectedMsg.emoji}</div>
                </div>
              </div>
            )}

            <button
              onClick={handleCreatePoster}
              disabled={!selectedMessage || !selectedDesign}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedMessage && selectedDesign
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              {currentStage < stages.length - 1 ? "Next Poster 🎨" : "Finish Posters 🏁"}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🌟</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === stages.length ? "Perfect Posters! 🎉" : `You created ${score} great posters!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === stages.length 
                ? "Amazing work! You created 5 wonderful balance posters showing study, play, kindness, food, and rest!"
                : "Great job creating balance posters! Keep learning about healthy balance!"}
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BalancePosterTask;
