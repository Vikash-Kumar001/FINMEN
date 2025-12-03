import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const HabitChainPuzzle = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-97";
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
      const games = getUvlsTeenGames({});
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
  const [selectedChain, setSelectedChain] = useState([]);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Outcome: Better health. Arrange habits in the correct order:",
      habits: [
        { id: 0, text: "Wake early", emoji: "🌅" },
        { id: 1, text: "Exercise", emoji: "💪" },
        { id: 2, text: "Healthy breakfast", emoji: "🍎" },
        { id: 3, text: "Hydrate", emoji: "💧" },
        { id: 4, text: "Sleep early", emoji: "😴" }
      ],
      correctOrder: [0, 1, 2, 3, 4]
    },
    {
      id: 2,
      text: "Outcome: Good grades. Arrange habits in the correct order:",
      habits: [
        { id: 0, text: "Study daily", emoji: "📚" },
        { id: 1, text: "Review notes", emoji: "📝" },
        { id: 2, text: "Practice tests", emoji: "✏️" },
        { id: 3, text: "Ask questions", emoji: "❓" },
        { id: 4, text: "Rest well", emoji: "😴" }
      ],
      correctOrder: [0, 1, 2, 3, 4]
    },
    {
      id: 3,
      text: "Outcome: Save money. Arrange habits in the correct order:",
      habits: [
        { id: 0, text: "Track spending", emoji: "📊" },
        { id: 1, text: "Budget", emoji: "💰" },
        { id: 2, text: "Avoid impulse", emoji: "🚫" },
        { id: 3, text: "Save first", emoji: "💵" },
        { id: 4, text: "Invest", emoji: "📈" }
      ],
      correctOrder: [0, 1, 2, 3, 4]
    },
    {
      id: 4,
      text: "Outcome: Learn instrument. Arrange habits in the correct order:",
      habits: [
        { id: 0, text: "Practice daily", emoji: "🎵" },
        { id: 1, text: "Take lessons", emoji: "🎼" },
        { id: 2, text: "Listen to music", emoji: "🎧" },
        { id: 3, text: "Perform", emoji: "🎤" },
        { id: 4, text: "Record progress", emoji: "📹" }
      ],
      correctOrder: [0, 1, 2, 3, 4]
    },
    {
      id: 5,
      text: "Outcome: Read more. Arrange habits in the correct order:",
      habits: [
        { id: 0, text: "Set time", emoji: "⏰" },
        { id: 1, text: "Choose books", emoji: "📖" },
        { id: 2, text: "Join club", emoji: "👥" },
        { id: 3, text: "Discuss", emoji: "💬" },
        { id: 4, text: "Track books", emoji: "📚" }
      ],
      correctOrder: [0, 1, 2, 3, 4]
    }
  ];

  const handleHabitSelect = (habitId) => {
    if (answered) return;
    if (!selectedChain.includes(habitId)) {
      setSelectedChain([...selectedChain, habitId]);
    }
  };

  const handleConfirm = () => {
    if (answered || selectedChain.length !== 5) return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const isCorrect = selectedChain.every((val, idx) => val === currentQuestionData.correctOrder[idx]);
    
    setResponses([...responses, {
      questionId: currentQuestionData.id,
      isCorrect
    }]);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedChain([]);
        setAnswered(false);
        resetFeedback();
      } else {
        setShowResult(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Habit Chain Puzzle"
      subtitle={showResult ? "Puzzle Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="uvls"
      showGameOver={showResult}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={showResult && finalScore >= 3}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <p className="text-white/90 mb-4 text-center">Click habits in the correct order:</p>
              
              <div className="space-y-3 mb-6">
                {currentQuestionData.habits.map((habit) => {
                  const isSelected = selectedChain.includes(habit.id);
                  const position = selectedChain.indexOf(habit.id);
                  
                  return (
                    <button
                      key={habit.id}
                      onClick={() => handleHabitSelect(habit.id)}
                      disabled={answered || isSelected}
                      className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                        isSelected
                          ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                          : answered
                          ? 'bg-gray-500/30 border-gray-400 opacity-50 cursor-not-allowed'
                          : 'bg-white/20 border-white/40 hover:bg-white/30'
                      }`}
                    >
                      <span className="text-white font-medium">
                        {isSelected && `#${position + 1} - `}
                        <span className="text-2xl mr-2">{habit.emoji}</span>
                        {habit.text}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              {selectedChain.length > 0 && (
                <p className="text-white mb-4 text-center">
                  Chain: {selectedChain.map(i => currentQuestionData.habits[i].text).join(" → ")}
                </p>
              )}
              
              <button
                onClick={handleConfirm}
                disabled={selectedChain.length !== 5 || answered}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedChain.length === 5 && !answered
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Confirm Chain
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default HabitChainPuzzle;
