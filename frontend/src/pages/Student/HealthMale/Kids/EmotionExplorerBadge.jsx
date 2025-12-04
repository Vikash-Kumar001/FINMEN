import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, Smile, Frown, Zap, Users } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EmotionExplorerBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-60";
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
      title: "Happy Feelings",
      question: "Which feeling makes you smile?",
      icon: Smile,
      options: [
        { text: "Sad", correct: false },
        { text: "Happy", correct: true },
        { text: "Angry", correct: false }
      ],
      feedback: {
        correct: "Yes! Happiness makes us smile and feel good!",
        wrong: "Happiness is the feeling that makes us smile!"
      }
    },
    {
      id: 2,
      title: "Sadness Helpers",
      question: "What helps when you are sad?",
      icon: Frown,
      options: [
        { text: "Talk to a friend", correct: true },
        { text: "Stay alone forever", correct: false },
        { text: "Yell at people", correct: false }
      ],
      feedback: {
        correct: "Great! Sharing your feelings with a friend helps you feel better!",
        wrong: "Talking to a friend is a great way to feel better when sad!"
      }
    },
    {
      id: 3,
      title: "Calming Anger",
      question: "How can you calm down when angry?",
      icon: Zap,
      options: [
        { text: "Throw things", correct: false },
        { text: "Hit someone", correct: false },
        { text: "Take deep breaths", correct: true }
      ],
      feedback: {
        correct: "Perfect! Deep breaths help your body and mind relax!",
        wrong: "Taking deep breaths is the best way to calm down!"
      }
    },
    {
      id: 4,
      title: "Showing Excitement",
      question: "What is a good way to show excitement?",
      icon: Heart,
      options: [
        { text: "Jump and cheer", correct: true },
        { text: "Push people", correct: false },
        { text: "Break something", correct: false }
      ],
      feedback: {
        correct: "Yay! Jumping and cheering is a fun way to show excitement!",
        wrong: "Jumping and cheering is a safe and fun way to show you're excited!"
      }
    },
    {
      id: 5,
      title: "Sharing Feelings",
      question: "Who can you talk to about feelings?",
      icon: Users,
      options: [
        { text: "No one", correct: false },
        { text: "Parents or Teachers", correct: true },
        { text: "A wall", correct: false }
      ],
      feedback: {
        correct: "Exactly! Parents and teachers are there to listen and help!",
        wrong: "Parents and teachers are great people to talk to about feelings!"
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
      title="Badge: Emotion Explorer"
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
              <Icon className="w-16 h-16 text-yellow-400" />
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

export default EmotionExplorerBadge;
