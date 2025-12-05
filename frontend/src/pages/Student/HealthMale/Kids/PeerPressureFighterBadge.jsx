import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, AlertTriangle, Shield, UserCheck, Heart } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PeerPressureFighterBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-70";
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
      title: "Homework First",
      question: "Friends want you to skip homework to play. What do you do?",
      icon: BookOpen,
      options: [
        { text: "Skip homework and play", correct: false },
        { text: "Say no and do homework first", correct: true },
        { text: "Lie that you finished it", correct: false }
      ],
      feedback: {
        correct: "Great job! School work comes before fun. You made the responsible choice!",
        wrong: "It's important to finish your responsibilities like homework before playing!"
      }
    },
    {
      id: 2,
      title: "Safe Choices",
      question: "Someone dares you to do something dangerous. What's your move?",
      icon: AlertTriangle,
      options: [
        { text: "Do it to look cool", correct: false },
        { text: "Refuse the dangerous dare", correct: true },
        { text: "Ask someone else to do it", correct: false }
      ],
      feedback: {
        correct: "Excellent! Your safety is much more important than any dare!",
        wrong: "Never accept a dare that could hurt you or get you in trouble!"
      }
    },
    {
      id: 3,
      title: "Stand Up",
      question: "You see someone being bullied. How do you help?",
      icon: Shield,
      options: [
        { text: "Join in the bullying", correct: false },
        { text: "Ignore it completely", correct: false },
        { text: "Stand up for them or tell an adult", correct: true }
      ],
      feedback: {
        correct: "You're a hero! Standing up to bullying takes real courage!",
        wrong: "Bullying is wrong. Helping the person or telling an adult is the right thing to do."
      }
    },
    {
      id: 4,
      title: "Boundaries",
      question: "A friend keeps asking for your personal secrets. What do you say?",
      icon: UserCheck,
      options: [
        { text: "Tell them everything", correct: false },
        { text: "Say 'Please respect my privacy'", correct: true },
        { text: "Make up a lie", correct: false }
      ],
      feedback: {
        correct: "Perfect! Everyone has the right to privacy and boundaries!",
        wrong: "It's okay to keep personal things private. Good friends respect boundaries!"
      }
    },
    {
      id: 5,
      title: "Be Yourself",
      question: "Everyone is wearing a new style you don't like. Do you wear it too?",
      icon: Heart,
      options: [
        { text: "Wear what makes YOU happy", correct: true },
        { text: "Wear it to fit in", correct: false },
        { text: "Make fun of their clothes", correct: false }
      ],
      feedback: {
        correct: "Wonderful! Being true to yourself is better than just following the crowd!",
        wrong: "You don't have to copy others to be cool. Be proud of your own style!"
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
    navigate("/student/health-male/kids/vaccine-story");
  };

  return (
    <GameShell
      title="Peer Pressure Fighter Badge"
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
              <h3 className="text-3xl font-bold text-white mb-2">Peer Pressure Fighter Badge Earned!</h3>
              <p className="text-white/90 mb-4 text-lg">
                Congratulations! You've mastered peer pressure and earned the Peer Pressure Fighter Badge!
              </p>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-4 inline-block mb-4">
                <div className="text-white font-bold text-xl">PEER PRESSURE FIGHTER</div>
              </div>
              <p className="text-white/80">
                You're a champion at saying no and standing up for what's right! 🌟
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PeerPressureFighterBadge;