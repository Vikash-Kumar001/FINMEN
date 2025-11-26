import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ShoppingBag, Apple, Gamepad2, Book, Home } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BudgetItemsPuzzle = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-24";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0); // Use ref to track score for immediate access
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const levels = [
    {
      id: 1,
      title: "Food",
      question: "Is Food a Need or Want?",
      icon: Apple,
      item: "Food",
      correctAnswer: "Need",
      options: [
        { text: "Need - Must have to live", correct: true, coins: 10 },
        { text: "Want - Nice to have", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Right! Food is essential to survive!",
        wrong: "Food is a basic need for life!"
      }
    },
    {
      id: 2,
      title: "Toys",
      question: "Are Toys a Need or Want?",
      icon: ShoppingBag,
      item: "Toys",
      correctAnswer: "Want",
      options: [
        { text: "Need - Must have to live", correct: false, coins: 0 },
        { text: "Want - Nice to have", correct: true, coins: 15 }
      ],
      feedback: {
        correct: "Correct! Toys are fun but not essential!",
        wrong: "Toys are wants, not needs!"
      }
    },
    {
      id: 3,
      title: "Books",
      question: "Are School Books a Need or Want?",
      icon: Book,
      item: "Books",
      correctAnswer: "Need",
      options: [
        { text: "Need - Required for education", correct: true, coins: 20 },
        { text: "Want - Optional fun", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! Books are needed for learning!",
        wrong: "School books are essential needs!"
      }
    },
    {
      id: 4,
      title: "Games",
      question: "Are Video Games a Need or Want?",
      icon: Gamepad2,
      item: "Games",
      correctAnswer: "Want",
      options: [
        { text: "Need - Can't live without", correct: false, coins: 0 },
        { text: "Want - Entertainment choice", correct: true, coins: 25 }
      ],
      feedback: {
        correct: "Great! Games are wants, not needs!",
        wrong: "Games are fun wants, not needs!"
      }
    },
    {
      id: 5,
      title: "Shelter",
      question: "Is a Home/Shelter a Need or Want?",
      icon: Home,
      item: "Shelter",
      correctAnswer: "Need",
      options: [
        { text: "Need - Basic protection", correct: true, coins: 30 },
        { text: "Want - Luxury item", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Shelter is a basic human need!",
        wrong: "Home is essential for safety and survival!"
      }
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData.icon;

  const handleAnswer = (option) => {
    if (answered) return; // Prevent multiple clicks
    
    setSelectedAnswer(option);
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = option.correct;
    const isLastQuestion = currentLevel === levels.length;
    
    if (isCorrect) {
      // Update both state and ref
      setScore((prev) => {
        const newScore = prev + 1;
        scoreRef.current = newScore;
        return newScore;
      });
      showCorrectAnswerFeedback(1, true);
    }
    
    // Show feedback for 2 seconds, then move to next question or show results
    setTimeout(() => {
      if (isLastQuestion) {
        // This is the last question (5th), show results
        // The score should already be updated at this point
        setShowResult(true);
      } else {
        // Move to next question
        setCurrentLevel((prev) => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  // Final score - should be correct after state updates
  const finalScore = score;

  // Keep ref in sync with state
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Ensure score is properly set when game ends
  useEffect(() => {
    if (showResult) {
      console.log('🎮 Budget Items Puzzle completed:', {
        gameId,
        finalScore,
        score,
        scoreRef: scoreRef.current,
        totalLevels: levels.length,
        currentLevel
      });
    }
  }, [showResult, finalScore, score, gameId, currentLevel]);

  return (
    <GameShell
      title="Budget Items Puzzle"
      subtitle={!showResult ? `Question ${currentLevel} of ${levels.length}: ${currentLevelData?.question || ''}` : "Game Complete!"}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      gameId={gameId}
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center">
          <Icon className="w-20 h-20 text-orange-400" />
        </div>

        {/* Item Label */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p className="text-orange-300 font-semibold text-lg">
            {currentLevelData.item}
          </p>
        </div>

        {!answered && !showResult && currentLevelData && (
          <div className="space-y-3">
            {currentLevelData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={answered}
                className={`w-full ${
                  option.correct 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
                } px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {option.text}
              </button>
            ))}
          </div>
        )}

        {answered && !showResult && selectedAnswer && currentLevelData && (
          <div className={`p-6 rounded-xl border-2 ${
            selectedAnswer.correct 
              ? 'bg-green-500/20 border-green-400' 
              : 'bg-red-500/20 border-red-400'
          }`}>
            <p className="text-white/90 text-lg">
              {selectedAnswer.correct 
                ? currentLevelData.feedback.correct 
                : currentLevelData.feedback.wrong}
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BudgetItemsPuzzle;