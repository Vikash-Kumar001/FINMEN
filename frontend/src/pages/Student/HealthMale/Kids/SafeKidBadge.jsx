import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertTriangle, Heart, UserCheck, CheckCircle } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SafeKidBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-90";
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
      title: "Say No",
      question: "What is the best way to refuse bad things?",
      icon: Shield,
      options: [
        { text: "Say NO clearly", correct: true },
        { text: "Maybe later", correct: false },
        { text: "Smile and take it", correct: false }
      ],
      feedback: {
        correct: "Correct! Being clear and firm is the best way to say no.",
        wrong: "You need to be clear so they know you mean it."
      }
    },
    {
      id: 2,
      title: "Healthy Body",
      question: "What should you put in your body?",
      icon: Heart,
      options: [
        { text: "Smoke", correct: false },
        { text: "Healthy Food & Water", correct: true },
        { text: "Alcohol", correct: false }
      ],
      feedback: {
        correct: "Yes! Healthy food and water make you strong.",
        wrong: "Smoke and alcohol hurt your body."
      }
    },
    {
      id: 3,
      title: "Peer Pressure",
      question: "What if friends pressure you?",
      icon: UserCheck,
      options: [
        { text: "Do it to fit in", correct: false },
        { text: "Leave and tell an adult", correct: true },
        { text: "Get angry", correct: false }
      ],
      feedback: {
        correct: "Exactly! Leave the situation and find a safe adult.",
        wrong: "Don't give in to pressure. Your safety matters more."
      }
    },
    {
      id: 4,
      title: "Medicine Safety",
      question: "Who gives you medicine?",
      icon: AlertTriangle,
      options: [
        { text: "Parents or Doctors", correct: true },
        { text: "Friends", correct: false },
        { text: "Strangers", correct: false }
      ],
      feedback: {
        correct: "Right! Only trust parents or doctors with medicine.",
        wrong: "Never take medicine from friends or strangers."
      }
    },
    {
      id: 5,
      title: "Stay Safe",
      question: "What makes you a Safe Kid?",
      icon: CheckCircle,
      options: [
        { text: "Taking risks", correct: false },
        { text: "Making smart choices", correct: true },
        { text: "Following others", correct: false }
      ],
      feedback: {
        correct: "You got it! Smart choices keep you safe and happy!",
        wrong: "Being safe means thinking for yourself and making good choices."
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
      title="Safe Kid Badge"
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
              <h3 className="text-3xl font-bold text-white mb-2">Safe Kid Badge Earned!</h3>
              <p className="text-white/90 mb-4 text-lg">
                Congratulations! You know how to keep yourself safe from harmful things!
              </p>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-4 inline-block mb-4">
                <div className="text-white font-bold text-xl">SAFE KID EXPERT</div>
              </div>
              <p className="text-white/80">
                You are strong, smart, and safe! 🌟
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SafeKidBadge;
