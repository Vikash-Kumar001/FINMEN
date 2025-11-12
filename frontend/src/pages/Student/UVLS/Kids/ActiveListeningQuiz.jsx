import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ActiveListeningQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      scenario: "Friend talking, you look away.",
      options: [
        { id: "a", text: "Good listening", emoji: "👂", isCorrect: false },
        { id: "b", text: "Bad listening", emoji: "🙉", isCorrect: true },
        { id: "c", text: "Okay", emoji: "🤷", isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "Repeat what friend said.",
      options: [
        { id: "a", text: "Active listening", emoji: "🗣️", isCorrect: true },
        { id: "b", text: "Ignoring", emoji: "🙈", isCorrect: false },
        { id: "c", text: "Yelling", emoji: "😠", isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "Play phone while talking.",
      options: [
        { id: "a", text: "Bad", emoji: "📱", isCorrect: true },
        { id: "b", text: "Good", emoji: "👍", isCorrect: false },
        { id: "c", text: "Fun", emoji: "😄", isCorrect: false }
      ]
    },
    {
      id: 4,
      scenario: "Nod and eye contact.",
      options: [
        { id: "a", text: "Active", emoji: "👀", isCorrect: true },
        { id: "b", text: "Sleeping", emoji: "😴", isCorrect: false },
        { id: "c", text: "Running", emoji: "🏃", isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "Interrupt always.",
      options: [
        { id: "a", text: "Poor listening", emoji: "🛑", isCorrect: true },
        { id: "b", text: "Helpful", emoji: "🤝", isCorrect: false },
        { id: "c", text: "Quiet", emoji: "🤫", isCorrect: false }
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
      title="Active Listening Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 4}
      showGameOver={showResult && finalScore >= 4}
      score={coins}
      gameId="uvls-kids-62"
      gameType="uvls"
      totalLevels={70}
      currentLevel={62}
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
                {getCurrentQuestion().scenario}
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
              {finalScore >= 4 ? "🎉 Listener Expert!" : "💪 Listen More!"}
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

export default ActiveListeningQuiz;