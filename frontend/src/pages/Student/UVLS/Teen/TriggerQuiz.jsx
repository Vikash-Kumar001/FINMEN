import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TriggerQuiz = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-33";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleConfirm();
    }
  }, [timeLeft, showResult]);

  const questions = [
    {
      id: 1,
      question: "Exam pressure trigger?",
      options: [
        { id: 1, text: "Stress", correct: true },
        { id: 2, text: "Happiness", correct: false },
        { id: 3, text: "Boredom", correct: false },
        { id: 4, text: "Relaxation", correct: false }
      ]
    },
    {
      id: 2,
      question: "Friend argument?",
      options: [
        { id: 1, text: "Anger", correct: true },
        { id: 2, text: "Joy", correct: false },
        { id: 3, text: "Peace", correct: false },
        { id: 4, text: "Calm", correct: false }
      ]
    },
    {
      id: 3,
      question: "Overload homework?",
      options: [
        { id: 1, text: "Frustration", correct: true },
        { id: 2, text: "Excitement", correct: false },
        { id: 3, text: "Ease", correct: false },
        { id: 4, text: "Fun", correct: false }
      ]
    },
    {
      id: 4,
      question: "Family expectations?",
      options: [
        { id: 1, text: "Anxiety", correct: true },
        { id: 2, text: "Indifference", correct: false },
        { id: 3, text: "Laughter", correct: false },
        { id: 4, text: "Sleepiness", correct: false }
      ]
    },
    {
      id: 5,
      question: "Peer comparison?",
      options: [
        { id: 1, text: "Jealousy", correct: true },
        { id: 2, text: "Contentment", correct: false },
        { id: 3, text: "Pride", correct: false },
        { id: 4, text: "Boredom", correct: false }
      ]
    }
  ];

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const answer = question.options.find(a => a.id === selectedAnswer) || { correct: false };
    
    if (answer.correct) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedAnswer(null);
    setTimeLeft(30);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Trigger Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && (score / questions.length * 100 >= 70)}
      showGameOver={showResult && (score / questions.length * 100 >= 70)}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-33"
      gameType="uvls"
      totalLevels={20}
      currentLevel={33}
      showConfetti={showResult && (score / questions.length * 100 >= 70)}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              <p className="text-white text-xl mb-6">{questions[currentQuestion].question}</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedAnswer === option.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{option.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedAnswer && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedAnswer || timeLeft === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Quiz Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Score: {score} / {questions.length} ({(score / questions.length * 100).toFixed(0)}%)
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {(score / questions.length * 100 >= 70) ? "Earned 3 Coins!" : "Try again for coins."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Link to coping strategies.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TriggerQuiz;