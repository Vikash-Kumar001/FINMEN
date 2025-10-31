import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CitizenDutiesQuiz = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      question: "Keep park clean?",
      options: [
        { id: "a", text: "Yes, duty", emoji: "🛝", isCorrect: true },
        { id: "b", text: "No, others do", emoji: "🤷", isCorrect: false },
        { id: "c", text: "Litter more", emoji: "🚮", isCorrect: false }
      ]
    },
    {
      id: 2,
      question: "Help neighbor?",
      options: [
        { id: "a", text: "Yes, good citizen", emoji: "🤝", isCorrect: true },
        { id: "b", text: "Ignore", emoji: "🙈", isCorrect: false },
        { id: "c", text: "Make mess", emoji: "😈", isCorrect: false }
      ]
    },
    {
      id: 3,
      question: "Obey rules?",
      options: [
        { id: "a", text: "Always", emoji: "📜", isCorrect: true },
        { id: "b", text: "Sometimes", emoji: "🤔", isCorrect: false },
        { id: "c", text: "Never", emoji: "🚫", isCorrect: false }
      ]
    },
    {
      id: 4,
      question: "Vote when adult?",
      options: [
        { id: "a", text: "Important duty", emoji: "🗳️", isCorrect: true },
        { id: "b", text: "Skip it", emoji: "😴", isCorrect: false },
        { id: "c", text: "Don't care", emoji: "🤷", isCorrect: false }
      ]
    },
    {
      id: 5,
      question: "Recycle trash?",
      options: [
        { id: "a", text: "Yes, help earth", emoji: "♻️", isCorrect: true },
        { id: "b", text: "Throw anywhere", emoji: "🗑️", isCorrect: false },
        { id: "c", text: "Burn it", emoji: "🔥", isCorrect: false }
      ]
    }
  ];

  const handleAnswer = (selectedOption) => {
    const newAnswers = [...answers, { 
      questionId: questions[currentQuestion].id, 
      answer: selectedOption,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
    }];
    
    setAnswers(newAnswers);
    
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect;
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 800 : 0);
    } else {
      const correctAnswers = newAnswers.filter(ans => ans.isCorrect).length;
      setFinalScore(correctAnswers);
      if (correctAnswers >= 4) {
        setCoins(3);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Citizen Duties Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 4}
      showGameOver={showResult && finalScore >= 4}
      score={coins}
      gameId="uvls-kids-82"
      gameType="uvls"
      totalLevels={100}
      currentLevel={82}
      showConfetti={showResult && finalScore >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {answers.filter(a => a.isCorrect).length}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6 font-semibold">
                {getCurrentQuestion().question}
              </p>
              
              <div className="space-y-3">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 flex items-center gap-3"
                  >
                    <div className="text-3xl">{option.emoji}</div>
                    <div className="text-white font-medium text-left">{option.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 4 ? "🎉 Duty Expert!" : "💪 Learn Duties!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {finalScore} out of {questions.length} correct!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 4 ? "You earned 3 Coins! 🪙" : "Try again!"}
            </p>
            {finalScore < 4 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CitizenDutiesQuiz;