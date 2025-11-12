import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CollegeStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [choices, setChoices] = useState([]);

  const questions = [
    {
      id: 1,
      text: "You get ₹1000 for college expenses. Spend all on outings?",
      options: [
        { id: "no", text: "No, budget for needs", emoji: "📚", description: "Prioritize essentials", isCorrect: true },
        { id: "yes", text: "Yes, enjoy outings", emoji: "🎉", description: "Spends all", isCorrect: false }
      ],
      reward: 5
    },
    {
      id: 2,
      text: "You need books and want snacks. What’s first?",
      options: [
        { id: "books", text: "Buy books", emoji: "📖", description: "Education first", isCorrect: true },
        { id: "snacks", text: "Buy snacks", emoji: "🍫", description: "Fun over needs", isCorrect: false }
      ],
      reward: 5
    },
    {
      id: 3,
      text: "You get ₹500 extra. Save or spend on clothes?",
      options: [
        { id: "save", text: "Save for emergencies", emoji: "🏦", description: "Smart choice", isCorrect: true },
        { id: "clothes", text: "Buy clothes", emoji: "👗", description: "Quick spend", isCorrect: false }
      ],
      reward: 6
    },
    {
      id: 4,
      text: "You want a new phone but have fees due. What’s smarter?",
      options: [
        { id: "fees", text: "Pay fees", emoji: "💳", description: "Prioritize duties", isCorrect: true },
        { id: "phone", text: "Buy phone", emoji: "📱", description: "Risky choice", isCorrect: false }
      ],
      reward: 6
    },
    {
      id: 5,
      text: "You get a part-time job. How to manage earnings?",
      options: [
        { id: "budget", text: "Budget for needs, savings", emoji: "💰", description: "Balanced plan", isCorrect: true },
        { id: "spend", text: "Spend all", emoji: "🛍️", description: "No savings", isCorrect: false }
      ],
      reward: 7
    }
  ];

  const handleChoice = (selectedChoice) => {
    resetFeedback();
    const question = questions[currentQuestion];
    const isCorrect = question.options.find(opt => opt.id === selectedChoice)?.isCorrect;

    setChoices([...choices, { questionId: question.id, choice: selectedChoice, isCorrect }]);
    if (isCorrect) {
      setCoins(prev => prev + question.reward);
      showCorrectAnswerFeedback(question.reward, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 800);
    } else {
      const correctAnswers = [...choices, { questionId: question.id, choice: selectedChoice, isCorrect }].filter(c => c.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => navigate("/student/finance/teen");

  return (
    <GameShell
      title="College Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      coins={coins}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleNext : null}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-teens-55"
      gameType="finance"
    >
      <div className="space-y-8 text-white">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
              <span className="text-yellow-400 font-bold">Coins: {coins}</span>
            </div>
            <p className="text-xl mb-6">{questions[currentQuestion].text}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questions[currentQuestion].options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleChoice(opt.id)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">{opt.emoji}</div>
                  <h3 className="font-bold text-xl mb-2">{opt.text}</h3>
                  <p className="text-white/90">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
            {finalScore >= 3 ? (
              <>
                <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
                <h3 className="text-3xl font-bold mb-4">College Budget Star!</h3>
                <p className="text-white/90 text-lg mb-6">You got {finalScore} out of 5 correct!</p>
                <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
                  +{coins} Coins
                </div>
                <p className="text-white/80 mt-4">Lesson: Prioritize needs in college!</p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-6">You got {finalScore} out of 5 correct.</p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-transform hover:scale-105"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CollegeStory;