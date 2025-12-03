import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const ChatTrickStory = () => {
  const location = useLocation();
  const gameId = "dcos-kids-48";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentScenario, setCurrentScenario] = useState(0);
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

  const scenarios = [
    {
      id: 1,
      title: "The Gift Message",
      emoji: "🎁",
      situation: "A stranger online says, \"I will send you a gift if you tell me your address.\"",
      options: [
        { id: 1, text: "Refuse and block the stranger", emoji: "🚫", isCorrect: true },
        { id: 2, text: "Give them your address", emoji: "🏠", isCorrect: false },
        { id: 3, text: "Ask your friend what to do", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "The Photo Request",
      emoji: "📸",
      situation: "Someone online asks you to send your photo because they say you'll win a contest.",
      options: [
        { id: 1, text: "Send the photo quickly", emoji: "📤", isCorrect: false },
        { id: 2, text: "Say no and report them", emoji: "🚨", isCorrect: true },
        { id: 3, text: "Ignore them but stay online", emoji: "💤", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "The Secret Game",
      emoji: "🎮",
      situation: "A person in chat says, \"Let's play a secret game. Don't tell your parents.\"",
      options: [
        { id: 1, text: "Play quietly", emoji: "🤫", isCorrect: false },
        { id: 2, text: "Ask them what the game is", emoji: "❓", isCorrect: false },
        { id: 3, text: "Leave and tell a trusted adult", emoji: "👨‍👩‍👧", isCorrect: true }
      ]
    },
    {
      id: 4,
      title: "The Friendship Offer",
      emoji: "💬",
      situation: "A stranger says, \"Let's be best friends. Tell me your phone number!\"",
      options: [
        { id: 1, text: "Share your number", emoji: "📱", isCorrect: false },
        { id: 2, text: "Say no and block them", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Say maybe later", emoji: "🤷‍♀️", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "The Free Offer",
      emoji: "🧧",
      situation: "You see a message: \"Click this link to get free diamonds in your game!\"",
      options: [
        { id: 1, text: "Click quickly before it disappears", emoji: "🖱️", isCorrect: false },
        { id: 2, text: "Send it to your friends", emoji: "📤", isCorrect: false },
        { id: 3, text: "Don't click — it could be fake", emoji: "⚠️", isCorrect: true }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentScenarioData = scenarios[currentScenario];
    const selectedOption = currentScenarioData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentScenarioData = scenarios[currentScenario];

  return (
    <GameShell
      title="Chat Trick Story"
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
          <div className="bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-indigo-900/30 backdrop-blur-md rounded-3xl p-6 md:p-8 border-2 border-white/20 shadow-2xl w-full max-w-3xl">
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="text-7xl md:text-9xl mb-4 animate-bounce">{currentScenarioData.emoji}</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {currentScenarioData.title}
              </h2>
              <div className="flex justify-center items-center gap-2 text-white/60 text-sm">
                <span>Scenario {currentScenario + 1} of {scenarios.length}</span>
                <span>•</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{scenarios.length}</span>
              </div>
            </div>

            {/* Situation Card */}
            <div className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-2xl p-5 md:p-6 mb-6 border-2 border-red-400/30 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="text-3xl">⚠️</div>
                <div>
                  <p className="text-white/90 text-base md:text-lg leading-relaxed font-medium">
                    {currentScenarioData.situation}
                  </p>
                </div>
              </div>
            </div>

            {/* Question Prompt */}
            <h3 className="text-white font-bold text-lg md:text-xl mb-5 text-center">
              What should you do? 🤔
            </h3>

            {/* Options Grid */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {currentScenarioData.options.map((option, index) => {
                const showCorrect = answered && option.isCorrect;
                const showIncorrect = answered && !option.isCorrect;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    disabled={answered}
                    className={`w-full border-3 rounded-2xl p-5 md:p-6 transition-all transform text-left relative overflow-hidden ${
                      showCorrect
                        ? 'bg-gradient-to-r from-green-500/60 to-emerald-500/60 border-green-400 ring-4 ring-green-300/50 scale-105 shadow-lg'
                        : showIncorrect
                        ? 'bg-gradient-to-r from-red-500/30 to-rose-500/30 border-red-400 opacity-70 scale-95'
                        : 'bg-gradient-to-r from-white/20 to-white/10 border-white/40 hover:from-white/30 hover:to-white/20 hover:scale-105 hover:shadow-xl'
                    } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {/* Option Number Badge */}
                    <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      showCorrect ? 'bg-green-400 text-white' : 
                      showIncorrect ? 'bg-red-400 text-white' : 
                      'bg-white/30 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-4xl md:text-5xl">{option.emoji}</div>
                      <div className="flex-1">
                        <div className="text-white font-semibold text-base md:text-lg leading-tight">
                          {option.text}
                        </div>
                      </div>
                      {showCorrect && (
                        <div className="text-3xl animate-pulse">✅</div>
                      )}
                      {showIncorrect && (
                        <div className="text-3xl">❌</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Progress Indicator */}
            <div className="w-full bg-white/10 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-900/30 via-emerald-900/30 to-teal-900/30 backdrop-blur-md rounded-3xl p-6 md:p-8 border-2 border-white/20 shadow-2xl w-full max-w-3xl text-center">
            <div className="text-8xl md:text-9xl mb-6 animate-bounce">🛡️</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-green-300 bg-clip-text text-transparent">
              {score === scenarios.length ? "Perfect Smart Move! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-6 leading-relaxed">
              {score === scenarios.length 
                ? "Excellent! Never share personal details, photos, or click strange links. Always refuse and tell a trusted adult!"
                : "Great job! Keep learning to stay safe from online chat tricks."}
            </p>
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-5 md:p-6 mb-4 border-2 border-green-400/30">
              <p className="text-white text-center text-base md:text-lg font-medium">
                💡 Always tell a trusted adult if someone online asks for private info. Stay safe online! 🛡️
              </p>
            </div>
            {score === scenarios.length && (
              <div className="mt-4 text-6xl animate-pulse">🌟</div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ChatTrickStory;
