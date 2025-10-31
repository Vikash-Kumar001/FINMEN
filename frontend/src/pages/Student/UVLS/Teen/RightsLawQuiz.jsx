import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RightsLawQuiz = () => {
  const navigate = useNavigate();
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
      question: "What is the Equal Pay Act?",
      options: [
        { id: 1, text: "Equal pay for equal work", correct: true },
        { id: 2, text: "Voting rights", correct: false },
        { id: 3, text: "Education equality", correct: false },
        { id: 4, text: "Marriage laws", correct: false }
      ],
      explanation: "It ensures equal pay regardless of gender."
    },
    {
      id: 2,
      question: "Title IX is for?",
      options: [
        { id: 1, text: "Education non-discrimination", correct: true },
        { id: 2, text: "Employment", correct: false },
        { id: 3, text: "Housing", correct: false },
        { id: 4, text: "Healthcare", correct: false }
      ],
      explanation: "Prohibits gender discrimination in education."
    },
    {
      id: 3,
      question: "CEDAW meaning?",
      options: [
        { id: 1, text: "Convention on Elimination of Discrimination Against Women", correct: true },
        { id: 2, text: "Child Education Act", correct: false },
        { id: 3, text: "Civil Equality Directive", correct: false },
        { id: 4, text: "Cultural Diversity Agreement", correct: false }
      ],
      explanation: "UN treaty for women's rights."
    },
    {
      id: 4,
      question: "Gender equality in law means?",
      options: [
        { id: 1, text: "Same rights for all genders", correct: true },
        { id: 2, text: "Women superior", correct: false },
        { id: 3, text: "Men have more rights", correct: false },
        { id: 4, text: "No laws needed", correct: false }
      ],
      explanation: "Equal treatment under law."
    },
    {
      id: 5,
      question: "Violence Against Women Act?",
      options: [
        { id: 1, text: "Protects from domestic violence", correct: true },
        { id: 2, text: "Employment law", correct: false },
        { id: 3, text: "Education policy", correct: false },
        { id: 4, text: "Voting act", correct: false }
      ],
      explanation: "Addresses gender-based violence."
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
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedAnswer(null);
    setTimeLeft(30);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const percentage = (score / questions.length) * 100;
      if (percentage >= 70) {
        setCoins(3);
      }
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Rights & Law Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && (score / questions.length * 100 >= 70)}
      showGameOver={showResult && (score / questions.length * 100 >= 70)}
      score={coins}
      gameId="gender-122"
      gameType="gender"
      totalLevels={10}
      currentLevel={2}
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
              Teacher Note: Provide resource links.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RightsLawQuiz;