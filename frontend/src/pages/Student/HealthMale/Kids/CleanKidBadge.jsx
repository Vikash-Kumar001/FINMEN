import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Award, Star, Shield, Heart, Smile } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CleanKidBadge = () => {
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-10";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti, resetFeedback } = useGameFeedback();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const levels = [
    {
      id: 1,
      title: "Hand Washing",
      question: "When is the most important time to wash hands?",
      icon: Shield,
      options: [
        { text: "Before eating and after bathroom", correct: true },
        { text: "Only when they look dirty", correct: false },
        { text: "Once a week", correct: false }
      ],
      feedback: {
        correct: "Excellent! Washing hands before eating and after the bathroom stops germs!",
        wrong: "You should wash hands before eating and after using the bathroom, even if they look clean!"
      }
    },
    {
      id: 2,
      title: "Daily Bath",
      question: "Why do we take a bath every day?",
      icon: Award,
      options: [
        { text: "To play with water", correct: false },
        { text: "To remove dirt and sweat", correct: true },
        { text: "Because mom says so", correct: false }
      ],
      feedback: {
        correct: "Perfect! Baths remove dirt, sweat, and germs to keep you healthy!",
        wrong: "While playing is fun, the main reason is to clean dirt and sweat off your body!"
      }
    },
    {
      id: 3,
      title: "Brushing Teeth",
      question: "How long should you brush your teeth?",
      icon: Star,
      options: [
        { text: "10 seconds", correct: false },
        { text: "2 minutes", correct: true },
        { text: "1 hour", correct: false }
      ],
      feedback: {
        correct: "Amazing! 2 minutes is the perfect time to get all teeth clean!",
        wrong: "You need to brush for about 2 minutes to make sure every tooth is clean!"
      }
    },
    {
      id: 4,
      title: "Clean Clothes",
      question: "What should you do with dirty clothes?",
      icon: Heart,
      options: [
        { text: "Put them in the laundry", correct: true },
        { text: "Wear them again", correct: false },
        { text: "Hide them", correct: false }
      ],
      feedback: {
        correct: "Great! Dirty clothes go in the laundry to be washed!",
        wrong: "Dirty clothes should be washed, not worn again or hidden!"
      }
    },
    {
      id: 5,
      title: "Confidence",
      question: "How does being clean make you feel?",
      icon: Smile,
      options: [
        { text: "Tired", correct: false },
        { text: "Sad", correct: false },
        { text: "Fresh and Confident", correct: true }
      ],
      feedback: {
        correct: "Wonderful! Good hygiene makes you feel fresh, happy, and confident!",
        wrong: "Being clean usually makes you feel fresh and confident, not tired or sad!"
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
    const isLastQuestion = currentLevel === 5;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentLevel(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const finalScore = score;

  return (
    <GameShell
      title="Badge: Clean Kid"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Earn your badge!` : "Badge Earned!"}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="health-male"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-6">
        {!showResult && currentLevelData && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="flex justify-center mb-4">
              <Icon className="w-16 h-16 text-green-400" />
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentLevel} of 5</span>
              <span className="text-yellow-400 font-bold">Score: {score}/5</span>
            </div>

            <p className="text-white text-lg mb-6 text-center">
              {currentLevelData.question}
            </p>

            <div className="grid sm:grid-cols-3 gap-3">
              {currentLevelData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className="w-full min-h-[60px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-8 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {option.text}
                </button>
              ))}
            </div>

            {answered && selectedAnswer && (
              <div className={`mt-4 p-4 rounded-xl ${selectedAnswer.correct
                  ? 'bg-green-500/20 border-2 border-green-400'
                  : 'bg-red-500/20 border-2 border-red-400'
                }`}>
                <p className="text-white font-semibold">
                  {selectedAnswer.correct
                    ? currentLevelData.feedback.correct
                    : currentLevelData.feedback.wrong}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CleanKidBadge;
