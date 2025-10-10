import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnJobs = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      question: "Who teaches students?",
      options: ["Farmer", "Teacher", "Driver"],
      correct: "Teacher",
      emoji: "👩‍🏫"
    },
    {
      id: 2,
      question: "Who grows crops?",
      options: ["Pilot", "Farmer", "Chef"],
      correct: "Farmer",
      emoji: "👨‍🌾"
    },
    {
      id: 3,
      question: "Who flies airplanes?",
      options: ["Pilot", "Doctor", "Artist"],
      correct: "Pilot",
      emoji: "👨‍✈️"
    },
    {
      id: 4,
      question: "Who cooks food?",
      options: ["Chef", "Nurse", "Mechanic"],
      correct: "Chef",
      emoji: "👨‍🍳"
    },
    {
      id: 5,
      question: "Who fixes cars?",
      options: ["Teacher", "Mechanic", "Singer"],
      correct: "Mechanic",
      emoji: "👨‍🔧"
    },
    {
      id: 6,
      question: "Who helps sick people in hospitals?",
      options: ["Nurse", "Driver", "Painter"],
      correct: "Nurse",
      emoji: "👩‍⚕️"
    }
  ];

  const currentQ = questions[currentQuestion];

  const handleAnswer = (answer) => {
    const isCorrect = answer === currentQ.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 800 : 600);
    } else {
      if ((score + (isCorrect ? 1 : 0)) >= 4) {
        setCoins(3);
      }
      setScore(prev => prev + (isCorrect ? 1 : 0));
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ehe/kids/reflex-job-match");
  };

  return (
    <GameShell
      title="Quiz on Jobs"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 4}
      showGameOver={showResult && score >= 4}
      score={coins}
      gameId="ehe-kids-2"
      gameType="educational"
      totalLevels={20}
      currentLevel={2}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/entrepreneurship/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{currentQ.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQ.question}
              </p>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="w-full border-2 rounded-xl p-5 transition-all bg-white/20 border-white/40 hover:bg-white/30 text-white font-semibold text-lg"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 4 ? "🎉 Job Expert!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You answered {score} out of {questions.length} correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Every job is important! Learning about different careers helps you dream big!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 4 ? "You earned 3 Coins! 🪙" : "Get 4 or more correct to earn coins!"}
            </p>
            {score < 4 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizOnJobs;

