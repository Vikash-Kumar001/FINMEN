import React, { useState } from "react";
import GameShell, { GameCard, OptionButton, FeedbackBubble, Confetti, ScoreFlash } from "./GameShell";

const SpamVsNotSpam = () => {
  const emails = [
    { id: 1, subject: "WIN $1000 NOW!!!", correctAnswer: "spam" },
    { id: 2, subject: "Your order confirmation", correctAnswer: "not spam" },
    { id: 3, subject: "URGENT: Click here to claim prize", correctAnswer: "spam" },
    { id: 4, subject: "Homework update from school", correctAnswer: "not spam" },
    { id: 5, subject: "Free tickets for you!", correctAnswer: "spam" },
    { id: 6, subject: "Your monthly newsletter", correctAnswer: "not spam" },
    { id: 7, subject: "Congratulations, you've won!", correctAnswer: "spam" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [flashPoints, setFlashPoints] = useState(null); // ✅ Score flash

  const currentEmail = emails[currentIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled) return;
    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentEmail.correctAnswer) {
      setScore((prev) => prev + 2); // +2 points per correct answer
      setFlashPoints(2);             // Trigger flash animation
      setFeedback({ message: "Great! Correct!", type: "correct" });
      setShowConfetti(true);
    } else {
      setFeedback({
        message: `Oops! Correct answer: ${currentEmail.correctAnswer}`,
        type: "wrong",
      });
      setShowConfetti(false);
    }

    // Remove flash after 1 second
    setTimeout(() => setFlashPoints(null), 1000);
  };

  const handleNext = () => {
    setShowConfetti(false);

    if (currentIndex < emails.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setFeedback({ message: "", type: "" });
      setIsOptionDisabled(false);
    } else {
      setShowGameOver(true); // 🎉 trigger congratulations modal
    }
  };

  return (
    <GameShell
      title="Spam vs Not Spam"
      subtitle="Sort emails correctly"
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentIndex + 1}/{emails.length}
        </div>
      }
      onNext={handleNext}
      nextEnabled={!!feedback.message}
      showGameOver={showGameOver}
      score={score}
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />} {/* ✅ Score flash */}

      <GameCard>
        <div style={{ fontSize: "clamp(16px, 3.5vw, 24px)", fontWeight: "bold", marginBottom: "12px", color: "white" }}>
          📧 {currentEmail.subject}
        </div>
        <p style={{ fontWeight: "bold", fontSize: "clamp(16px, 3vw, 24px)", color: "#d6c9ecff" }}>
          Is this spam or not spam?
        </p>
      </GameCard>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {["spam", "not spam"].map((option) => (
          <OptionButton
            key={option}
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

export default SpamVsNotSpam;
