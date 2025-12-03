import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosKidsGames } from "../../../../pages/Games/GameCategories/DCOS/kidGamesData";

const PersonalInfoPuzzle = () => {
  const location = useLocation();
  
  const gameId = "dcos-kids-4";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
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
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Your Full Name",
      emoji: "👤",
      correctCategory: "Private Info"
    },
    {
      id: 2,
      text: "Home Address",
      emoji: "🏠",
      correctCategory: "Private Info"
    },
    {
      id: 3,
      text: "Password",
      emoji: "🔒",
      correctCategory: "Private Info"
    },
    {
      id: 4,
      text: "Favorite Color",
      emoji: "🎨",
      correctCategory: "Okay to Share"
    },
    {
      id: 5,
      text: "Phone Number",
      emoji: "📱",
      correctCategory: "Private Info"
    }
  ];

  const categories = ["Private Info", "Okay to Share"];

  const handleAnswer = (category) => {
    if (answered || levelCompleted) return;
    
    setAnswered(true);
    setSelectedCategory(category);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const isCorrect = category === currentQuestionData.correctCategory;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedCategory(null);
        setAnswered(false);
        resetFeedback();
      } else {
        setLevelCompleted(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Personal Info Puzzle"
      subtitle={levelCompleted ? "Puzzle Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="dcos"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={levelCompleted && finalScore >= 3}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl p-6 mb-6">
                <div className="text-6xl mb-3 text-center">{currentQuestionData.emoji}</div>
                <p className="text-white text-2xl font-bold text-center">{currentQuestionData.text}</p>
              </div>
              
              <p className="text-white/90 mb-4 text-center text-lg font-semibold">Is this private or okay to share?</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => {
                  const isSelected = selectedCategory === category;
                  const showCorrect = answered && category === currentQuestionData.correctCategory;
                  const showIncorrect = answered && isSelected && category !== currentQuestionData.correctCategory;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => handleAnswer(category)}
                      disabled={answered}
                      className={`border-2 rounded-xl p-6 transition-all transform ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-purple-500/50 border-purple-400 ring-2 ring-white scale-105"
                          : "bg-white/20 border-white/40 hover:bg-white/30 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-white font-bold text-lg">{category}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default PersonalInfoPuzzle;
