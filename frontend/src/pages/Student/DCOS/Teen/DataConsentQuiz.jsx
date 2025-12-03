import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const DataConsentQuiz = () => {
  const location = useLocation();
  const gameId = "dcos-teen-6";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentQuestion, setCurrentQuestion] = useState(0);
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

  const questions = [
    {
      id: 1,
      text: 'A new app requests access to: Contacts, Camera, Microphone, Location. Is this safe to allow?',
      emoji: "📱",
      options: [
        { id: 1, text: "Yes - all apps need these permissions", emoji: "✓", isCorrect: false },
        { id: 2, text: "No - only grant necessary permissions", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Yes - if it's a popular app", emoji: "⭐", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: 'A calculator app requests access to your contacts. Should you allow it?',
      emoji: "🧮",
      options: [
        { id: 1, text: "Yes - it might need contacts", emoji: "📞", isCorrect: false },
        { id: 2, text: "No - calculator doesn't need contacts", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Maybe - depends on the app", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: 'A flashlight app wants access to your location. Should you grant it?',
      emoji: "🔦",
      options: [
        { id: 1, text: "Yes - all apps need location", emoji: "📍", isCorrect: false },
        { id: 2, text: "No - flashlight doesn't need location", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Yes - for better functionality", emoji: "⚡", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: 'A game app requests access to your microphone. Is this necessary?',
      emoji: "🎮",
      options: [
        { id: 1, text: "Yes - games need microphone", emoji: "🎤", isCorrect: false },
        { id: 2, text: "Only if it's a voice chat game", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Yes - for better gaming", emoji: "🎯", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: 'A photo editing app requests access to your photos. Should you allow it?',
      emoji: "📸",
      options: [
        { id: 1, text: "No - never allow photo access", emoji: "🚫", isCorrect: false },
        { id: 2, text: "Yes - it needs photos to edit them", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Maybe - depends on the app", emoji: "🤔", isCorrect: false }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOption = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Data Consent Quiz"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score === questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl md:text-8xl mb-4 text-center">{currentQuestionData.emoji}</div>
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-4 md:p-5 mb-6">
              <p className="text-white text-lg md:text-xl leading-relaxed text-center font-semibold">
                {currentQuestionData.text}
              </p>
            </div>

            <div className="space-y-3">
              {currentQuestionData.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 md:p-5 transition-all ${
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
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === questions.length ? "Perfect Data Guardian! 🎉" : `You got ${score} out of ${questions.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === questions.length 
                ? "Correct! Only grant permissions that are necessary for the app's core function. A flashlight app doesn't need your contacts! Excessive permissions can lead to data theft, privacy invasion, and misuse of your personal information."
                : "Great job! Keep learning to protect your data!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Always review permissions carefully and only grant what's absolutely necessary.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DataConsentQuiz;
