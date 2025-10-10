import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PoliteWordsQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What should you say when someone gives you something?",
      options: [
        { id: "a", text: "Thank you!", isCorrect: true },
        { id: "b", text: "Finally!", isCorrect: false },
        { id: "c", text: "Nothing", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "How do you ask for help politely?",
      options: [
        { id: "a", text: "Give me that!", isCorrect: false },
        { id: "b", text: "Please help me", isCorrect: true },
        { id: "c", text: "I need this now!", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "What do you say when you bump into someone?",
      options: [
        { id: "a", text: "Watch where you're going!", isCorrect: false },
        { id: "b", text: "It's your fault", isCorrect: false },
        { id: "c", text: "Sorry! Excuse me", isCorrect: true }
      ]
    },
    {
      id: 4,
      text: "How do you greet your teacher in the morning?",
      options: [
        { id: "a", text: "Good morning!", isCorrect: true },
        { id: "b", text: "Hey!", isCorrect: false },
        { id: "c", text: "Yo!", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "What's the polite way to interrupt someone talking?",
      options: [
        { id: "a", text: "Stop talking!", isCorrect: false },
        { id: "b", text: "Excuse me, may I say something?", isCorrect: true },
        { id: "c", text: "Be quiet!", isCorrect: false }
      ]
    },
    {
      id: 6,
      text: "How do you ask to borrow something?",
      options: [
        { id: "a", text: "I'm taking this", isCorrect: false },
        { id: "b", text: "May I please borrow this?", isCorrect: true },
        { id: "c", text: "I need this", isCorrect: false }
      ]
    },
    {
      id: 7,
      text: "What do you say when leaving?",
      options: [
        { id: "a", text: "Goodbye! See you later!", isCorrect: true },
        { id: "b", text: "I'm out", isCorrect: false },
        { id: "c", text: "Whatever", isCorrect: false }
      ]
    },
    {
      id: 8,
      text: "How do you ask someone to move?",
      options: [
        { id: "a", text: "Move!", isCorrect: false },
        { id: "b", text: "Excuse me, please", isCorrect: true },
        { id: "c", text: "Get out of the way!", isCorrect: false }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    const question = questions[currentQuestion];
    const option = question.options.find(opt => opt.id === optionId);
    
    const newAnswers = [...answers, {
      questionId: question.id,
      answer: optionId,
      isCorrect: option.isCorrect
    }];
    
    setAnswers(newAnswers);
    
    if (option.isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, option.isCorrect ? 800 : 0);
    } else {
      const correctCount = newAnswers.filter(a => a.isCorrect).length;
      const percentage = (correctCount / questions.length) * 100;
      if (percentage >= 75) {
        setCoins(3); // +3 Coins for ≥75% (minimum for progress)
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/uvls/kids/respect-tap");
  };

  const correctCount = answers.filter(a => a.isCorrect).length;
  const percentage = Math.round((correctCount / questions.length) * 100);

  return (
    <GameShell
      title="Polite Words Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && percentage >= 75}
      showGameOver={showResult && percentage >= 75}
      score={coins}
      gameId="uvls-kids-12"
      gameType="uvls"
      totalLevels={20}
      currentLevel={12}
      showConfetti={showResult && percentage >= 75}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-6 font-semibold text-center">
                {questions[currentQuestion].text}
              </p>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102"
                  >
                    <div className="text-white font-medium">{option.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {percentage >= 75 ? "🎉 So Polite!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {correctCount} out of {questions.length} correct ({percentage}%)
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {percentage >= 75 ? "You earned 3 Coins! 🪙" : "Get 75% or higher to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Tip: Teach "please/thank you/sorry" chants!
            </p>
            {percentage < 75 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default PoliteWordsQuiz;

