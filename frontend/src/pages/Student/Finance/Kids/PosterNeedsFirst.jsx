import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterNeedsFirst = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-36";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const stages = [
    {
      question: 'Choose a poster: "Put Needs Before Wants."',
      choices: [
        { text: "Buy Wants First 🧸", correct: false },
        { text: "Spend Everything 🛍️", correct: false },
        { text: "No Planning Needed 🎲", correct: false },
        { text: "Put Needs Before Wants 📚", correct: true },
      ],
    },
    {
      question: 'Choose a poster: "Needs First, Save Smart."',
      choices: [
        { text: "Needs First, Save Smart 💰", correct: true },
        { text: "Wants Are Better 🎉", correct: false },
        { text: "No Need to Save 🏺", correct: false },
        { text: "Spend All Today 🛒", correct: false }
      ],
    },
    {
      question: 'Choose a poster: "Choose Needs, Win Big."',
      choices: [
        { text: "Spend on Toys 🧸", correct: false },
        { text: "Give Money Away 🎁", correct: false },
        { text: "Choose Needs, Win Big 🥗", correct: true },
        { text: "Buy Everything 🎪", correct: false }
      ],
    },
    {
      question: 'Choose a poster: "Needs Keep You Strong."',
      choices: [
        { text: "Needs Keep You Strong 💪", correct: true },
        { text: "Wants Make You Happy 😊", correct: false },
        { text: "Spend Without Plan 🛒", correct: false },
        { text: "More Toys = Better 🎮", correct: false }
      ],
    },
    {
      question: 'Why do needs-first posters help kids?',
      choices: [
        { text: "Encourage more toys 🧸", correct: false },
        { text: "Teach smart spending 📚", correct: true },
        { text: "Make spending fun 🎉", correct: false },
        { text: "Help buy expensive items 💎", correct: false }
      ],
    },
  ];

  const handleSelect = (isCorrect) => {
    if (answered) return; // Prevent multiple clicks
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentStage === stages.length - 1;
    
    // Move to next question or show results after a short delay
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentStage((prev) => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const finalScore = score;

  return (
    <GameShell
      title="Poster: Needs First"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Choose posters that prioritize needs!` : "Game Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-6">
        {!showResult && stages[currentStage] && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              {stages[currentStage].question}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(choice.correct)}
                  className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-blue-500 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={answered || showResult}
                >
                  <div className="text-lg font-semibold">{choice.text}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 text-lg font-semibold text-white/80">
              Score: {score}/{stages.length}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterNeedsFirst;