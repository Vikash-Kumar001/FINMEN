import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneToolsPuzzle44 = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-44";

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
      category: "Teeth",
      question: "Tool for TEETH?",
      options: [
        { id: "a", text: "Toothbrush", emoji: "🪥", isCorrect: true, explanation: "Cleans teeth." },
        { id: "b", text: "Hairbrush", emoji: "🖌️", isCorrect: false, explanation: "For hair." },
        { id: "c", text: "Spoon", emoji: "🥄", isCorrect: false, explanation: "For eating." }
      ]
    },
    {
      id: 2,
      category: "Hair",
      question: "Tool for HAIR?",
      options: [
        { id: "b", text: "Soap", emoji: "🧼", isCorrect: false, explanation: "Shampoo is better for hair." },
        { id: "a", text: "Comb", emoji: "💇", isCorrect: true, explanation: "Detangles hair." },
        { id: "c", text: "Fork", emoji: "🍴", isCorrect: false, explanation: "Not a dinglehopper." }
      ]
    },
    {
      id: 3,
      category: "Sweat",
      question: "Tool for SWEAT?",
      options: [
        { id: "c", text: "Perfume", emoji: "🌸", isCorrect: false, explanation: "Masks odor only." },
        { id: "b", text: "Water", emoji: "💧", isCorrect: false, explanation: "Washes, but doesn't stop sweat." },
        { id: "a", text: "Deodorant", emoji: "🧴", isCorrect: true, explanation: "Controls odor." }
      ]
    },
    {
      id: 4,
      category: "Nails",
      question: "Tool for NAILS?",
      options: [
        { id: "b", text: "Scissors", emoji: "✂️", isCorrect: false, explanation: "Too big." },
        { id: "a", text: "Nail Clipper", emoji: "💅", isCorrect: true, explanation: "Designed for nails." },
        { id: "c", text: "Teeth", emoji: "😬", isCorrect: false, explanation: "Don't bite them!" }
      ]
    },
    {
      id: 5,
      category: "Body",
      question: "Tool for BODY WASH?",
      options: [
        { id: "c", text: "Sand", emoji: "🏖️", isCorrect: false, explanation: "Too abrasive." },
        { id: "b", text: "Dry Towel", emoji: "🧣", isCorrect: false, explanation: "For drying." },
        { id: "a", text: "Loofah/Sponge", emoji: "🧽", isCorrect: true, explanation: "Scrubs skin." }
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
    navigate("/student/health-male/teens/night-sweat-story");
  };

  const currentP = puzzles[currentPuzzle];

  return (
    <GameShell
      title="Hygiene Tools Puzzle"
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
            <p className="text-white/80">Match the tool!</p>
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

export default HygieneToolsPuzzle44;
