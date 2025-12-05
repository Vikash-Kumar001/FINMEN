import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertTriangle, Heart, UserCheck, CheckCircle } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SafetySmartKidBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-80";
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
      title: "Helmet Hero",
      question: "Why do we wear helmets?",
      icon: Shield,
      options: [
        { text: "To protect our brain", correct: true },
        { text: "To look like an alien", correct: false },
        { text: "To keep hair dry", correct: false }
      ],
      feedback: {
        correct: "Exactly! Helmets protect your most important body part - your brain!",
        wrong: "Helmets are safety gear designed to protect your head and brain from injury."
      }
    },
    {
      id: 2,
      title: "Stranger Safety",
      question: "What if a stranger offers you a ride?",
      icon: AlertTriangle,
      options: [
        { text: "Get in the car", correct: false },
        { text: "Say NO and run away", correct: true },
        { text: "Ask for candy first", correct: false }
      ],
      feedback: {
        correct: "Perfect! Never go with strangers. Run to a safe place and tell an adult.",
        wrong: "Never get in a car with a stranger. It's very dangerous!"
      }
    },
    {
      id: 3,
      title: "Healthy Body",
      question: "What keeps your body strong?",
      icon: Heart,
      options: [
        { text: "Watching TV all day", correct: false },
        { text: "Eating only cookies", correct: false },
        { text: "Healthy food and exercise", correct: true }
      ],
      feedback: {
        correct: "Great! Good food and moving your body keeps you strong and healthy!",
        wrong: "Your body needs nutritious food and exercise to grow strong."
      }
    },
    {
      id: 4,
      title: "Clean Hands",
      question: "When should you wash your hands?",
      icon: UserCheck,
      options: [
        { text: "Before eating", correct: true },
        { text: "Only once a week", correct: false },
        { text: "Never", correct: false }
      ],
      feedback: {
        correct: "Yes! Washing hands before eating stops germs from getting in your body.",
        wrong: "You should wash hands often, especially before eating and after using the bathroom."
      }
    },
    {
      id: 5,
      title: "Safety First",
      question: "What is the most important rule?",
      icon: CheckCircle,
      options: [
        { text: "Have fun no matter what", correct: false },
        { text: "Safety comes first", correct: true },
        { text: "Win every game", correct: false }
      ],
      feedback: {
        correct: "You got it! Having fun is great, but staying safe is always the most important thing!",
        wrong: "Safety is always number one. You can't have fun if you get hurt!"
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
      title="Safety Smart Kid Badge"
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
              <h3 className="text-3xl font-bold text-white mb-2">Safety Smart Kid Badge Earned!</h3>
              <p className="text-white/90 mb-4 text-lg">
                Congratulations! You know how to stay safe and healthy!
              </p>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-4 inline-block mb-4">
                <div className="text-white font-bold text-xl">SAFETY SMART KID</div>
              </div>
              <p className="text-white/80">
                You're a safety expert! Keep making smart choices! 🌟
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SafetySmartKidBadge;
