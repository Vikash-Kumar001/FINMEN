import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const LoanTrapStory = () => {
  const location = useLocation();
  const gameId = "dcos-teen-45";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
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

  const scenarios = [
    {
      id: 1,
      title: "Quick Loan App",
      emoji: "💰",
      situation: "A 'quick loan app' asks for your personal information, bank details, and photos. Is it safe?",
      options: [
        { id: 1, text: "Yes - provide all information", emoji: "✅", isCorrect: false },
        { id: 2, text: "No - it's unsafe, don't share personal info", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Check reviews first", emoji: "🔍", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Instant Loan Offer",
      emoji: "⚡",
      situation: "An app promises 'instant loan' but asks for your Aadhaar number and bank password. What should you do?",
      options: [
        { id: 1, text: "Share the information", emoji: "📤", isCorrect: false },
        { id: 2, text: "It's a scam - never share passwords", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Ask friends first", emoji: "👥", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Easy Money Loan",
      emoji: "💵",
      situation: "A loan app asks for photos of your ID, bank statements, and selfie. Is this safe?",
      options: [
        { id: 1, text: "Yes - it's normal", emoji: "✅", isCorrect: false },
        { id: 2, text: "No - be cautious, verify the app first", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Share some info only", emoji: "😐", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Loan Without Documents",
      emoji: "📄",
      situation: "A loan app says 'No documents needed, just share bank details.' What's your response?",
      options: [
        { id: 1, text: "Share bank details", emoji: "🏦", isCorrect: false },
        { id: 2, text: "It's a scam - legitimate loans need documents", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Check the app rating first", emoji: "⭐", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Suspicious Loan Terms",
      emoji: "⚠️",
      situation: "A loan app asks for access to your contacts and messages. Is this safe?",
      options: [
        { id: 1, text: "Yes - grant access", emoji: "✅", isCorrect: false },
        { id: 2, text: "No - it's unsafe, legitimate apps don't need this", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Grant limited access", emoji: "🔒", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    setSelectedChoice(optionId);
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
        setSelectedChoice(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentScenarioData = scenarios[currentScenario];

  return (
    <GameShell
      title="Loan Trap Story"
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
            <div className="bg-red-500/20 border-2 border-red-400 rounded-lg p-4 md:p-5 mb-6">
              <p className="text-white text-base md:text-lg leading-relaxed">{currentScenarioData.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3">
              {currentScenarioData.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 md:p-5 transition-all text-left ${
                    answered && option.isCorrect
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !option.isCorrect && selectedChoice === option.id
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : selectedChoice === option.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
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
            <div className="text-7xl mb-4">🚫</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Loan Safety Expert! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Excellent! Be very careful with loan apps. Legitimate loans require proper documents and verification. Never share bank passwords, grant unnecessary permissions, or use apps that ask for too much personal information. Always verify loan apps through official channels!"
                : "Great job! Keep learning to avoid loan scams!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Never share bank passwords or grant unnecessary permissions to loan apps!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default LoanTrapStory;
