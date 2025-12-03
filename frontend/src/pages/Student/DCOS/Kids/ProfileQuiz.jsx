import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const ProfileQuiz = () => {
  const location = useLocation();
  const gameId = "dcos-kids-52";
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

  const questions = [
    {
      id: 1,
      text: "Should your social media profile be public or private?",
      emoji: "👤",
      options: [
        { id: 1, text: "Public – everyone can see", emoji: "🌐", isCorrect: false },
        { id: 2, text: "Private – only friends can see", emoji: "🔒", isCorrect: true },
        { id: 3, text: "Half public, half private", emoji: "⚖️", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "If you make your profile public, who can view your photos?",
      emoji: "📸",
      options: [
        { id: 1, text: "Only my friends", emoji: "👥", isCorrect: false },
        { id: 2, text: "Anyone on the internet", emoji: "🌐", isCorrect: true },
        { id: 3, text: "No one", emoji: "🚫", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Should you accept friend requests from people you don't know?",
      emoji: "👋",
      options: [
        { id: 1, text: "Yes, more followers!", emoji: "📈", isCorrect: false },
        { id: 2, text: "No, only real friends", emoji: "👥", isCorrect: true },
        { id: 3, text: "Maybe if they look nice", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "What's the safest way to protect your online profile?",
      emoji: "🛡️",
      options: [
        { id: 1, text: "Share password with a friend", emoji: "🔓", isCorrect: false },
        { id: 2, text: "Keep it private and strong password", emoji: "🔒", isCorrect: true },
        { id: 3, text: "Ignore settings", emoji: "🙈", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "If someone asks for your personal info on your profile, what should you do?",
      emoji: "❓",
      options: [
        { id: 1, text: "Give it if they seem nice", emoji: "😊", isCorrect: false },
        { id: 2, text: "Report or block them", emoji: "🚨", isCorrect: true },
        { id: 3, text: "Ask why they need it", emoji: "🤔", isCorrect: false }
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
      title="Profile Quiz"
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
            <p className="text-white text-lg md:text-xl mb-6 font-semibold text-center">
              {currentQuestionData.text}
            </p>

            <div className="space-y-3">
              {currentQuestionData.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  disabled={answered}
                  className={`w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 md:p-5 transition-all transform hover:scale-102 ${
                    answered && option.isCorrect
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !option.isCorrect
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-3xl md:text-4xl">{option.emoji}</div>
                    <div className="text-white font-medium text-base md:text-lg">{option.text}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🔒</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === questions.length ? "Perfect Profile Protector! 🎉" : `You got ${score} out of ${questions.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === questions.length 
                ? "Excellent! You know how to keep your profile safe and private!"
                : "Great job! Keep learning to protect your online profile."}
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always keep your profile private, accept only real friends, and never share personal info publicly!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ProfileQuiz;
