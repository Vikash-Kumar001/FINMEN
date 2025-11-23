import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnEarning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: "What’s the correct way to earn money?",
      options: ["By working", "By wasting", "By sleeping"],
      correct: "By working",
    },
    {
      question: "How does a farmer earn money?",
      options: ["Selling crops", "Playing games", "Giving away food"],
      correct: "Selling crops",
    },
    {
      question: "What job earns money by teaching?",
      options: ["Teacher", "Toy maker", "Candy seller"],
      correct: "Teacher",
    },
    {
      question: "How can kids earn money?",
      options: ["Doing chores", "Watching TV", "Eating snacks"],
      correct: "Doing chores",
    },
    {
      question: "Why is earning money important?",
      options: ["Meets your needs", "Gets you free toys", "Makes you sleep better"],
      correct: "Meets your needs",
    },
  ];

  const handleAnswer = (choice) => {
    resetFeedback();
    if (choice === stages[currentStage].correct) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage((prev) => prev + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Quiz on Earning"
      subtitle="Test your knowledge about earning money!"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-kids-142"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <CheckCircle className="mx-auto w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stages[currentStage].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-4 rounded-xl text-white font-bold transition-transform hover:scale-105"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <CheckCircle className="mx-auto w-16 h-16 text-green-500 mb-3" />
            <h3 className="text-3xl font-bold mb-4">Earning Quiz Star!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for earning knowledge!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Work hard to earn money!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizOnEarning;