import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const GameCoinScamQuiz = () => {
  const location = useLocation();
  const gameId = "dcos-kids-43";
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
      text: "An app says 'Buy unlimited coins for ₹100.' Should you trust it?",
      emoji: "💰",
      options: [
        { id: 1, text: "Yes, it's a great deal!", emoji: "😄", isCorrect: false },
        { id: 2, text: "No, it might be a scam.", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Only if it looks cool.", emoji: "😎", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "A pop-up says 'You won 10,000 game coins! Click to claim.' What should you do?",
      emoji: "🎁",
      options: [
        { id: 1, text: "Click it fast!", emoji: "⚡", isCorrect: false },
        { id: 2, text: "Ignore or close it.", emoji: "❌", isCorrect: true },
        { id: 3, text: "Share with friends first.", emoji: "👥", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "A website asks for your game password to get free coins. What do you do?",
      emoji: "🔑",
      options: [
        { id: 1, text: "Give it, to get coins.", emoji: "💸", isCorrect: false },
        { id: 2, text: "Never share your password.", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Ask a stranger online.", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "A real game store always uses secure payment methods. What should you look for?",
      emoji: "💳",
      options: [
        { id: 1, text: "🔒 Lock symbol & HTTPS", emoji: "🔒", isCorrect: true },
        { id: 2, text: "Random links or pop-ups", emoji: "⚠️", isCorrect: false },
        { id: 3, text: "Free download buttons", emoji: "⬇️", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "If you think a coin offer is fake, what should you do?",
      emoji: "🕵️‍♀️",
      options: [
        { id: 1, text: "Report it to an adult or teacher.", emoji: "📢", isCorrect: true },
        { id: 2, text: "Try it once anyway.", emoji: "😬", isCorrect: false },
        { id: 3, text: "Ignore and forget.", emoji: "🤷‍♂️", isCorrect: false }
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
      title="Game Coin Scam Quiz"
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
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-lg md:text-xl leading-relaxed text-center font-semibold">
                {currentQuestionData.text}
              </p>
            </div>

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
            <div className="text-7xl mb-4">🏅</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === questions.length ? "Perfect Scam Shield Hero! 🎉" : `You got ${score} out of ${questions.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === questions.length 
                ? "Excellent! You learned how to spot fake offers and protect your game account!"
                : "Great job! Keep learning to spot fake coin offers and stay safe online."}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Never pay money for fake offers. Scammers try to steal your money or info.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GameCoinScamQuiz;
