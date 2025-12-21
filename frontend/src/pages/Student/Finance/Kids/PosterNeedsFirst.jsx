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
      question: "Which expense should come first when budgeting?",
      choices: [
        { text: "New video game 🎮", correct: false },
        { text: "Movie tickets 🎥", correct: false },
        { text: "School supplies 📚", correct: true },
        { text: "Ice cream treat 🍦", correct: false }
      ],
    },
    {
      question: "What is the main purpose of prioritizing needs over wants?",
      choices: [
        { text: "To never have fun", correct: false },
        { text: "To ensure basic necessities are covered", correct: true },
        { text: "To spend all your money", correct: false },
        { text: "To avoid saving money", correct: false }
      ],
    },
    {
      question: "Which of these is an example of a 'need'?",
      choices: [
        { text: "Designer clothes 👗", correct: false },
        { text: "Smartphone upgrade 📱", correct: false },
        { text: "Healthy meals 🥗", correct: true },
        { text: "Concert tickets 🎵", correct: false }
      ],
    },
    {
      question: "What should you do if you want both needs and wants but have limited money?",
      choices: [
        { text: "Buy only wants", correct: false },
        { text: "Buy needs first, then save for wants", correct: true },
        { text: "Borrow money for everything", correct: false },
        { text: "Forget about both", correct: false }
      ],
    },
    {
      question: "Why is it important to distinguish between needs and wants?",
      choices: [
        { text: "To make informed financial decisions", correct: true },
        { text: "To feel restricted", correct: false },
        { text: "To spend impulsively", correct: false },
        { text: "To avoid all purchases", correct: false }
      ],
    }
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
      title="Understanding Needs vs Wants"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Choose the financially smart option!` : "Game Complete!"}
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