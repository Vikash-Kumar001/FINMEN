import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const SharingRightsSimulation = () => {
  const location = useLocation();
  const gameId = "dcos-teen-54";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
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
      text: "Should you share your homework online?",
      emoji: "📝",
      options: [
        { id: 1, text: "Share it online", emoji: "📤", isCorrect: false },
        { id: 2, text: "Keep it private", emoji: "🔒", isCorrect: true },
        { id: 3, text: "Share with friends only", emoji: "👥", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "What should you do with personal documents?",
      emoji: "📄",
      options: [
        { id: 1, text: "Post them publicly", emoji: "🌐", isCorrect: false },
        { id: 2, text: "Keep them private", emoji: "🔒", isCorrect: true },
        { id: 3, text: "Share on social media", emoji: "📱", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Should you share your test answers online?",
      emoji: "✏️",
      options: [
        { id: 1, text: "Yes, share them", emoji: "✅", isCorrect: false },
        { id: 2, text: "No, keep them private", emoji: "🔒", isCorrect: true },
        { id: 3, text: "Share with classmates", emoji: "👥", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "What about your personal photos?",
      emoji: "📸",
      options: [
        { id: 1, text: "Share everything publicly", emoji: "🌐", isCorrect: false },
        { id: 2, text: "Be selective and keep private ones safe", emoji: "🔒", isCorrect: true },
        { id: 3, text: "Post all photos", emoji: "📤", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Should you share your private thoughts online?",
      emoji: "💭",
      options: [
        { id: 1, text: "Share everything", emoji: "📤", isCorrect: false },
        { id: 2, text: "Keep private thoughts private", emoji: "🔒", isCorrect: true },
        { id: 3, text: "Share with everyone", emoji: "🌐", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    setSelectedOption(optionId);
    setAnswered(true);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Sharing Rights Simulation"
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
            <div className="text-6xl md:text-8xl mb-6 text-center">{currentQuestionData.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 md:p-5 mb-6">
              <p className="text-white text-base md:text-lg md:text-xl leading-relaxed text-center font-semibold">
                {currentQuestionData.text}
              </p>
            </div>

            <div className="space-y-3">
              {currentQuestionData.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 md:p-5 transition-all ${
                    answered && option.isCorrect
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !option.isCorrect && selectedOption === option.id
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : selectedOption === option.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4 justify-center">
                    <div className="text-3xl md:text-4xl">{option.emoji}</div>
                    <div className="text-white font-semibold text-base md:text-lg">{option.text}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🔒</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === questions.length ? "Perfect Privacy Protector! 🎉" : `You got ${score} out of ${questions.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === questions.length 
                ? "Excellent! You have the right to keep your homework, personal documents, test answers, private photos, and personal thoughts private. Not everything needs to be shared online. Be selective about what you share and protect your privacy!"
                : "Great job! Keep learning about your sharing rights!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 You have the right to keep personal information private - not everything needs to be shared!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SharingRightsSimulation;
