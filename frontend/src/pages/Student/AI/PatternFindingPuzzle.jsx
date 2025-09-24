import React, { useState } from "react";
import GameShell, {
  GameCard,
  OptionButton,
  FeedbackBubble,
  Confetti,
  ScoreFlash,
  LevelCompleteHandler,
} from "./GameShell";

const PatternFindingPuzzle = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [flashPoints, setFlashPoints] = useState(null); // ✅ Score flash

  const puzzles = [
    { id: 1, sequence: ["1", "2", "3", "?"], correctAnswer: "4", options: ["4", "5", "6", "7"], rewardPoints: 5 },
    { id: 2, sequence: ["A", "C", "E", "?"], correctAnswer: "G", options: ["F", "G", "H", "I"], rewardPoints: 5 },
    { id: 3, sequence: ["2", "4", "8", "?"], correctAnswer: "16", options: ["12", "14", "16", "18"], rewardPoints: 5 },
    { id: 4, sequence: ["🔴", "🟡", "🔴", "🟡", "?"], correctAnswer: "🔴", options: ["🔴", "🟡", "🔵", "🟢"], rewardPoints: 5 },
    { id: 5, sequence: ["1", "4", "9", "?"], correctAnswer: "16", options: ["12", "14", "16", "18"], rewardPoints: 5 },
  ];

  const currentPuzzle = puzzles[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentPuzzle.correctAnswer) {
      setScore((prev) => prev + currentPuzzle.rewardPoints);
      setFlashPoints(currentPuzzle.rewardPoints); // ✅ trigger score flash
      setFeedback({ message: "Great! Pattern found!", type: "correct" });
      setShowConfetti(true);

      // remove flash after 1 second
      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({ message: `Wrong! Correct answer: ${currentPuzzle.correctAnswer}`, type: "wrong" });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    if (currentLevelIndex < puzzles.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1);
      setFeedback({ message: "", type: "" });
      setSelectedOption(null);
      setIsOptionDisabled(false);
    } else {
      setShowGameOver(true); // 🎉 triggers congratulations modal from GameShell
    }
  };

  return (
    <GameShell
      gameId="pattern-finding-puzzle"
      gameType="ai"
      totalLevels={puzzles.length}
      title="Pattern Finding Puzzle"
      subtitle="Find the next in the sequence"
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{puzzles.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={feedback.message && (feedback.type === "correct" || isOptionDisabled)}
      showGameOver={showGameOver} // 🎉 hook into GameShell modal
      score={score}              // 🎉 pass final score to modal
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />} {/* ✅ Score flash */}

      <LevelCompleteHandler gameId="pattern-finding-puzzle" gameType="ai" levelNumber={currentLevelIndex + 1}>
        <GameCard>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {currentPuzzle.sequence.map((item, i) => (
              <div
                key={i}
                className="text-xl text-white md:text-3xl font-bold px-4 py-2 bg-white/20 rounded-lg border border-white/30"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="text-white/80 font-semibold">What comes next?</p>
        </GameCard>
      </LevelCompleteHandler>

      <div className="flex flex-wrap justify-center gap-4">
        {currentPuzzle.options.map((option, i) => (
          <OptionButton
            key={i}
            option={option}
            onClick={handleOptionClick}
            selected={selectedOption}
            disabled={isOptionDisabled}
            feedback={feedback}
          />
        ))}
      </div>

      {feedback.message && <FeedbackBubble message={feedback.message} type={feedback.type} />}
    </GameShell>
  );
};

export default PatternFindingPuzzle;
