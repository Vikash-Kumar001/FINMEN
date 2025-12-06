import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { PenSquare } from "lucide-react";

const BodyChangesJournal = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const gameId = "health-female-kids-86";

  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stages = [
    {
      question: 'Write: "I am growing taller like a ___."',
      minLength: 10,
    },
    {
      question: 'Write: "My favorite healthy food is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I like my body because ___."',
      minLength: 10,
    },
    {
      question: 'Write: "When I have questions, I ask ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Being a girl is ___."',
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
      title="Body Changes Journal"
      subtitle={!showResult ? `Entry ${currentStage + 1} of ${stages.length}: My Growing Body` : "Journal Complete!"}
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
            <div className="bg-pink-500/20 p-4 rounded-full inline-block mb-4">
              <PenSquare className="w-10 h-10 text-pink-300" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <p className="text-white/70 mb-4">Score: {score}/{stages.length}</p>
            <p className="text-white/60 text-sm mb-4">
              Write at least {stages[currentStage].minLength} characters
            </p>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Start writing here..."
              className="w-full md:w-2/3 h-40 p-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none transition-all"
              disabled={showResult}
            />
            <div className="mt-2 text-white/50 text-sm">
              {entry.trim().length}/{stages[currentStage].minLength} characters
            </div>
            <button
              onClick={handleSubmit}
              className={`mt-6 px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-lg ${entry.trim().length >= stages[currentStage].minLength
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white cursor-pointer'
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
            <div className="text-6xl mb-6">📔</div>
            <h2 className="text-3xl font-bold mb-4">Journal Updated!</h2>
            <p className="text-xl mb-6">Your body is amazing!</p>
            <div className="text-2xl font-bold text-yellow-400 mb-8">Earned {score} Coins!</div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BodyChangesJournal;