import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const DebateStageOnlineFriends = () => {
  const location = useLocation();
  const gameId = "dcos-teen-9";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentDebate, setCurrentDebate] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(null);
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
      topic: "Is it safe to meet online friends in real life?",
      emoji: "👥",
      positions: [
        { id: 1, position: "Yes - it's safe if you're careful", emoji: "✅", isCorrect: false },
        { id: 2, position: "No - it's dangerous and should be avoided", emoji: "🛡️", isCorrect: true }
      ]
    },
    {
      id: 2,
      topic: "Should you share personal information with online friends?",
      emoji: "🔒",
      positions: [
        { id: 1, position: "Yes - if you trust them", emoji: "🤝", isCorrect: false },
        { id: 2, position: "No - never share personal info", emoji: "🛡️", isCorrect: true }
      ]
    },
    {
      id: 3,
      topic: "Is it okay to video call with online friends?",
      emoji: "📹",
      positions: [
        { id: 1, position: "Yes - video calls are safe", emoji: "✅", isCorrect: false },
        { id: 2, position: "Only with verified identity", emoji: "🛡️", isCorrect: true }
      ]
    },
    {
      id: 4,
      topic: "Should you accept friend requests from strangers?",
      emoji: "👤",
      positions: [
        { id: 1, position: "Yes - if they seem nice", emoji: "😊", isCorrect: false },
        { id: 2, position: "No - only accept known people", emoji: "🛡️", isCorrect: true }
      ]
    },
    {
      id: 5,
      topic: "Can online friendships be as real as offline ones?",
      emoji: "💬",
      positions: [
        { id: 1, position: "Yes - online friends are real friends", emoji: "❤️", isCorrect: false },
        { id: 2, position: "Be cautious - verify identity first", emoji: "🛡️", isCorrect: true }
      ]
    }
  ];

  const handleConfirm = () => {
    if (!selectedPosition || answered) return;
    
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
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentDebateData = debates[currentDebate];

  return (
    <GameShell
      title="Debate Stage"
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
            <div className="text-6xl md:text-8xl mb-4 text-center">{currentDebateData.emoji}</div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">Debate Topic</h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-lg md:text-xl font-semibold text-center">{currentDebateData.topic}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">Choose Your Position</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {currentDebateData.positions.map(pos => (
                <button
                  key={pos.id}
                  onClick={() => !answered && setSelectedPosition(pos.id)}
                  disabled={answered}
                  className={`border-2 rounded-xl p-4 md:p-5 transition-all ${
                    answered && pos.isCorrect
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && selectedPosition === pos.id && !pos.isCorrect
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : selectedPosition === pos.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-3xl md:text-4xl mb-2">{pos.emoji}</div>
                  <div className="text-white font-semibold text-sm md:text-base">{pos.position}</div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedPosition || answered}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedPosition && !answered
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Position
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === debates.length ? "Perfect Excellent Debate! 🎉" : `You got ${score} out of ${debates.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === debates.length 
                ? "Perfect position! Meeting online 'friends' in person is dangerous. People can lie about their identity, age, and intentions. Even with precautions, you can't verify who someone really is until meeting them - and by then it might be too late. Stick to video calls or don't meet at all!"
                : "Great job! Keep learning to stay safe online!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Always prioritize your safety when interacting with people online!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateStageOnlineFriends;
