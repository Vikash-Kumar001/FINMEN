import React, { useState } from "react";
import GameShell, { GameCard, FeedbackBubble, Confetti, ScoreFlash, LevelCompleteHandler } from "./GameShell";

const playSound = (type) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (type === "clap") {
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
  } else if (type === "pause") {
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
  }

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.2);
};

const PatternMusicGame = () => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [flashPoints, setFlashPoints] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [userSequence, setUserSequence] = useState([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false); // ✅ new state

  const patterns = [
    { id: 1, sequence: ["clap", "clap", "pause"], rewardPoints: 5 },
    { id: 2, sequence: ["clap", "pause", "clap"], rewardPoints: 5 },
    { id: 3, sequence: ["clap", "clap", "clap", "pause"], rewardPoints: 5 },
    { id: 4, sequence: ["pause", "clap", "clap"], rewardPoints: 5 },
    { id: 5, sequence: ["clap", "pause", "pause", "clap"], rewardPoints: 5 },
  ];

  const currentPattern = patterns[currentLevelIndex];

  const playPattern = () => {
    currentPattern.sequence.forEach((action, idx) => {
      setTimeout(() => playSound(action), idx * 600);
    });
    setHasPlayed(true); // ✅ mark as played
  };

  const handleUserTap = (tap) => {
    if (!hasPlayed) return; // ❌ block tap if rhythm not played

    const newSequence = [...userSequence, tap];
    setUserSequence(newSequence);

    if (newSequence.length === currentPattern.sequence.length) {
      if (JSON.stringify(newSequence) === JSON.stringify(currentPattern.sequence)) {
        setScore((prev) => prev + currentPattern.rewardPoints);
        setFlashPoints(currentPattern.rewardPoints);
        setFeedback({ message: "Great! You matched the rhythm!", type: "correct" });
        setShowConfetti(true);
        setTimeout(() => setFlashPoints(null), 1000);
      } else {
        setFeedback({ message: "Oops! That didn’t match.", type: "wrong" });
      }
    }
  };

  const handleNextLevel = () => {
    setShowConfetti(false);
    setHasPlayed(false); // ✅ reset play button
    setUserSequence([]);
    setFeedback({ message: "", type: "" });

    if (currentLevelIndex < patterns.length - 1) {
      setCurrentLevelIndex((i) => i + 1);
    } else {
      setShowGameOver(true);
    }
  };

  return (
    <GameShell
      gameId="pattern-music-game"
      gameType="ai"
      totalLevels={patterns.length}
      title="Pattern Music Game"
      subtitle="Listen to the rhythm and repeat it"
      rightSlot={
        <div className="bg-white/20 px-3 py-2 rounded-xl text-white font-bold shadow-md">
          Score: {score} ⭐ {currentLevelIndex + 1}/{patterns.length}
        </div>
      }
      onNext={handleNextLevel}
      nextEnabled={feedback.message !== ""}
      showGameOver={showGameOver}
      score={score}
    >
      {showConfetti && <Confetti />}
      {flashPoints && <ScoreFlash points={flashPoints} />}

      <LevelCompleteHandler gameId="pattern-music-game" gameType="ai" levelNumber={currentLevelIndex + 1}>
        <GameCard>
          <p className="text-lg text-white font-semibold">Hear and repeat this rhythm:</p>
          <button
            onClick={playPattern}
            disabled={hasPlayed} // ✅ disable after clicked
            className={`mt-3 px-4 py-2 rounded-xl font-bold shadow cursor-pointer ${hasPlayed ? "bg-gray-400" : "bg-yellow-400"
              }`}
          >
            🔊 Play Rhythm
          </button>
        </GameCard>
      </LevelCompleteHandler>

      <div className="flex gap-6 justify-center mt-6">
        <button
          onClick={() => handleUserTap("clap")}
          disabled={!hasPlayed} // ❌ disable until rhythm played
          className={`px-6 py-4 bg-white text-black font-bold rounded-xl shadow-md cursor-pointer ${!hasPlayed ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          👏 Clap
        </button>
        <button
          onClick={() => handleUserTap("pause")}
          disabled={!hasPlayed} // ❌ disable until rhythm played
          className={`px-6 py-4 bg-white text-black font-bold rounded-xl shadow-md cursor-pointer ${!hasPlayed ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          ⏸ Pause
        </button>
      </div>

      {feedback.message && <FeedbackBubble message={feedback.message} type={feedback.type} />}
    </GameShell>
  );
};

export default PatternMusicGame;
