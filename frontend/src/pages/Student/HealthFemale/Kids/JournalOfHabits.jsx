import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { PenSquare } from "lucide-react";

const JournalOfHabits = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-97";

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Write: "One habit I want to improve is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I can build healthy habits by ___."',
      minLength: 10,
    },
    {
      question: 'Write: "A habit I am proud of is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "My goal for tomorrow is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I will stick to my routine by ___."',
      minLength: 10,
    },
  ];

  const handleSubmit = () => {
    if (showResult) return; // Prevent multiple submissions

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

  const finalScore = score;

  return (
    <GameShell
      title="Journal of Habits"
      subtitle={!showResult ? `Entry ${currentStage + 1} of ${stages.length}: Reflect on your daily habits!` : "Journal Complete!"}
      currentLevel={97}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="health-female"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      onNext={handleNext}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-8">
        {!showResult && stages[currentStage] && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <PenSquare className="mx-auto mb-4 w-10 h-10 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
            <p className="text-white/60 text-sm mb-4">
              Write at least {stages[currentStage].minLength} characters
            </p>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full max-w-xl p-4 rounded-xl text-black text-lg bg-white/90"
              disabled={showResult}
            />
            <div className="mt-2 text-white/50 text-sm">
              {entry.trim().length}/{stages[currentStage].minLength} characters
            </div>
            <button
              onClick={handleSubmit}
              className={`mt-4 px-8 py-4 rounded-full text-lg font-semibold transition-transform ${entry.trim().length >= stages[currentStage].minLength && !showResult
                  ? 'bg-green-500 hover:bg-green-600 hover:scale-105 text-white cursor-pointer'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
                }`}
              disabled={entry.trim().length < stages[currentStage].minLength || showResult}
            >
              {currentStage === stages.length - 1 ? 'Submit Final Entry' : 'Submit & Continue'}
            </button>
          </div>
        )}

        {showResult && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-6">📖</div>
            <h2 className="text-3xl font-bold mb-4">Journal Complete!</h2>
            <p className="text-xl mb-6">You've thought carefully about your healthy habits!</p>
            <div className="text-2xl font-bold text-yellow-400 mb-8">Earned {score} Coins!</div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfHabits;