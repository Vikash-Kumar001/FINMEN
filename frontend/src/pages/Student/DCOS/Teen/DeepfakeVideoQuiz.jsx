import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const DeepfakeVideoQuiz = () => {
  const location = useLocation();
  const gameId = "dcos-teen-32";
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
      text: "Watch this video. Is it Real or Deepfake?",
      emoji: "🎥",
      description: "A video shows a celebrity saying something shocking",
      choices: [
        { id: 1, text: "Real - it looks authentic", emoji: "✅", isCorrect: false },
        { id: 2, text: "Deepfake - verify with official sources", emoji: "⚠️", isCorrect: true },
        { id: 3, text: "Not sure - share anyway", emoji: "🤷", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "A video shows a politician making controversial statements. Real or Deepfake?",
      emoji: "📹",
      description: "The video seems suspicious",
      choices: [
        { id: 1, text: "Real - politicians say things", emoji: "😐", isCorrect: false },
        { id: 2, text: "Deepfake - check official sources", emoji: "⚠️", isCorrect: true },
        { id: 3, text: "Share it - it's interesting", emoji: "📤", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "A video shows someone doing something impossible. Real or Deepfake?",
      emoji: "🎬",
      description: "The video looks too good to be true",
      choices: [
        { id: 1, text: "Real - technology is amazing", emoji: "😮", isCorrect: false },
        { id: 2, text: "Deepfake - verify before believing", emoji: "⚠️", isCorrect: true },
        { id: 3, text: "Forward it - it's cool", emoji: "➡️", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "A video shows a news anchor saying something unusual. Real or Deepfake?",
      emoji: "📺",
      description: "The video seems edited or manipulated",
      choices: [
        { id: 1, text: "Real - news is news", emoji: "📰", isCorrect: false },
        { id: 2, text: "Deepfake - check official news sources", emoji: "⚠️", isCorrect: true },
        { id: 3, text: "Share it - it's news", emoji: "📤", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "A video shows someone's face moving strangely. Real or Deepfake?",
      emoji: "👤",
      description: "The face movements look unnatural",
      choices: [
        { id: 1, text: "Real - people move weird sometimes", emoji: "😐", isCorrect: false },
        { id: 2, text: "Deepfake - verify the source", emoji: "⚠️", isCorrect: true },
        { id: 3, text: "Not important - just entertainment", emoji: "😏", isCorrect: false }
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
      title="Deepfake Video Quiz"
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
              <p className="text-white text-base md:text-lg md:text-xl leading-relaxed text-center font-semibold mb-2">
                {currentQuestionData.text}
              </p>
              <p className="text-white/80 text-sm md:text-base text-center">{currentQuestionData.description}</p>
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
            <div className="text-7xl mb-4">⚠️</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === questions.length ? "Perfect Deepfake Detector! 🎉" : `You got ${score} out of ${questions.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === questions.length 
                ? "Excellent! Deepfakes are manipulated videos that look real but are fake. Always verify videos with official sources before believing or sharing. Look for unnatural movements, check the source, and verify with trusted news outlets!"
                : "Great job! Keep learning to detect deepfakes!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Always verify videos with official sources - deepfakes can be very convincing!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DeepfakeVideoQuiz;
