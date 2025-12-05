import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, Heart, UserCheck, CheckCircle, Badge } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertySmartTeenBadge = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-30";

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
      title: "Hormones",
      question: "What drives puberty?",
      icon: UserCheck,
      options: [
        { text: "Food", correct: false },
        { text: "Hormones", correct: true },
        { text: "Weather", correct: false }
      ],
      feedback: {
        correct: "Correct! Hormones are the chemical messengers.",
        wrong: "It's hormones that cause the changes."
      }
    },
    {
      id: 2,
      title: "Hygiene",
      question: "What helps with body odor?",
      icon: Shield,
      options: [
        { text: "Perfume only", correct: false },
        { text: "Shower & Deodorant", correct: true },
        { text: "Nothing", correct: false }
      ],
      feedback: {
        correct: "Yes! Cleanliness is key.",
        wrong: "You need to wash away the bacteria."
      }
    },
    {
      id: 3,
      title: "Acne",
      question: "Best way to treat acne?",
      icon: Heart,
      options: [
        { text: "Gentle Wash", correct: true },
        { text: "Pop it", correct: false },
        { text: "Scrub hard", correct: false }
      ],
      feedback: {
        correct: "Exactly! Be gentle with your skin.",
        wrong: "Popping or scrubbing makes it worse."
      }
    },
    {
      id: 4,
      title: "Emotions",
      question: "Are mood swings normal?",
      icon: CheckCircle,
      options: [
        { text: "Yes", correct: true },
        { text: "No", correct: false },
        { text: "Only for some", correct: false }
      ],
      feedback: {
        correct: "Right! It's part of growing up.",
        wrong: "Mood swings are very common during puberty."
      }
    },
    {
      id: 5,
      title: "Growth",
      question: "What fuels your growth?",
      icon: Badge,
      options: [
        { text: "Candy", correct: false },
        { text: "Healthy Food & Sleep", correct: true },
        { text: "Video Games", correct: false }
      ],
      feedback: {
        correct: "Smart! Your body needs fuel and rest.",
        wrong: "You need nutrients and rest to grow."
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
    navigate("/student/health-male/teens/puberty-health-story-teen");
  };

  return (
    <GameShell
      title="Puberty Smart Teen Badge"
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
              <h3 className="text-3xl font-bold text-white mb-2">Puberty Smart Badge Earned!</h3>
              <p className="text-white/90 mb-4 text-lg">
                Congratulations! You understand your growing body!
              </p>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-4 inline-block mb-4">
                <div className="text-white font-bold text-xl">PUBERTY EXPERT</div>
              </div>
              <p className="text-white/80">
                Grow with confidence! 🌟
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PubertySmartTeenBadge;
