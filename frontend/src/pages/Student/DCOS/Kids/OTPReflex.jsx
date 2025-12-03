import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const OTPReflex = () => {
  const location = useLocation();
  const gameId = "dcos-kids-45";
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
      emoji: "📩",
      message: 'You get a message: "Your bank OTP is 456789. Please share to confirm." What do you do?',
      options: [
        { id: 1, text: "Share OTP immediately", emoji: "📤", isCorrect: false },
        { id: 2, text: "Never share it", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Ask a friend what to do", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      id: 2,
      emoji: "💬",
      message: "A delivery person asks for your OTP on call. What's the right action?",
      options: [
        { id: 1, text: "Tell the OTP", emoji: "☎️", isCorrect: false },
        { id: 2, text: "Say no and report the call", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Ignore it and hang up", emoji: "😶", isCorrect: false }
      ]
    },
    {
      id: 3,
      emoji: "📱",
      message: "You receive an email offering a gift card. It asks for your OTP. What should you do?",
      options: [
        { id: 1, text: "Enter the OTP", emoji: "🎁", isCorrect: false },
        { id: 2, text: "Ignore and delete the email", emoji: "🗑️", isCorrect: true },
        { id: 3, text: "Reply with your phone number", emoji: "📞", isCorrect: false }
      ]
    },
    {
      id: 4,
      emoji: "💻",
      message: "A pop-up says: 'Login failed! Enter OTP to secure your account.' What do you do?",
      options: [
        { id: 1, text: "Enter OTP on pop-up", emoji: "⚠️", isCorrect: false },
        { id: 2, text: "Close it and check the official site", emoji: "🔒", isCorrect: true },
        { id: 3, text: "Take a screenshot and share", emoji: "📸", isCorrect: false }
      ]
    },
    {
      id: 5,
      emoji: "🔢",
      message: "Someone says they sent you money by mistake and need your OTP to reverse it. You should…",
      options: [
        { id: 1, text: "Give them the OTP", emoji: "😅", isCorrect: false },
        { id: 2, text: "Refuse and block the number", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Ask your friends about it", emoji: "💬", isCorrect: false }
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
      title="OTP Reflex"
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
            <p className="text-white text-lg md:text-xl mb-6 text-center font-semibold">{currentQuestionData.message}</p>

            <div className="space-y-3 mb-6">
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
            <div className="text-7xl mb-4">💡</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === questions.length ? "Perfect Smart Move! 🎉" : `You got ${score} out of ${questions.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === questions.length 
                ? "Excellent! OTPs are secret and meant only for you. Never share them!"
                : "Great job! Keep learning to protect your OTPs and stay safe."}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Great job! OTPs are secret and meant only for you. Never share them — not even with someone pretending to be from the bank or company.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OTPReflex;
