import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalFutureInvesting = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [entries, setEntries] = useState(["", "", "", "", ""]);

  const stages = [
    { id: 1, prompt: "One investment I’d like to try when older is ___." },
    { id: 2, prompt: "One reason to invest in the future is ___." },
    { id: 3, prompt: "One investment risk I’d consider is ___." },
    { id: 4, prompt: "One way to learn about investing is ___." },
    { id: 5, prompt: "One benefit of investing early is ___." }
  ];

  const handleSubmit = () => {
    resetFeedback();
    if (entries[currentStage].trim() !== "") {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false, "Please enter a response.");
    }

    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage(prev => prev + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleInputChange = (e) => {
    const newEntries = [...entries];
    newEntries[currentStage] = e.target.value;
    setEntries(newEntries);
  };

  const handleFinish = () => navigate("/student/finance/teen");

  return (
    <GameShell
      title="Journal of Future Investing"
      subtitle={`Stage ${currentStage + 1} of ${stages.length}`}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      showGameOver={showResult}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId="finance-teens-137"
      gameType="journal"
    >
      <div className="text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-2xl font-bold mb-4">Stage {currentStage + 1}</h3>
            <p className="text-lg mb-6">{stages[currentStage].prompt}</p>
            <textarea
              className="w-full border rounded-lg p-3 mb-4 bg-white/5 text-white placeholder-white/50"
              value={entries[currentStage]}
              onChange={handleInputChange}
              placeholder="Type your response here..."
            />
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold transition-transform hover:scale-105"
            >
              Submit
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h3 className="text-3xl font-bold mb-4">Future Investing Journal Star!</h3>
            <p className="text-white/90 text-lg mb-6">You completed {score} out of 5 stages!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{score} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Plan for future investments!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalFutureInvesting;