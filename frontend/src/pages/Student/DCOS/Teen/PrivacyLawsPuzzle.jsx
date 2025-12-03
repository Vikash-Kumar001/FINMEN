import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const PrivacyLawsPuzzle = () => {
  const location = useLocation();
  const gameId = "dcos-teen-55";
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
      text: "Match: GDPR = ?",
      emoji: "🌍",
      options: [
        { id: 1, text: "Europe", emoji: "🇪🇺", isCorrect: true },
        { id: 2, text: "India", emoji: "🇮🇳", isCorrect: false },
        { id: 3, text: "Kids", emoji: "👶", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Match: IT Act = ?",
      emoji: "📜",
      options: [
        { id: 1, text: "Europe", emoji: "🇪🇺", isCorrect: false },
        { id: 2, text: "India", emoji: "🇮🇳", isCorrect: true },
        { id: 3, text: "Kids", emoji: "👶", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Match: COPPA = ?",
      emoji: "🛡️",
      options: [
        { id: 1, text: "Europe", emoji: "🇪🇺", isCorrect: false },
        { id: 2, text: "India", emoji: "🇮🇳", isCorrect: false },
        { id: 3, text: "Kids", emoji: "👶", isCorrect: true }
      ]
    },
    {
      id: 4,
      text: "Which law protects data in Europe?",
      emoji: "🇪🇺",
      options: [
        { id: 1, text: "GDPR", emoji: "📋", isCorrect: true },
        { id: 2, text: "IT Act", emoji: "📜", isCorrect: false },
        { id: 3, text: "COPPA", emoji: "🛡️", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Which law protects children's privacy?",
      emoji: "👶",
      options: [
        { id: 1, text: "GDPR", emoji: "📋", isCorrect: false },
        { id: 2, text: "IT Act", emoji: "📜", isCorrect: false },
        { id: 3, text: "COPPA", emoji: "🛡️", isCorrect: true }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    setSelectedOption(optionId);
    setAnswered(true);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
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
      title="Privacy Laws Puzzle"
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
            <div className="text-7xl mb-4">📜</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === questions.length ? "Perfect Privacy Law Expert! 🎉" : `You got ${score} out of ${questions.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === questions.length 
                ? "Excellent! GDPR (General Data Protection Regulation) protects data in Europe. IT Act protects data in India. COPPA (Children's Online Privacy Protection Act) protects children's privacy. These laws help protect your personal information online!"
                : "Great job! Keep learning about privacy laws!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 GDPR (Europe), IT Act (India), and COPPA (Kids) protect your privacy!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PrivacyLawsPuzzle;
