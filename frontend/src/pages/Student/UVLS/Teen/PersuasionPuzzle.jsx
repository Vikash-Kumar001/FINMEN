import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const PersuasionPuzzle = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-87";
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
  const [selectedSequence, setSelectedSequence] = useState([]);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Topic: Convince parents for later curfew. Arrange the persuasion sequence:",
      tiles: [
        { id: 0, text: "Claim: Need more time with friends", emoji: "💬" },
        { id: 1, text: "Evidence: Good grades", emoji: "📊" },
        { id: 2, text: "CTA: Extend to 10pm", emoji: "⏰" }
      ],
      correctOrder: [0, 1, 2]
    },
    {
      id: 2,
      text: "Topic: Persuade teacher for extension. Arrange the persuasion sequence:",
      tiles: [
        { id: 0, text: "Claim: Need more time", emoji: "⏳" },
        { id: 1, text: "Evidence: Busy schedule", emoji: "📅" },
        { id: 2, text: "CTA: One day extra", emoji: "📝" }
      ],
      correctOrder: [0, 1, 2]
    },
    {
      id: 3,
      text: "Topic: Sell idea to group. Arrange the persuasion sequence:",
      tiles: [
        { id: 0, text: "Claim: This plan is best", emoji: "💡" },
        { id: 1, text: "Evidence: Pros list", emoji: "✅" },
        { id: 2, text: "CTA: Vote yes", emoji: "🗳️" }
      ],
      correctOrder: [0, 1, 2]
    },
    {
      id: 4,
      text: "Topic: Advocate for school event. Arrange the persuasion sequence:",
      tiles: [
        { id: 0, text: "Claim: Fun day needed", emoji: "🎉" },
        { id: 1, text: "Evidence: Student survey", emoji: "📋" },
        { id: 2, text: "CTA: Approve budget", emoji: "💰" }
      ],
      correctOrder: [0, 1, 2]
    },
    {
      id: 5,
      text: "Topic: Negotiate chore reduction. Arrange the persuasion sequence:",
      tiles: [
        { id: 0, text: "Claim: Too many chores", emoji: "🧹" },
        { id: 1, text: "Evidence: Study time impacted", emoji: "📚" },
        { id: 2, text: "CTA: Reduce to 3/week", emoji: "📉" }
      ],
      correctOrder: [0, 1, 2]
    }
  ];

  const handleTileSelect = (tileId) => {
    if (answered) return;
    if (!selectedSequence.includes(tileId)) {
      setSelectedSequence([...selectedSequence, tileId]);
    }
  };

  const handleConfirm = () => {
    if (answered || selectedSequence.length !== 3) return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const isCorrect = selectedSequence.every((val, idx) => val === currentQuestionData.correctOrder[idx]);
    
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
        setSelectedSequence([]);
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
      title="Persuasion Puzzle"
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
              
              <p className="text-white/90 mb-4 text-center">Click tiles in the correct order:</p>
              
              <div className="space-y-3 mb-6">
                {currentQuestionData.tiles.map((tile) => {
                  const isSelected = selectedSequence.includes(tile.id);
                  const position = selectedSequence.indexOf(tile.id);
                  
                  return (
                    <button
                      key={tile.id}
                      onClick={() => handleTileSelect(tile.id)}
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
                        <span className="text-2xl mr-2">{tile.emoji}</span>
                        {tile.text}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              {selectedSequence.length > 0 && (
                <p className="text-white mb-4 text-center">
                  Sequence: {selectedSequence.map(i => currentQuestionData.tiles[i].text).join(" → ")}
                </p>
              )}
              
              <button
                onClick={handleConfirm}
                disabled={selectedSequence.length !== 3 || answered}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedSequence.length === 3 && !answered
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Confirm Sequence
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default PersuasionPuzzle;
