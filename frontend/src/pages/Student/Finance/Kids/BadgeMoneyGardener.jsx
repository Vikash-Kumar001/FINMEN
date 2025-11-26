import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sprout, TreePine, Flower2, Leaf, Award } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeMoneyGardener = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-70";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const questions = [
    {
      id: 1,
      text: "You got 100 rupees for your birthday. What will you do?",
      icon: Sprout,
      options: [
        { text: "Save 80, spend 20 - Plant seeds for growth", correct: true },
        { text: "Spend all on candy today", correct: false },
        { text: "Give all away immediately", correct: false }
      ]
    },
    {
      id: 2,
      text: "Your friend bought a new toy, but you're saving. What do you do?",
      icon: Leaf,
      options: [
        { text: "Stay patient, keep saving for bigger goals", correct: true },
        { text: "Break your piggy bank for instant fun", correct: false },
        { text: "Feel sad and give up saving", correct: false }
      ]
    },
    {
      id: 3,
      text: "You want a 500 rupee toy but have only 300 saved. What's the smart choice?",
      icon: TreePine,
      options: [
        { text: "Save 200 more before buying - Let it grow!", correct: true },
        { text: "Borrow from parents and buy now", correct: false },
        { text: "Buy a cheaper toy you don't want", correct: false }
      ]
    },
    {
      id: 4,
      text: "Your piggy bank is full! Grandma offers to add 10% to your savings if you wait one month. What do you choose?",
      icon: Flower2,
      options: [
        { text: "Wait one month - Money can make money!", correct: true },
        { text: "Take money out immediately", correct: false },
        { text: "Spend half now, save half", correct: false }
      ]
    },
    {
      id: 5,
      text: "After months of saving, you have 1000 rupees! What's the wisest choice?",
      icon: Award,
      options: [
        { text: "Keep 800 saved, spend 200 on something special", correct: true },
        { text: "Spend everything at once", correct: false },
        { text: "Never spend, just keep saving forever", correct: false }
      ]
    }
  ];

  const currentQuestionData = questions[currentQuestion];
  const Icon = currentQuestionData?.icon || Sprout;

  const handleAnswer = (option) => {
    const newChoices = [...choices, { 
      questionId: currentQuestionData.id, 
      choice: option,
      isCorrect: option.correct
    }];
    
    setChoices(newChoices);
    
    if (option.correct) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, option.correct ? 1000 : 800);
    } else {
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, option.correct ? 1000 : 800);
    }
  };

  const handleNext = () => {
    navigate("/games/financial-literacy/kids");
  };

  return (
    <GameShell
      title="Badge: Money Gardener"
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={currentQuestion + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      gameId="finance-kids-70"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-center mb-4">
                <Icon className="w-16 h-16 text-green-400" />
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="space-y-4">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 px-6 py-3 rounded-full text-white font-bold hover:scale-105 transition-transform text-sm"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default BadgeMoneyGardener;
