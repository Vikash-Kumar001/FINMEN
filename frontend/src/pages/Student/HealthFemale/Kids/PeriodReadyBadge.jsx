import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Calendar, Shield, Droplets, Heart, BadgeCheck } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeriodReadyBadge = () => {
  const location = useLocation();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-40";

  const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti, resetFeedback } = useGameFeedback();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Content adapted for Period Ready Kid Badge
  const levels = [
    {
      id: 1,
      title: "Cycle Length",
      question: "What is the average length of a menstrual cycle?",
      icon: Calendar,
      item: "Calendar",
      options: [
        { text: "28 days", correct: true },
        { text: "14 days", correct: false },
        { text: "42 days", correct: false }
      ],
      feedback: {
        correct: "Correct! Most cycles are around 28 days.",
        wrong: "The average cycle lasts about 28 days."
      }
    },
    {
      id: 2,
      title: "Hygiene",
      question: "How often should you change your pad?",
      icon: Shield,
      item: "Pad",
      options: [
        { text: "Every 24 hours", correct: false },
        { text: "Every 4-8 hours", correct: true },
        { text: "Only when it hurts", correct: false }
      ],
      feedback: {
        correct: "Excellent! Changing regularly keeps you fresh and healthy.",
        wrong: "You should change pads every 4-8 hours for good hygiene."
      }
    },
    {
      id: 3,
      title: "Symptoms",
      question: "What might you feel during your period?",
      icon: Droplets,
      item: "Symptoms",
      options: [
        { text: "Cramps or mood changes", correct: true },
        { text: "Your hair turns purple", correct: false },
        { text: "You become invisible", correct: false }
      ],
      feedback: {
        correct: "Right! Cramps and mood swings are normal symptoms.",
        wrong: "Common symptoms include cramps or mood changes."
      }
    },
    {
      id: 4,
      title: "Support",
      question: "What should you do if a friend is embarrassed?",
      icon: Heart,
      item: "Heart",
      options: [
        { text: "Laugh at her", correct: false },
        { text: "Tell everyone", correct: false },
        { text: "Comfort her", correct: true }
      ],
      feedback: {
        correct: "That is kind! Supporting friends is very important.",
        wrong: "You should always comfort and support your friends."
      }
    },
    {
      id: 5,
      title: "Readiness",
      question: "What makes you Period Ready?",
      icon: BadgeCheck,
      item: "Badge",
      options: [
        { text: "Ignoring it", correct: false },
        { text: "Having supplies and knowledge", correct: true },
        { text: "Staying home forever", correct: false }
      ],
      feedback: {
        correct: "You got it! Being prepared makes you confident!",
        wrong: "Being ready means having supplies and knowing what to expect."
      }
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData.icon;

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

  return (
    <GameShell
      title="Badge: Period Ready Kid"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Test your knowledge!` : "Badge Earned!"}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId={gameId}
      gameType="health-female"
      maxScore={maxScore}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score === 5}
      backPath="/games/health-female/kids"
    >
      <div className="text-center text-white space-y-6">
        {!showResult && currentLevelData && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="flex justify-center mb-4">
              <Icon className="w-16 h-16 text-pink-400" />
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
                  className="w-full min-h-[60px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-8 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
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

export default PeriodReadyBadge;