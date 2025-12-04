import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HygieneJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-7";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Write: "One habit that keeps me clean is ___."',
      minLength: 10,
    },
    {
      question: 'Write: "I wash my hands because ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Brushing my teeth makes me feel ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Taking a bath helps me to ___."',
      minLength: 10,
    },
    {
      question: 'Write: "Good hygiene is important because ___."',
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

      // Show feedback for 1.5 seconds, then move to next question or show results
      setTimeout(() => {
        if (isLastQuestion) {
          // This is the last question (5th), show results
          setShowResult(true);
        } else {
          // Move to next question
          setEntry("");
          setCurrentStage((prev) => prev + 1);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Journal of Hygiene"
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}: Reflect on your hygiene!` : "Journal Complete!"}
      currentLevel={currentStage + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={score}
      gameId="health-male-kids-7"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score === 5}>
      <div className="text-center text-white space-y-8">
        {!showResult && stages[currentStage] && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">📝</div>
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
      </div>
    </GameShell>
  );
};

export default HygieneJournal;
