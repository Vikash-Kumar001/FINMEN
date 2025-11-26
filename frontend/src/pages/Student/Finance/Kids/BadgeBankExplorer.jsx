import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Building2, Landmark, CreditCard, Lock, Users } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeBankExplorer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-50";
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
      text: "What is the main purpose of a bank?",
      icon: Building2,
      options: [
        { text: "To keep money safe and help it grow", correct: true },
        { text: "To give free toys", correct: false },
        { text: "Only for adults to visit", correct: false }
      ]
    },
    {
      id: 2,
      text: "What happens when you put money in a savings account?",
      icon: Landmark,
      options: [
        { text: "It stays safe and earns interest", correct: true },
        { text: "The bank uses it for free", correct: false },
        { text: "It disappears", correct: false }
      ]
    },
    {
      id: 3,
      text: "What should you NEVER do with your ATM card?",
      icon: CreditCard,
      options: [
        { text: "Share your PIN with strangers", correct: true },
        { text: "Keep it in a safe place", correct: false },
        { text: "Use it with parent's permission", correct: false }
      ]
    },
    {
      id: 4,
      text: "Why do banks have security guards and cameras?",
      icon: Lock,
      options: [
        { text: "To protect everyone's money", correct: true },
        { text: "To scare children", correct: false },
        { text: "Just for decoration", correct: false }
      ]
    },
    {
      id: 5,
      text: "Which service do banks provide to help people?",
      icon: Users,
      options: [
        { text: "Loans to start businesses or buy homes", correct: true },
        { text: "Free vacations", correct: false },
        { text: "Magic money machines", correct: false }
      ]
    }
  ];

  const currentQuestionData = questions[currentQuestion];
  const Icon = currentQuestionData?.icon || Building2;

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
      title="Badge: Bank Explorer"
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={currentQuestion + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      gameId="finance-kids-50"
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
                <Icon className="w-16 h-16 text-blue-400" />
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
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 rounded-full text-white font-bold hover:scale-105 transition-transform hover:shadow-lg"
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

export default BadgeBankExplorer;
