import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { PenSquare } from "lucide-react";

const HealthyFoodJournal = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const gameId = "health-female-kids-17";

  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stages = [
    {
      question: 'Write: "My favorite fruit is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Vegetables make me strong because ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I drink water instead of soda because ___."',
      minLength: 10,
    },
    {
      question: 'Write: "A healthy breakfast I like is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Eating healthy makes me feel ___."',
      minLength: 10,
    },
  ];

  const handleSubmit = () => {
    if (showResult) return;

    resetFeedback();
    const entryText = entry.trim();

    if (entryText.length >= stages[currentStage].minLength) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);

      const isLastQuestion = currentStage === stages.length - 1;

      setTimeout(() => {
        if (isLastQuestion) {
          setShowResult(true);
          showAnswerConfetti();
        } else {
          setEntry("");
          setCurrentStage((prev) => prev + 1);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  return (
    <GameShell
      title="Journal of Healthy Food"
      subtitle={!showResult ? `Entry ${currentStage + 1} of ${stages.length}: Food Reflection` : "Journal Complete!"}
      coins={score}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId={gameId}
      gameType="health-female"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      onNext={handleNext}
      showConfetti={showResult}
      backPath="/games/health-female/kids"
    >
      <div className="text-center text-white space-y-8">
        {!showResult && stages[currentStage] && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="bg-emerald-500/20 p-4 rounded-full inline-block mb-4">
              <PenSquare className="w-10 h-10 text-emerald-300" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
            <p className="text-white/60 text-sm mb-4">
              Write at least {stages[currentStage].minLength} characters
            </p>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Write your thoughts here..."
              className="w-full md:w-2/3 h-40 p-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition-all"
              disabled={showResult}
            />
            <div className="mt-2 text-white/50 text-sm">
              {entry.trim().length}/{stages[currentStage].minLength} characters
            </div>
            <button
              onClick={handleSubmit}
              className={`mt-6 px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-lg ${entry.trim().length >= stages[currentStage].minLength
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white cursor-pointer'
                  : 'bg-gray-500/50 text-gray-300 cursor-not-allowed opacity-50'
                }`}
              disabled={entry.trim().length < stages[currentStage].minLength}
            >
              {currentStage === stages.length - 1 ? 'Finish Journal' : 'Save & Continue'}
            </button>
          </div>
        )}

        {showResult && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-6">🥗</div>
            <h2 className="text-3xl font-bold mb-4">Journal Updated!</h2>
            <p className="text-xl mb-6">You're making great food choices!</p>
            <div className="text-2xl font-bold text-yellow-400 mb-8">Earned {score} Coins!</div>
            <p className="text-white/60">Come back anytime to write more!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HealthyFoodJournal;