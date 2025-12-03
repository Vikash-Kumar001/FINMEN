import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const WhatsAppDebate = () => {
  const location = useLocation();
  const gameId = "dcos-teen-36";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentDebate, setCurrentDebate] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [argument, setArgument] = useState("");
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

  const debates = [
    {
      id: 1,
      topic: "Should we trust all forwards?",
      emoji: "💭",
      positions: [
        { id: 1, position: "Yes - if it's forwarded, it's true", emoji: "✅", isCorrect: false },
        { id: 2, position: "No - always verify forwards", emoji: "❌", isCorrect: true }
      ]
    },
    {
      id: 2,
      topic: "Is it safe to forward messages from friends?",
      emoji: "👥",
      positions: [
        { id: 1, position: "Yes - friends wouldn't lie", emoji: "✅", isCorrect: false },
        { id: 2, position: "No - verify even from friends", emoji: "❌", isCorrect: true }
      ]
    },
    {
      id: 3,
      topic: "Should we forward messages asking us to share?",
      emoji: "📤",
      positions: [
        { id: 1, position: "Yes - if they ask, we should", emoji: "✅", isCorrect: false },
        { id: 2, position: "No - verify before sharing", emoji: "❌", isCorrect: true }
      ]
    },
    {
      id: 4,
      topic: "Are viral messages always true?",
      emoji: "🔥",
      positions: [
        { id: 1, position: "Yes - viral means verified", emoji: "✅", isCorrect: false },
        { id: 2, position: "No - viral doesn't mean true", emoji: "❌", isCorrect: true }
      ]
    },
    {
      id: 5,
      topic: "Should we forward health advice from messages?",
      emoji: "💊",
      positions: [
        { id: 1, position: "Yes - it might help people", emoji: "✅", isCorrect: false },
        { id: 2, position: "No - verify with doctors first", emoji: "❌", isCorrect: true }
      ]
    }
  ];

  const handleSubmit = () => {
    if (answered) return;
    
    if (!selectedPosition || argument.trim().length < 20) return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentDebateData = debates[currentDebate];
    const selectedPos = currentDebateData.positions.find(p => p.id === selectedPosition);
    const isCorrect = selectedPos?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentDebate < debates.length - 1) {
        setCurrentDebate(prev => prev + 1);
        setSelectedPosition(null);
        setArgument("");
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentDebateData = debates[currentDebate];

  return (
    <GameShell
      title="WhatsApp Debate"
      score={score}
      subtitle={!showResult ? `Debate ${currentDebate + 1} of ${debates.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={debates.length}
      currentLevel={currentDebate + 1}
      maxScore={debates.length}
      showConfetti={showResult && score === debates.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl mb-4 text-center">{currentDebateData.emoji}</div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">Debate Topic</h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-lg md:text-xl font-semibold text-center">{currentDebateData.topic}</p>
            </div>

            <h3 className="text-white font-bold mb-4">1. Choose Your Position</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {currentDebateData.positions.map(pos => (
                <button
                  key={pos.id}
                  onClick={() => !answered && setSelectedPosition(pos.id)}
                  disabled={answered}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    selectedPosition === pos.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : answered && pos.isCorrect
                      ? 'bg-green-500/50 border-green-400'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-3xl mb-2">{pos.emoji}</div>
                  <div className="text-white font-semibold text-xs md:text-sm">{pos.position}</div>
                </button>
              ))}
            </div>

            <h3 className="text-white font-bold mb-2">2. Build Your Argument (min 20 chars)</h3>
            <textarea
              value={argument}
              onChange={(e) => !answered && setArgument(e.target.value)}
              disabled={answered}
              placeholder="Provide evidence and reasoning for your position..."
              className="w-full h-24 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{argument.length}/200</div>

            <button
              onClick={handleSubmit}
              disabled={!selectedPosition || argument.trim().length < 20 || answered}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedPosition && argument.trim().length >= 20 && !answered
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Debate
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">💬</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === debates.length ? "Perfect Critical Thinker! 🎉" : `You got ${score} out of ${debates.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === debates.length 
                ? "Excellent! Never trust all forwards - always verify! Even messages from friends can be false. Viral messages aren't automatically true. Always check official sources before sharing, especially for health advice!"
                : "Great job! Keep learning to verify information!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Never trust all forwards - always verify with official sources!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WhatsAppDebate;
