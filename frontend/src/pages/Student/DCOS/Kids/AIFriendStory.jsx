import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const AIFriendStory = () => {
  const location = useLocation();
  const gameId = "dcos-kids-75";
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
      title: "AI Chat Request",
      emoji: "🤖",
      situation: "An AI chatbot says, 'Hi! I'm your new friend! What's your name and address?'",
      options: [
        { id: 1, text: "Share your address", emoji: "🏠", isCorrect: false },
        { id: 2, text: "Refuse and stay safe", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Ask for its address too", emoji: "📍", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Photo Request",
      emoji: "📸",
      situation: "The AI friend says, 'Send me a selfie so we can be real friends!'",
      options: [
        { id: 1, text: "Send a photo", emoji: "📷", isCorrect: false },
        { id: 2, text: "Say 'No, I don't share photos online'", emoji: "🙅‍♀️", isCorrect: true },
        { id: 3, text: "Ignore the message", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Private Chat",
      emoji: "💬",
      situation: "The AI chatbot asks, 'Can we chat secretly? Don't tell your parents.'",
      options: [
        { id: 1, text: "Keep it secret", emoji: "🤫", isCorrect: false },
        { id: 2, text: "Tell a parent or teacher", emoji: "👩‍🏫", isCorrect: true },
        { id: 3, text: "Say nothing", emoji: "😶", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Game Link",
      emoji: "🎮",
      situation: "The AI friend sends you a link to a 'fun new game' and says, 'Click fast!'",
      options: [
        { id: 1, text: "Click it quickly", emoji: "⚡", isCorrect: false },
        { id: 2, text: "Ask an adult before clicking", emoji: "🧑‍🏫", isCorrect: true },
        { id: 3, text: "Trust the AI friend", emoji: "🤝", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Personal Info",
      emoji: "🔑",
      situation: "The chatbot says, 'Tell me your school name and class. I won't tell anyone!'",
      options: [
        { id: 1, text: "Give all info", emoji: "📚", isCorrect: false },
        { id: 2, text: "Refuse and end chat", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Share school name only", emoji: "🏫", isCorrect: false }
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
      title="AI Friend Story"
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
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">{currentScenarioData.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-4 md:p-5 mb-6">
              <p className="text-white text-base md:text-lg leading-relaxed">{currentScenarioData.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentScenarioData.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 md:p-5 transition-all text-left ${
                    answered && option.isCorrect
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !option.isCorrect
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-3xl md:text-4xl">{option.emoji}</div>
                    <div className="text-white font-semibold text-base md:text-lg">{option.text}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🤖</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Smart Move! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! You made the safe choice. Always keep your personal info private, even if it's an AI friend asking!"
                : "Great job! Keep learning to stay safe with AI chatbots."}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Great! You made the safe choice. Always keep your personal info private, even if it's an AI friend asking.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIFriendStory;
