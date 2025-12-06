import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertTriangle, Heart, UserCheck, CheckCircle, Badge } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const NutritionProBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-20";
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
      title: "Muscle Builder",
      question: "Which nutrient builds muscle?",
      icon: UserCheck,
      options: [
        { text: "Sugar", correct: false },
        { text: "Protein", correct: true },
        { text: "Fat", correct: false }
      ],
      feedback: {
        correct: "Correct! Protein builds and repairs muscle.",
        wrong: "Protein is the key for muscle growth."
      }
    },
    {
      id: 2,
      title: "Energy Source",
      question: "Best source of long-lasting energy?",
      icon: Shield,
      options: [
        { text: "Soda", correct: false },
        { text: "Complex Carbs", correct: true },
        { text: "Candy", correct: false }
      ],
      feedback: {
        correct: "Yes! Oats and rice give steady energy.",
        wrong: "Sugar gives a crash. Complex carbs last longer."
      }
    },
    {
      id: 3,
      title: "Hydration Hero",
      question: "What should you drink most?",
      icon: Heart,
      options: [
        { text: "Water", correct: true },
        { text: "Juice", correct: false },
        { text: "Energy Drinks", correct: false }
      ],
      feedback: {
        correct: "Exactly! Water is essential for life.",
        wrong: "Water is the best choice for hydration."
      }
    },
    {
      id: 4,
      title: "Bone Strength",
      question: "What makes bones strong?",
      icon: CheckCircle,
      options: [
        { text: "Calcium", correct: true },
        { text: "Iron", correct: false },
        { text: "Salt", correct: false }
      ],
      feedback: {
        correct: "Right! Calcium builds strong bones.",
        wrong: "Calcium (from milk, greens) is for bones."
      }
    },
    {
      id: 5,
      title: "Junk Food",
      question: "How often should you eat junk food?",
      icon: Badge,
      options: [
        { text: "Every day", correct: false },
        { text: "In moderation", correct: true },
        { text: "Never", correct: false }
      ],
      feedback: {
        correct: "Smart! Balance is key.",
        wrong: "Moderation allows treats without harming health."
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
    navigate("/student/health-male/teens/puberty-story-teen");
  };

  return (
    <GameShell
      title="Nutrition Pro Badge"
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
              <div className="text-8xl mb-4">🥗</div>
              <h3 className="text-3xl font-bold text-white mb-2">Nutrition Pro Badge Earned!</h3>
              <p className="text-white/90 mb-4 text-lg">
                Congratulations! You know how to fuel your body right!
              </p>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-4 inline-block mb-4">
                <div className="text-white font-bold text-xl">NUTRITION EXPERT</div>
              </div>
              <p className="text-white/80">
                Eat healthy, live strong! 🌟
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default NutritionProBadge;
