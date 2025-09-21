import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti } from "./GameShell";

const PatternMusicGame2 = () => {
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
        message: `Wrong! The correct answer is: ${currentPattern.correctAnswer}`,
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
      title="Pattern Music Game 2"
      subtitle="Guess the next note in the rhythm!"
      onNext={handleNextLevel}
      nextEnabled={feedback.message && (feedback.type === "correct" || (feedback.type === "wrong" && isOptionDisabled))}
    >
      {showConfetti && <Confetti />}

      <GameCard>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {currentPattern.sequence.map((note, idx) => (
            <span key={idx} style={{ fontSize: "2.5rem" }}>{note}</span>
          ))}
        </div>
        <p className="text-white/80 font-bold text-lg">What comes next?</p>
      </GameCard>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {currentPattern.options.map((option, idx) => (
          <OptionButton
            key={idx}
            option={option}
            onClick={handleOptionClick}
            selected={selectedOption}
            disabled={isOptionDisabled}
            feedback={feedback}
          />
        ))}
      </div>

      {feedback.message && <FeedbackBubble message={feedback.message} type={feedback.type} />}

      <div className="mt-6 text-white font-bold">
        Score: {score} | Level {currentLevelIndex + 1}/{patterns.length}
      </div>
    </GameShell>
  );
};

export default PatternMusicGame2;
