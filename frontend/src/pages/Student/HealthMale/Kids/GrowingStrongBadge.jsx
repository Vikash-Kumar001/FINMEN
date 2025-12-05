import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Ruler, Mic, User, Dumbbell, Heart } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GrowingStrongBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-30";
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
      title: "Height Growth",
      question: "Is it normal to grow taller?",
      icon: Ruler,
      item: "Height Growth",
      options: [
        { text: "No, it's weird", correct: false, coins: 0 },
        { text: "Yes, absolutely", correct: true, coins: 1 },
        { text: "Only for some", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Correct! Growing taller is a completely normal part of childhood!",
        wrong: "Growing taller is a natural and normal part of growing up for everyone!"
      }
    },
    {
      id: 2,
      title: "Voice Change",
      question: "What happens to your voice?",
      icon: Mic,
      item: "Voice Change",
      options: [
        { text: "It disappears", correct: false, coins: 0 },
        { text: "It gets deeper", correct: true, coins: 1 },
        { text: "It stays the same", correct: false, coins: 0 },
      ],
      feedback: {
        correct: "That's right! Your voice getting deeper is a sign of growing up!",
        wrong: "During puberty, it's normal for a boy's voice to get deeper!"
      }
    },
    {
      id: 3,
      title: "Body Hair",
      question: "Is body hair natural?",
      icon: User,
      item: "Body Hair",
      options: [
        { text: "Yes, it's natural", correct: true, coins: 1 },
        { text: "No, it's bad", correct: false, coins: 0 },
        { text: "Only on head", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Spot on! Body hair growth is a natural change during puberty!",
        wrong: "Body hair appearing in new places is a natural part of growing up!"
      }
    },
    {
      id: 4,
      title: "Strength",
      question: "How do you get stronger?",
      icon: Dumbbell,
      item: "Strength",
      options: [
        { text: "Sitting still", correct: false, coins: 0 },
        { text: "Exercise & food", correct: true, coins: 1 },
        { text: "Sleeping only", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Great job! Healthy food and exercise help your muscles grow strong!",
        wrong: "To build strength, you need a mix of healthy food and exercise!"
      }
    },
    {
      id: 5,
      title: "Self Acceptance",
      question: "How should you feel about growing?",
      icon: Heart,
      item: "Self Acceptance",
      options: [
        { text: "Scared", correct: false, coins: 0 },
        { text: "Ashamed", correct: false, coins: 0 },
        { text: "Proud & Happy", correct: true, coins: 1 }
      ],
      feedback: {
        correct: "Wonderful! Be proud of your growing body and the changes happening!",
        wrong: "You should feel proud and happy about your body growing and changing!"
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
      title="Badge: Growing Strong"
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

export default GrowingStrongBadge;
