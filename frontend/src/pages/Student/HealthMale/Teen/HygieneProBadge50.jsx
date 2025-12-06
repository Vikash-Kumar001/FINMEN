import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, Heart, UserCheck, CheckCircle, Badge } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneProBadge50 = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-50";

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
      title: "Sweat",
      question: "What controls sweat odor?",
      icon: UserCheck,
      options: [
        { text: "Perfume", correct: false },
        { text: "Deodorant", correct: true },
        { text: "Water", correct: false }
      ],
      feedback: {
        correct: "Correct! Deodorant or Antiperspirant.",
        wrong: "Perfume only masks the smell."
      }
    },
    {
      id: 2,
      title: "Teeth",
      question: "Brush teeth for how long?",
      icon: Shield,
      options: [
        { text: "10 seconds", correct: false },
        { text: "2 minutes", correct: true },
        { text: "1 hour", correct: false }
      ],
      feedback: {
        correct: "Yes! 2 minutes, twice a day.",
        wrong: "You need 2 minutes to clean properly."
      }
    },
    {
      id: 3,
      title: "Hands",
      question: "When to wash hands?",
      icon: AlertTriangle,
      options: [
        { text: "Before Eating", correct: true },
        { text: "Never", correct: false },
        { text: "Once a week", correct: false }
      ],
      feedback: {
        correct: "Exactly! And after using the bathroom.",
        wrong: "Always wash before eating."
      }
    },
    {
      id: 4,
      title: "Clothes",
      question: "Change underwear...",
      icon: Heart,
      options: [
        { text: "Daily", correct: true },
        { text: "Weekly", correct: false },
        { text: "Monthly", correct: false }
      ],
      feedback: {
        correct: "Right! Fresh underwear every day.",
        wrong: "Hygiene requires daily changes."
      }
    },
    {
      id: 5,
      title: "Confidence",
      question: "Good hygiene boosts...",
      icon: Badge,
      options: [
        { text: "Ego", correct: false },
        { text: "Confidence", correct: true },
        { text: "Height", correct: false }
      ],
      feedback: {
        correct: "Smart! You feel better when clean.",
        wrong: "It makes you feel confident."
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
    navigate("/student/health-male/teens/stress-story");
  };

  return (
    <GameShell
      title="Hygiene Pro Badge"
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
              <div className="text-8xl mb-4">🏅</div>
              <h3 className="text-3xl font-bold text-white mb-2">Hygiene Pro Badge Earned!</h3>
              <p className="text-white/90 mb-4 text-lg">
                You are a master of cleanliness!
              </p>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-4 inline-block mb-4">
                <div className="text-white font-bold text-xl">CLEAN & CONFIDENT</div>
              </div>
              <p className="text-white/80">
                Keep shining! ✨
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HygieneProBadge50;
