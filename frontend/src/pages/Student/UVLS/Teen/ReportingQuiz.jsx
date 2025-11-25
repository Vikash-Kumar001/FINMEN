import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReportingQuiz = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-31";
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
      question: "Report school bullying to?",
      options: [
        { id: 1, text: "Teacher/counselor", correct: true },
        { id: 2, text: "Social media", correct: false },
        { id: 3, text: "Friend only", correct: false },
        { id: 4, text: "No one", correct: false }
      ]
    },
    {
      id: 2,
      question: "Cyberbullying channel?",
      options: [
        { id: 1, text: "Platform report", correct: true },
        { id: 2, text: "Reply back", correct: false },
        { id: 3, text: "Delete app", correct: false },
        { id: 4, text: "Ignore", correct: false }
      ]
    },
    {
      id: 3,
      question: "Physical bullying?",
      options: [
        { id: 1, text: "Tell adult", correct: true },
        { id: 2, text: "Fight back", correct: false },
        { id: 3, text: "Run away", correct: false },
        { id: 4, text: "Hide", correct: false }
      ]
    },
    {
      id: 4,
      question: "Emotional bullying?",
      options: [
        { id: 1, text: "Seek counselor", correct: true },
        { id: 2, text: "Cry alone", correct: false },
        { id: 3, text: "Ignore feelings", correct: false },
        { id: 4, text: "Blame self", correct: false }
      ]
    },
    {
      id: 5,
      question: "Anonymous report?",
      options: [
        { id: 1, text: "Hotline", correct: true },
        { id: 2, text: "Public post", correct: false },
        { id: 3, text: "Tell bully", correct: false },
        { id: 4, text: "Do nothing", correct: false }
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
      title="Reporting Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && (score / questions.length * 100 >= 70)}
      showGameOver={showResult && (score / questions.length * 100 >= 70)}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-31"
      gameType="uvls"
      totalLevels={20}
      currentLevel={31}
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
              Teacher Note: Ensure accuracy of local contact info.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReportingQuiz;