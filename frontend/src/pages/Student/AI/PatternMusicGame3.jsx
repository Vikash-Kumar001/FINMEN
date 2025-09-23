import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, LevelCompleteHandler } from "./GameShell";

const PatternMusicGame3 = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const patterns = [
    {
      id: 1,
      sequence: ["🎵", "🎶", "🎵", "🎶"],
      correctAnswer: "🎵",
      options: ["🎵", "🎶", "🎼", "🎹"],
      rewardPoints: 5
    },
    {
      id: 2,
      sequence: ["🎹", "🎹", "🎸", "🎹", "🎹"],
      correctAnswer: "🎸",
      options: ["🎹", "🎸", "🎺", "🎻"],
      rewardPoints: 5
    },
    {
      id: 3,
      sequence: ["🎺", "🎷", "🎺", "🎷"],
      correctAnswer: "🎺",
      options: ["🎺", "🎷", "🎸", "🎹"],
      rewardPoints: 5
    },
    {
      id: 4,
      sequence: ["🎼", "🎼", "🎼", "🎵"],
      correctAnswer: "🎼",
      options: ["🎼", "🎵", "🎶", "🎹"],
      rewardPoints: 5
    },
    {
      id: 5,
      sequence: ["🎻", "🎸", "🎻", "🎸"],
      correctAnswer: "🎻",
      options: ["🎻", "🎸", "🎹", "🎺"],
      rewardPoints: 5
    },
  ];

  const currentPattern = patterns[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;

    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentPattern.correctAnswer) {
      setFeedback({ message: "Great! Perfect rhythm!", type: "correct" });
      setScore(prev => prev + currentPattern.rewardPoints);
      setShowConfetti(true);
    } else {
      setFeedback({
        message: `Wrong! Correct: ${currentPattern.correctAnswer}`,
        type: "wrong"
      });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    if (currentLevelIndex < patterns.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setFeedback({ message: "", type: "" });
      setSelectedOption(null);
      setIsOptionDisabled(false);
    } else {
      alert(`Game Over! Your final score is: ${score}`);
      setCurrentLevelIndex(0);
      setScore(0);
      setFeedback({ message: "", type: "" });
      setSelectedOption(null);
      setIsOptionDisabled(false);
    }
  };

  return (
    <GameShell
      gameId="pattern-music-game-3"
      gameType="ai"
      totalLevels={patterns.length}
      title="Pattern Music Game 3"
      subtitle="What comes next in the rhythm?"
      onNext={handleNextLevel}
      nextEnabled={!!feedback.message}
    >
      {/* Confetti */}
      {showConfetti && <Confetti />}

      <LevelCompleteHandler gameId="pattern-music-game-3" gameType="ai" levelNumber={currentLevelIndex + 1}>
        <GameCard>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {currentPattern.sequence.map((note, i) => (
              <div
                key={i}
                className="text-4xl p-4 bg-white/20 rounded-xl border border-white/30 font-bold"
              >
                {note}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {currentPattern.options.map(option => (
              <OptionButton
                key={option}
                option={option}
                selected={selectedOption}
                disabled={isOptionDisabled}
                feedback={feedback}
                onClick={handleOptionClick}
              />
            ))}
          </div>
          {feedback.message && <FeedbackBubble message={feedback.message} type={feedback.type} />}
        </GameCard>
      </LevelCompleteHandler>

      {/* Score Tracker */}
      <div className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 font-bold text-white shadow-md">
        Score: {score} | Level: {currentLevelIndex + 1}/{patterns.length}
      </div>
    </GameShell>
  );
};

export default PatternMusicGame3;
