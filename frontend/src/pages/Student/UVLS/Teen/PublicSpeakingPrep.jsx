import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const PublicSpeakingPrep = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-89";
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
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Draft a 60-second opening for a speech about a topic you care about.",
      ideal: "Include a hook, main point, and preview",
      minLength: 100
    },
    {
      id: 2,
      text: "Write the main body paragraph (2-3 sentences) with supporting evidence.",
      ideal: "Use facts, examples, or personal stories",
      minLength: 80
    },
    {
      id: 3,
      text: "Write a compelling closing statement that calls for action.",
      ideal: "Summarize key points and inspire action",
      minLength: 60
    },
    {
      id: 4,
      text: "Write a transition sentence connecting your opening to your main point.",
      ideal: "Smoothly connect ideas",
      minLength: 40
    },
    {
      id: 5,
      text: "Write a memorable conclusion that reinforces your message.",
      ideal: "Leave a lasting impression",
      minLength: 50
    }
  ];

  const handleSubmit = () => {
    if (answered || answer.trim() === "") return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const hasStructure = answer.trim().length >= currentQuestionData.minLength;
    
    if (hasStructure) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setAnswer("");
        setAnswered(false);
        resetFeedback();
      } else {
        setLevelCompleted(true);
      }
    }, hasStructure ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Public Speaking Prep"
      subtitle={levelCompleted ? "Prep Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="uvls"
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
              
              <p className="text-white text-lg md:text-xl mb-4 text-center">
                {currentQuestionData.text}
              </p>
              
              <p className="text-white/70 text-sm mb-4 text-center">
                Tip: {currentQuestionData.ideal}
              </p>
              
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full h-40 p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white placeholder-white/50"
                placeholder="Write your response here..."
                disabled={answered}
              />
              
              <div className="mt-2 text-white/50 text-sm text-center">
                {answer.trim().length}/{currentQuestionData.minLength} characters minimum
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={answer.trim() === "" || answered}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  answer.trim() !== "" && !answered
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default PublicSpeakingPrep;
