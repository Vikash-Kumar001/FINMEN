import React, { useState } from "react";
import GameShell, {
  GameCard,
  OptionButton,
  FeedbackBubble,
  Confetti,
  ScoreFlash,
} from "./GameShell";

const SelfDrivingCarGame = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [flashPoints, setFlashPoints] = useState(null); // ✅ Score flash

  const trafficLights = [
    { id: 1, light: "🔴", correctAction: "brake" },
    { id: 2, light: "🟢", correctAction: "go" },
    { id: 3, light: "🟡", correctAction: "slow down" },
    { id: 4, light: "🔴", correctAction: "brake" },
    { id: 5, light: "🟢", correctAction: "go" },
    { id: 6, light: "🟡", correctAction: "slow down" },
  ];

  const currentLight = trafficLights[currentIndex];

  const handleAction = (action) => {
    if (isOptionDisabled) return;
    setSelectedOption(action);
    setIsOptionDisabled(true);

    if (action === currentLight.correctAction) {
      setScore((prev) => prev + 5);
      setFlashPoints(5); // ✅ trigger score flash
      setFeedback({ message: "Great! Correct!", type: "correct" });
      setShowConfetti(true);

      // remove flash after 1 second
      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      let correctMsg =
        currentLight.correctAction === "brake"
          ? "Oops! You should have braked!"
          : currentLight.correctAction === "go"
            ? "Oops! You should have gone!"
            : "Oops! You should have slowed down!";
      setFeedback({ message: correctMsg, type: "wrong" });
      setShowConfetti(false);
    }
  };

  const handleNext = () => {
    setShowConfetti(false);

    if (currentIndex < trafficLights.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFeedback({ message: "", type: "" });
      setSelectedOption(null);
      setIsOptionDisabled(false);
    } else {
      setShowGameOver(true);
    }
  };

  return (
    <GameShell
      title="Self-Driving Car Game"
      subtitle="Car stops for red, slows for yellow, goes for green."
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentIndex + 1}/{trafficLights.length}
        </div>
      }
      showGameOver={showGameOver}
      score={score}
      onNext={handleNext}
      nextEnabled={!!feedback.message}
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />} {/* ✅ Score flash */}

      <GameCard>
        <div
          style={{
            fontSize: "clamp(80px, 15vw, 120px)",
            marginBottom: "16px",
          }}
        >
          {currentLight?.light}
        </div>
        <p className="text-lg font-bold text-white">What should the car do?</p>
      </GameCard>

      {/* Normal buttons using OptionButton */}
      <div className="flex justify-center gap-6 flex-wrap">
        <OptionButton
          option="Brake"
          onClick={() => handleAction("brake")}
          selected={selectedOption}
          disabled={isOptionDisabled}
          feedback={feedback}
        />
        <OptionButton
          option="Go"
          onClick={() => handleAction("go")}
          selected={selectedOption}
          disabled={isOptionDisabled}
          feedback={feedback}
        />
        <OptionButton
          option="Slow Down"
          onClick={() => handleAction("slow down")}
          selected={selectedOption}
          disabled={isOptionDisabled}
          feedback={feedback}
        />
      </div>

      {feedback.message && (
        <FeedbackBubble message={feedback.message} type={feedback.type} />
      )}
    </GameShell>
  );
};

export default SelfDrivingCarGame;
