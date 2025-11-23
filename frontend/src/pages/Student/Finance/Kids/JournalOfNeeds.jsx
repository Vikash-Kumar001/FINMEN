import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfNeeds = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [text, setText] = useState("");
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Write: "One need I always spend on is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Spending on needs makes me feel ___."',
      minLength: 10,
    },
    {
      question: 'Write: "A need I prioritized over a want was ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I learned ___ about choosing needs over wants."',
      minLength: 10,
    },
    {
      question: 'Write: "Focusing on needs taught me ___ about money."',
      minLength: 10,
    },
  ];

  const handleSubmit = () => {
    resetFeedback();
    if (text.trim().length >= stages[currentStage].minLength) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
      if (currentStage < stages.length - 1) {
        setTimeout(() => {
          setText("");
          setCurrentStage((prev) => prev + 1);
        }, 800);
      } else {
        setTimeout(() => setShowResult(true), 800);
      }
    }
  };

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Journal of Needs"
      subtitle="Reflect on prioritizing your needs!"
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
      gameId="finance-kids-67"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full max-w-xl p-4 rounded-xl text-black text-lg bg-white/90"
            />
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105 mt-4"
              disabled={text.trim().length < stages[currentStage].minLength}
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-6xl mb-4">📝🎉</div>
            <h3 className="text-3xl font-bold mb-4">Needs Expert!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for prioritizing needs!
            </p>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Needs come first for smart spending!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfNeeds;