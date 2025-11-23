import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalFirstBank = () => {
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
      question: 'Write: "If I go to a bank, I want to ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I think a bank helps people by ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Saving money in a bank makes me feel ___."',
      minLength: 10,
    },
    {
      question: 'Write: "One thing I learned about banks is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Visiting a bank taught me ___ about money."',
      minLength: 10,
    },
  ];

  const submitJournal = () => {
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
      title="Journal of First Bank Visit"
      subtitle="Reflect on your bank experience!"
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
      gameId="finance-kids-87"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-6">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-4xl mb-4">🏦</div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your answer..."
              className="w-full p-4 rounded-lg text-black bg-white/90"
            />
            <button
              onClick={submitJournal}
              className="bg-green-500 px-8 py-4 rounded-full text-white font-bold hover:scale-105 transition-transform mt-4"
              disabled={text.trim().length < stages[currentStage].minLength}
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-3" />
            <h3 className="text-3xl font-bold mb-4">Bank Journal Star!</h3>
            <p className="text-white/90 text-xl mb-6">
              You earned {coins} out of 5 for great reflections!
            </p>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Banks help you manage money wisely!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalFirstBank;