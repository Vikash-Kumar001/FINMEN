import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Apple, Carrot, GlassWater, Utensils, Users } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HealthyKidBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-20";
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
      title: "Fruit Power",
      question: "Why are fruits better than candy?",
      icon: Apple,
      item: "Fruit Power",
      options: [
        { text: "They have natural vitamins", correct: true, coins: 1 },
        { text: "They are wrapped in plastic", correct: false, coins: 0 },
        { text: "They have more sugar", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Awesome! Fruits give you natural energy and vitamins!",
        wrong: "Fruits are better because they have natural vitamins that keep you healthy!"
      }
    },
    {
      id: 2,
      title: "Veggie Victory",
      question: "What do vegetables do for your body?",
      icon: Carrot,
      item: "Veggie Victory",
      options: [
        { text: "Make you tired", correct: false, coins: 0 },
        { text: "Nothing at all", correct: false, coins: 0 },
        { text: "Help you grow strong", correct: true, coins: 1 },
      ],
      feedback: {
        correct: "Correct! Vegetables are full of nutrients that help you grow strong!",
        wrong: "Vegetables are superfoods that help your body grow strong and healthy!"
      }
    },
    {
      id: 3,
      title: "Hydration Hero",
      question: "Why is water the best drink?",
      icon: GlassWater,
      item: "Hydration Hero",
      options: [
        { text: "It keeps you hydrated", correct: true, coins: 1 },
        { text: "It has lots of sugar", correct: false, coins: 0 },
        { text: "It makes you sleepy", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Spot on! Water keeps your body working perfectly without extra sugar!",
        wrong: "Water is the best because it keeps you hydrated and healthy!"
      }
    },
    {
      id: 4,
      title: "Meal Master",
      question: "What makes a lunch healthy?",
      icon: Utensils,
      item: "Meal Master",
      options: [
        { text: "Only eating dessert", correct: false, coins: 0 },
        { text: "A mix of healthy foods", correct: true, coins: 1 },
        { text: "Eating as fast as possible", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Great job! A balanced meal with different healthy foods is best!",
        wrong: "A healthy lunch includes a mix of different nutritious foods!"
      }
    },
    {
      id: 5,
      title: "Sharing Star",
      question: "Why share healthy snacks?",
      icon: Users,
      item: "Sharing Star",
      options: [
        { text: "To get rid of them", correct: false, coins: 0 },
        { text: "To eat junk food instead", correct: false, coins: 0 },
        { text: "To help friends be healthy", correct: true, coins: 1 }
      ],
      feedback: {
        correct: "Wonderful! Sharing healthy habits helps everyone stay strong!",
        wrong: "Sharing healthy snacks helps your friends make good choices too!"
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

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Badge: Healthy Kid"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Earn your badge!` : "Badge Earned!"}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId={gameId}
      gameType="health-male"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score === 5}
      onNext={handleNext}
    >
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

export default HealthyKidBadge;
