import React, { useState, useEffect } from "react";
import GameShell, {
  GameCard,
  OptionButton,
  FeedbackBubble,
  Confetti,
  ScoreFlash,
  LevelCompleteHandler, // ✅ import LevelCompleteHandler
} from "./GameShell";

const CatOrDog = () => {
  const [levels, setLevels] = useState([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [flashPoints, setFlashPoints] = useState(null); // ✅ Score flash

  const TOTAL_LEVELS = 5;

  useEffect(() => {
    const loadLevels = async () => {
      const newLevels = [];

      for (let i = 0; i < TOTAL_LEVELS; i++) {
        const isCat = Math.random() < 0.5;

        if (isCat) {
          newLevels.push({
            id: i,
            image: `https://placecats.com/300/300`,
            correctAnswer: "cat",
            rewardPoints: 2,
          });
        } else {
          try {
            const res = await fetch("https://dog.ceo/api/breeds/image/random");
            const data = await res.json();
            if (data.status === "success" && data.message) {
              newLevels.push({
                id: i,
                image: data.message,
                correctAnswer: "dog",
                rewardPoints: 2,
              });
            } else {
              newLevels.push({
                id: i,
                image: "https://place.dog/300/300",
                correctAnswer: "dog",
                rewardPoints: 2,
              });
            }
          } catch (err) {
            console.error("Error fetching dog image", err);
            newLevels.push({
              id: i,
              image: "https://place.dog/300/300",
              correctAnswer: "dog",
              rewardPoints: 2,
            });
          }
        }
      }

      setLevels(newLevels);
    };

    loadLevels();
  }, []);

  const currentLevel = levels[currentLevelIndex];

  const handleOptionClick = (option) => {
    if (isOptionDisabled || !currentLevel) return;
    setSelectedOption(option);
    setIsOptionDisabled(true);

    if (option === currentLevel.correctAnswer) {
      setScore((prev) => prev + currentLevel.rewardPoints);
      setFlashPoints(currentLevel.rewardPoints); // ✅ trigger flash
      setFeedback({ message: "Great! Correct!", type: "correct" });
      setShowConfetti(true);

      // Hide flash after 1s
      setTimeout(() => setFlashPoints(null), 1000);
    } else {
      setFeedback({
        message: `Oops! That was a ${currentLevel.correctAnswer}.`,
        type: "wrong",
      });
      setShowConfetti(false);
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    if (currentLevelIndex < TOTAL_LEVELS - 1) {
      setCurrentLevelIndex((prev) => prev + 1);
      setFeedback({ message: "", type: "" });
      setSelectedOption(null);
      setIsOptionDisabled(false);
    } else {
      setGameOver(true); // trigger centralized GameOverModal
    }
  };

  if (levels.length < TOTAL_LEVELS) {
    return <p className="text-white">Loading images...</p>;
  }

  return (
    <GameShell
      title="Cat or Dog"
      subtitle="Click the right animal!"
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{levels.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={!!feedback.message}
      showGameOver={gameOver} // centralized modal
      score={score} // pass score
      gameId="cat-or-dog" // ✅ Add game ID for heal coins
      gameType="ai" // ✅ Add game type
      totalLevels={TOTAL_LEVELS} // ✅ Add total levels
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />} {/* ✅ Score flash */}

      <LevelCompleteHandler
        gameId="cat-or-dog"
        gameType="ai"
        levelNumber={currentLevelIndex + 1}
        levelScore={selectedOption === currentLevel.correctAnswer ? currentLevel.rewardPoints : 0}
        maxLevelScore={currentLevel.rewardPoints}
      >
        <GameCard>
          <img
            src={currentLevel.image}
            alt="animal"
            className="w-48 h-48 object-cover rounded-xl mx-auto mb-6 shadow-lg"
          />
          <p className="text-lg font-bold text-white text-center">
            Is this a cat or a dog?
          </p>
        </GameCard>
      </LevelCompleteHandler>

      <div className="flex flex-wrap justify-center gap-6 mt-4">
        <OptionButton
          option="cat"
          selected={selectedOption}
          feedback={feedback}
          disabled={isOptionDisabled}
          onClick={handleOptionClick}
        />
        <OptionButton
          option="dog"
          selected={selectedOption}
          feedback={feedback}
          disabled={isOptionDisabled}
          onClick={handleOptionClick}
        />
      </div>

      {feedback.message && (
        <FeedbackBubble message={feedback.message} type={feedback.type} />
      )}
    </GameShell>
  );
};

export default CatOrDog;
