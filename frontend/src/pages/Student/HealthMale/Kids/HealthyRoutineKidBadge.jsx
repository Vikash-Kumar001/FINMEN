import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertTriangle, Heart, UserCheck, CheckCircle } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HealthyRoutineKidBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-100";
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
      title: "Morning Star",
      question: "What starts your day right?",
      icon: CheckCircle,
      options: [
        { text: "Sleeping in", correct: false },
        { text: "Healthy Breakfast", correct: true },
        { text: "TV time", correct: false }
      ],
      feedback: {
        correct: "Yes! Breakfast gives you energy for the whole day.",
        wrong: "A healthy breakfast is the best way to start."
      }
    },
    {
      id: 2,
      title: "Clean Machine",
      question: "How do you keep germs away?",
      icon: Shield,
      options: [
        { text: "Wash Hands Often", correct: true },
        { text: "Wipe on clothes", correct: false },
        { text: "Ignore them", correct: false }
      ],
      feedback: {
        correct: "Perfect! Washing hands stops germs from spreading.",
        wrong: "Washing hands with soap and water is the only way."
      }
    },
    {
      id: 3,
      title: "Active Kid",
      question: "What keeps your heart strong?",
      icon: Heart,
      options: [
        { text: "Sitting still", correct: false },
        { text: "Playing Video Games", correct: false },
        { text: "Exercise & Play", correct: true }
      ],
      feedback: {
        correct: "Great! Moving your body makes your heart happy!",
        wrong: "Exercise and active play are key to a strong heart."
      }
    },
    {
      id: 4,
      title: "Brain Power",
      question: "What helps your brain grow?",
      icon: UserCheck,
      options: [
        { text: "Reading & Learning", correct: true },
        { text: "Eating candy", correct: false },
        { text: "Watching TV", correct: false }
      ],
      feedback: {
        correct: "Exactly! Reading and learning new things exercises your brain.",
        wrong: "Your brain needs books and learning to grow strong."
      }
    },
    {
      id: 5,
      title: "Sleep Tight",
      question: "Why do you need sleep?",
      icon: CheckCircle,
      options: [
        { text: "To dream", correct: false },
        { text: "To rest & grow", correct: true },
        { text: "To be bored", correct: false }
      ],
      feedback: {
        correct: "You got it! Sleep helps your body repair and grow.",
        wrong: "Sleep is when your body does its most important growing work."
      }
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData?.icon;

  const handleAnswer = (option) => {
    if (answered) return;

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

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Healthy Routine Kid Badge"
      subtitle={!showResult ? `Challenge ${currentLevel} of 5` : "Badge Earned!"}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={levels.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="text-center text-white space-y-6">
        {!showResult && currentLevelData && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="flex justify-center mb-4">
              <Icon className="w-16 h-16 text-blue-400" />
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Challenge {currentLevel} of 5</span>
              <span className="text-yellow-400 font-bold">Coins: {score}</span>
            </div>

            <h3 className="text-2xl font-bold mb-2">{currentLevelData.title}</h3>
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

        {showResult && (
          <div className="text-center space-y-4 mt-8">
            <div className="text-green-400">
              <div className="text-8xl mb-4">🏆</div>
              <h3 className="text-3xl font-bold text-white mb-2">Healthy Routine Kid Badge Earned!</h3>
              <p className="text-white/90 mb-4 text-lg">
                Congratulations! You are a master of healthy habits!
              </p>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-4 inline-block mb-4">
                <div className="text-white font-bold text-xl">ROUTINE MASTER</div>
              </div>
              <p className="text-white/80">
                Keep up the great work every single day! 🌟
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HealthyRoutineKidBadge;
