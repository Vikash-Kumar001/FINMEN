import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BorrowingStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [choices, setChoices] = useState([]);

  const stages = [
    {
      id: 1,
      text: "You borrow for a new phone but can’t repay. Result?",
      options: [
        { id: "debt", text: "Debt", emoji: "📉", description: "Unpaid loan grows", isCorrect: true },
        { id: "fine", text: "No issue", emoji: "🤷", description: "Not realistic", isCorrect: false }
      ],
      reward: 5
    },
    {
      id: 2,
      text: "You borrow ₹500 for shoes. Can’t repay on time?",
      options: [
        { id: "debt", text: "Accumulate debt", emoji: "💸", description: "Increases owed amount", isCorrect: true },
        { id: "okay", text: "It’s okay", emoji: "😊", description: "Risks trust", isCorrect: false }
      ],
      reward: 5
    },
    {
      id: 3,
      text: "You borrow for a laptop. Miss payments?",
      options: [
        { id: "debt", text: "Debt grows", emoji: "📉", description: "Interest adds up", isCorrect: true },
        { id: "nothing", text: "Nothing happens", emoji: "🤷", description: "Not true", isCorrect: false }
      ],
      reward: 6
    },
    {
      id: 4,
      text: "You borrow for a trip. Can’t repay?",
      options: [
        { id: "debt", text: "Debt increases", emoji: "💸", description: "Financial stress", isCorrect: true },
        { id: "ignore", text: "Ignore it", emoji: "🙈", description: "Worsens situation", isCorrect: false }
      ],
      reward: 6
    },
    {
      id: 5,
      text: "You borrow for a game console. Default on loan?",
      options: [
        { id: "debt", text: "Debt accumulates", emoji: "📉", description: "Harms credit", isCorrect: true },
        { id: "fine", text: "No problem", emoji: "😊", description: "Unrealistic", isCorrect: false }
      ],
      reward: 7
    }
  ];

  const handleChoice = (selectedChoice) => {
    resetFeedback();
    const stage = stages[currentStage];
    const isCorrect = stage.options.find(opt => opt.id === selectedChoice)?.isCorrect;

    setChoices([...choices, { stageId: stage.id, choice: selectedChoice, isCorrect }]);
    if (isCorrect) {
      setCoins(prev => prev + stage.reward);
      showCorrectAnswerFeedback(stage.reward, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage(prev => prev + 1), 800);
    } else {
      const correctAnswers = [...choices, { stageId: stage.id, choice: selectedChoice, isCorrect }].filter(c => c.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentStage(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => navigate("/student/finance/teen");

  return (
    <GameShell
      title="Borrowing Story"
      subtitle={`Stage ${currentStage + 1} of ${stages.length}`}
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleNext : null}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-teens-115"
      gameType="finance"
    >
      <div className="space-y-8 text-white">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Stage {currentStage + 1}/{stages.length}</span>
              <span className="text-yellow-400 font-bold">Coins: {coins}</span>
            </div>
            <p className="text-xl mb-6">{stages[currentStage].text}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stages[currentStage].options.map(opt => (
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
                <h3 className="text-3xl font-bold mb-4">Borrowing Story Star!</h3>
                <p className="text-white/90 text-lg mb-6">You got {finalScore} out of 5 correct!</p>
                <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
                  +{coins} Coins
                </div>
                <p className="text-white/80 mt-4">Lesson: Borrowing leads to debt if not repaid!</p>
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

export default BorrowingStory;