import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HygieneToolsPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-4";
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
      category: "Shaving",
      question: "What do you use for SHAVING?",
      options: [
        { id: "a", text: "Razor & Cream", emoji: "🪒", isCorrect: true, explanation: "Use cream to protect skin." },
        { id: "b", text: "Scissors", emoji: "✂️", isCorrect: false, explanation: "Scissors are for hair cuts." },
        { id: "c", text: "Knife", emoji: "🔪", isCorrect: false, explanation: "Never use a knife!" }
      ]
    },
    {
      id: 2,
      category: "Body Odor",
      question: "What fights BODY ODOR?",
      options: [
        { id: "b", text: "Water only", emoji: "💧", isCorrect: false, explanation: "Water isn't enough." },
        { id: "a", text: "Deodorant", emoji: "🧴", isCorrect: true, explanation: "It stops the smell." },
        { id: "c", text: "Lotion", emoji: "🧴", isCorrect: false, explanation: "Lotion is for dry skin." }
      ]
    },
    {
      id: 3,
      category: "Acne",
      question: "What helps with ACNE?",
      options: [
        { id: "c", text: "Toothpaste", emoji: "🦷", isCorrect: false, explanation: "Don't put toothpaste on spots." },
        { id: "b", text: "Butter", emoji: "🧈", isCorrect: false, explanation: "Grease makes it worse." },
        { id: "a", text: "Face Wash", emoji: "🧼", isCorrect: true, explanation: "Cleans pores gently." }
      ]
    },
    {
      id: 4,
      category: "Teeth",
      question: "What keeps TEETH clean?",
      options: [
        { id: "b", text: "Gum", emoji: "🍬", isCorrect: false, explanation: "Gum doesn't clean teeth." },
        { id: "a", text: "Brush & Floss", emoji: "🪥", isCorrect: true, explanation: "Removes plaque and food." },
        { id: "c", text: "Mouthwash only", emoji: "🧪", isCorrect: false, explanation: "You need to brush too." }
      ]
    },
    {
      id: 5,
      category: "Nails",
      question: "What trims NAILS safely?",
      options: [
        { id: "c", text: "Teeth", emoji: "😬", isCorrect: false, explanation: "Don't bite your nails!" },
        { id: "b", text: "Knife", emoji: "🔪", isCorrect: false, explanation: "Too dangerous." },
        { id: "a", text: "Nail Clippers", emoji: "✂️", isCorrect: true, explanation: "Designed for the job." }
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
    navigate("/student/health-male/teens/sports-hygiene-story");
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
            <p className="text-white/80">Pick the right tool!</p>
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

export default HygieneToolsPuzzle;
