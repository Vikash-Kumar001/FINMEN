import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Coins, Sparkles, Star, Award, DollarSign } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeYoungEarner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-80";
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
      text: "What's a good way to earn pocket money at home?",
      icon: Sparkles,
      options: [
        { text: "Do chores like cleaning room", correct: true },
        { text: "Demand money for nothing", correct: false },
        { text: "Take from parents' wallet", correct: false }
      ]
    },
    {
      id: 2,
      text: "You have toys you don't use. What's smart?",
      icon: Star,
      options: [
        { text: "Sell them to earn money", correct: true },
        { text: "Throw them in trash", correct: false },
        { text: "Hoard them forever", correct: false }
      ]
    },
    {
      id: 3,
      text: "You're good at drawing. How can you earn?",
      icon: Award,
      options: [
        { text: "Teach friends for small fee", correct: true },
        { text: "Keep skills to myself", correct: false },
        { text: "Copy others' work", correct: false }
      ]
    },
    {
      id: 4,
      text: "School fair is coming. What's a good earning idea?",
      icon: Coins,
      options: [
        { text: "Make crafts and sell them", correct: true },
        { text: "Do nothing and watch", correct: false },
        { text: "Steal others' ideas", correct: false }
      ]
    },
    {
      id: 5,
      text: "Parents offer money for good grades. What do you do?",
      icon: DollarSign,
      options: [
        { text: "Study hard and earn fairly", correct: true },
        { text: "Cheat on tests", correct: false },
        { text: "Make excuses for bad grades", correct: false }
      ]
    }
  ];

  const currentQuestionData = questions[currentQuestion];
  const Icon = currentQuestionData?.icon || Sparkles;

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
      title="Badge: Young Earner"
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={currentQuestion + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      gameId="finance-kids-80"
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
                <Icon className="w-16 h-16 text-yellow-400" />
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
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-3 rounded-full text-white font-bold hover:scale-105 transition-transform text-sm"
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

export default BadgeYoungEarner;
