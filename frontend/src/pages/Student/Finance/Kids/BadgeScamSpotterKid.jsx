import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, AlertTriangle, Eye, Phone, Mail } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeScamSpotterKid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-90";
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
      text: "A stranger says 'Win FREE iPhone! Just give me your parent's phone number!' What do you do?",
      icon: Phone,
      options: [
        { text: "Say NO and tell parents immediately", correct: true },
        { text: "Give phone number for free gift", correct: false },
        { text: "Ask friends to give their numbers", correct: false }
      ]
    },
    {
      id: 2,
      text: "A website looks like your favorite game but asks for parent's credit card. What's wrong?",
      icon: Eye,
      options: [
        { text: "It's a SCAM! Real games don't ask for this", correct: true },
        { text: "It's okay because I know the game", correct: false },
        { text: "Enter card details to unlock levels", correct: false }
      ]
    },
    {
      id: 3,
      text: "You get a message: 'Your friend is in trouble! Send money now!' What should you do?",
      icon: AlertTriangle,
      options: [
        { text: "Call friend directly and tell parents", correct: true },
        { text: "Send money immediately to help", correct: false },
        { text: "Forward message to other friends", correct: false }
      ]
    },
    {
      id: 4,
      text: "Email says 'You won 1 Lakh rupees! Click link and enter OTP.' What do you do?",
      icon: Mail,
      options: [
        { text: "Delete immediately and tell parents", correct: true },
        { text: "Click link to see if it's real", correct: false },
        { text: "Enter OTP to claim prize", correct: false }
      ]
    },
    {
      id: 5,
      text: "Online stranger offers 'Easy money - just share your school details!' What's your response?",
      icon: Shield,
      options: [
        { text: "Block them and report to parents/teacher", correct: true },
        { text: "Share details for easy money", correct: false },
        { text: "Ask what kind of work first", correct: false }
      ]
    }
  ];

  const currentQuestionData = questions[currentQuestion];
  const Icon = currentQuestionData?.icon || Shield;

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
      title="Badge: Scam Spotter Kid"
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={currentQuestion + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      gameId="finance-kids-90"
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
                <Icon className="w-16 h-16 text-red-400" />
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
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 px-5 py-2.5 rounded-full text-white font-bold hover:scale-105 transition-transform hover:shadow-lg text-xs"
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

export default BadgeScamSpotterKid;
