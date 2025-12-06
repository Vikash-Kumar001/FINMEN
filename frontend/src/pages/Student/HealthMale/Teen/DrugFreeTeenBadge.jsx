import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { Award, Shield, Heart, ThumbsUp, Star } from "lucide-react";

const DrugFreeTeenBadge = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const questions = [
    {
      id: 1,
      icon: <Shield className="w-12 h-12 text-blue-400" />,
      title: "Refusal Skills",
      question: "What is the best way to say no to drugs?",
      options: [
        { id: "a", text: "Say 'No' confidently", isCorrect: true },
        { id: "b", text: "Say 'Maybe later'", isCorrect: false },
        { id: "c", text: "Take it and hide it", isCorrect: false }
      ]
    },
    {
      id: 2,
      icon: <Heart className="w-12 h-12 text-red-400" />,
      title: "Health Impact",
      question: "Why are drugs dangerous for teens?",
      options: [
        { id: "a", text: "They taste bad", isCorrect: false },
        { id: "b", text: "They affect brain development", isCorrect: true },
        { id: "c", text: "They are expensive", isCorrect: false }
      ]
    },
    {
      id: 3,
      icon: <ThumbsUp className="w-12 h-12 text-green-400" />,
      title: "Positive Choices",
      question: "What is a healthy alternative to substance use?",
      options: [
        { id: "a", text: "Sports and hobbies", isCorrect: true },
        { id: "b", text: "Sleeping all day", isCorrect: false },
        { id: "c", text: "Skipping school", isCorrect: false }
      ]
    },
    {
      id: 4,
      icon: <Star className="w-12 h-12 text-yellow-400" />,
      title: "Future Goals",
      question: "How does staying drug-free help your future?",
      options: [
        { id: "a", text: "It doesn't matter", isCorrect: false },
        { id: "b", text: "Protects health and opportunities", isCorrect: true },
        { id: "c", text: "Makes life boring", isCorrect: false }
      ]
    },
    {
      id: 5,
      icon: <Award className="w-12 h-12 text-purple-400" />,
      title: "Support System",
      question: "Who can you talk to if you feel pressured?",
      options: [
        { id: "a", text: "Strangers online", isCorrect: false },
        { id: "b", text: "Parents or trusted adults", isCorrect: true },
        { id: "c", text: "Nobody", isCorrect: false }
      ]
    }
  ];

  const handleAnswer = (isCorrect) => {
    if (gameFinished) return;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1000);
  };

  const currentQ = questions[currentQuestion];

  const handleNext = () => {
    navigate("/games/health-male/teens");
  };

  return (
    <GameShell
      title="Badge: Drug-Free Teen"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-90"
      gameType="health-male"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {score}</span>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="mb-4 p-4 bg-white/10 rounded-full">
              {currentQ.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{currentQ.title}</h3>
            <p className="text-white/90 text-lg text-center max-w-lg">
              {currentQ.question}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
            {currentQ.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.isCorrect)}
                className="group relative bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-xl transition-all hover:scale-102 flex items-center"
              >
                <div className="flex-1 text-left">
                  <span className="text-lg font-medium text-white group-hover:text-blue-300 transition-colors">
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {gameFinished && (
          <div className="text-center mt-8 space-y-4">
            <div className="inline-block p-4 bg-yellow-500/20 rounded-full mb-4">
              <Award className="w-16 h-16 text-yellow-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              Badge Earned!
            </h2>
            <p className="text-blue-200 text-lg">
              You've proven your commitment to a drug-free life!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DrugFreeTeenBadge;
