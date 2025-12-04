import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DailyMatchPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-94";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      category: "Sleep",
      question: "What does SLEEP give you?",
      options: [
        { id: "a", text: "Energy", emoji: "⚡", isCorrect: true, explanation: "Sleep recharges your battery!" },
        { id: "b", text: "Hunger", emoji: "🍔", isCorrect: false, explanation: "Sleep doesn't make you hungry." },
        { id: "c", text: "Dirt", emoji: "💩", isCorrect: false, explanation: "Sleep is clean!" }
      ]
    },
    {
      id: 2,
      category: "Food",
      question: "What does HEALTHY FOOD give you?",
      options: [
        { id: "b", text: "Sleepiness", emoji: "😴", isCorrect: false, explanation: "Food gives fuel, not sleep." },
        { id: "a", text: "Strength", emoji: "💪", isCorrect: true, explanation: "Nutrients build strong muscles." },
        { id: "c", text: "Cavities", emoji: "🦷", isCorrect: false, explanation: "Only sugary food causes cavities." }
      ]
    },
    {
      id: 3,
      category: "Exercise",
      question: "What does EXERCISE do?",
      options: [
        { id: "c", text: "Makes you weak", emoji: "🥀", isCorrect: false, explanation: "Exercise builds you up!" },
        { id: "b", text: "Makes you sick", emoji: "🤢", isCorrect: false, explanation: "Exercise fights sickness." },
        { id: "a", text: "Keeps heart healthy", emoji: "❤️", isCorrect: true, explanation: "Your heart loves to move!" }
      ]
    },
    {
      id: 4,
      category: "Reading",
      question: "What does READING give you?",
      options: [
        { id: "b", text: "Muscles", emoji: "💪", isCorrect: false, explanation: "Reading exercises your brain." },
        { id: "a", text: "Knowledge", emoji: "🧠", isCorrect: true, explanation: "Books make you smarter!" },
        { id: "c", text: "Dirty hands", emoji: "👐", isCorrect: false, explanation: "Books are clean fun." }
      ]
    },
    {
      id: 5,
      category: "Hygiene",
      question: "What does BATHING do?",
      options: [
        { id: "c", text: "Makes you tired", emoji: "🥱", isCorrect: false, explanation: "Bathing wakes you up!" },
        { id: "b", text: "Makes you hungry", emoji: "🍽️", isCorrect: false, explanation: "Bathing is for cleaning." },
        { id: "a", text: "Removes germs", emoji: "🧼", isCorrect: true, explanation: "Soap and water wash germs away." }
      ]
    }
  ];

  const handleOptionSelect = (option) => {
    if (option.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);

      setTimeout(() => {
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(prev => prev + 1);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/sleep-story");
  };

  const currentP = puzzles[currentPuzzle];

  return (
    <GameShell
      title="Daily Match Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={puzzles.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">{currentP.question}</h3>
            <p className="text-white/80">Match the activity to the benefit!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentP.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className="bg-white/10 hover:bg-white/20 p-6 rounded-xl border border-white/20 transition-all transform hover:scale-105 flex flex-col items-center gap-4 group"
              >
                <div className="text-6xl group-hover:scale-110 transition-transform">
                  {option.emoji}
                </div>
                <div className="text-white font-bold text-xl text-center">
                  {option.text}
                </div>
                <p className="text-white/70 text-sm text-center">{option.explanation}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default DailyMatchPuzzle;
