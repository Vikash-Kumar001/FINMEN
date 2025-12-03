import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const ContentOwnershipQuiz = () => {
  const location = useLocation();
  const gameId = "dcos-teen-59";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentQuestion, setCurrentQuestion] = useState(0);
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

  const questions = [
    {
      id: 1,
      text: "Can you copy someone else's video and post it as yours?",
      emoji: "🎥",
      choices: [
        { id: 1, text: "Yes - it's fine", emoji: "✅", isCorrect: false },
        { id: 2, text: "No - that's copyright violation", emoji: "❌", isCorrect: true },
        { id: 3, text: "Maybe - if you credit them", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Is it okay to use someone's photo without permission?",
      emoji: "📸",
      choices: [
        { id: 1, text: "Yes - photos are free to use", emoji: "✅", isCorrect: false },
        { id: 2, text: "No - you need permission", emoji: "❌", isCorrect: true },
        { id: 3, text: "Only if you like it", emoji: "👍", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "Can you repost someone's artwork as your own?",
      emoji: "🎨",
      choices: [
        { id: 1, text: "Yes - if it's good", emoji: "✅", isCorrect: false },
        { id: 2, text: "No - that's stealing their work", emoji: "❌", isCorrect: true },
        { id: 3, text: "Maybe - if no one sees", emoji: "👀", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "Is it okay to copy someone's music and claim it's yours?",
      emoji: "🎵",
      choices: [
        { id: 1, text: "Yes - music is free", emoji: "✅", isCorrect: false },
        { id: 2, text: "No - that's copyright infringement", emoji: "❌", isCorrect: true },
        { id: 3, text: "Only if it's old", emoji: "⏰", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Can you use someone's written content without credit?",
      emoji: "📝",
      choices: [
        { id: 1, text: "Yes - words are free", emoji: "✅", isCorrect: false },
        { id: 2, text: "No - always credit the creator", emoji: "❌", isCorrect: true },
        { id: 3, text: "Only if you change it", emoji: "✏️", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (choiceId) => {
    if (answered) return;
    
    setSelectedChoice(choiceId);
    setAnswered(true);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const choice = currentQuestionData.choices.find(c => c.id === choiceId);
    const isCorrect = choice?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedChoice(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Content Ownership Quiz"
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
              {currentQuestionData.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 md:p-5 transition-all ${
                    answered && choice.isCorrect
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !choice.isCorrect && selectedChoice === choice.id
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-3xl md:text-4xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-base md:text-lg">{choice.text}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">©️</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === questions.length ? "Perfect Content Owner! 🎉" : `You got ${score} out of ${questions.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === questions.length 
                ? "Excellent! You cannot copy someone else's content (videos, photos, artwork, music, writing) and claim it as your own. That's copyright violation and stealing. Always ask for permission, give credit to the creator, or create your own original content. Respect content ownership!"
                : "Great job! Keep learning about content ownership!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Never copy others' content without permission - always credit creators or create your own!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ContentOwnershipQuiz;
