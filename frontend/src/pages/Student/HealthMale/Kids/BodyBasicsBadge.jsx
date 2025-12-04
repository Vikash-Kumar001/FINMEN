import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, Activity, Wind, Shield, Smile } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BodyBasicsBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-40";
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
      title: "Organ Teamwork",
      question: "How do body organs work?",
      icon: Activity,
      item: "Teamwork",
      options: [
        { text: "They fight", correct: false, coins: 0 },
        { text: "They work together", correct: true, coins: 1 },
        { text: "They sleep", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Correct! All your organs work together like a team!",
        wrong: "Actually, your organs work together to keep you healthy!"
      }
    },
    {
      id: 2,
      title: "Heart Function",
      question: "What does the heart do?",
      icon: Heart,
      item: "Heart",
      options: [
        { text: "Pumps blood", correct: true, coins: 1 },
        { text: "Digests food", correct: false, coins: 0 },
        { text: "Thinks", correct: false, coins: 0 },
      ],
      feedback: {
        correct: "That's right! The heart pumps blood all around your body!",
        wrong: "The heart's main job is to pump blood through your body!"
      }
    },
    {
      id: 3,
      title: "Lung Function",
      question: "What do lungs help us do?",
      icon: Wind,
      item: "Lungs",
      options: [
        { text: "Eat", correct: false, coins: 0 },
        { text: "Breathe oxygen", correct: true, coins: 1 },
        { text: "Walk", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Spot on! Lungs help us breathe in fresh oxygen!",
        wrong: "Lungs are the organs that help us breathe oxygen!"
      }
    },
    {
      id: 4,
      title: "Body Respect",
      question: "How should we treat our bodies?",
      icon: Shield,
      item: "Respect",
      options: [
        { text: "Ignore them", correct: false, coins: 0 },
        { text: "Carelessly", correct: false, coins: 0 },
        { text: "With respect & privacy", correct: true, coins: 1 },
      ],
      feedback: {
        correct: "Great job! Every body deserves respect and privacy!",
        wrong: "It's important to treat our bodies with respect and keep private parts private!"
      }
    },
    {
      id: 5,
      title: "Body Changes",
      question: "Are body changes normal?",
      icon: Smile,
      item: "Acceptance",
      options: [
        { text: "Yes, completely normal", correct: true, coins: 1 },
        { text: "No, they're weird", correct: false, coins: 0 },
        { text: "Only for some", correct: false, coins: 0 },
      ],
      feedback: {
        correct: "Wonderful! Body changes are a normal part of growing up for everyone!",
        wrong: "Body changes are completely normal and happen to everyone!"
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
      title="Badge: Body Basics"
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

export default BodyBasicsBadge;
