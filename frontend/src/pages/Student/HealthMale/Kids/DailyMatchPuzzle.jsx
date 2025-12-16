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

  const [score, setScore] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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
    setSelectedOption(option.id);
    resetFeedback();

    if (option.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentPuzzle < puzzles.length - 1) {
        setCurrentPuzzle(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/sleep-story");
  };

  const currentP = puzzles[currentPuzzle];

  return (
    <GameShell
      title="Daily Match Puzzle"
      subtitle={showResult ? "Puzzle Complete!" : `Match activities with their benefits (${currentPuzzle + 1}/${puzzles.length} completed)`}
      score={score}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="health-male"
      totalLevels={puzzles.length}
      currentLevel={currentPuzzle + 1}
      maxScore={puzzles.length}
      showConfetti={showResult && score === puzzles.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
    >
      <div className="space-y-8 max-w-5xl mx-auto">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Puzzles: {currentPuzzle + 1}/{puzzles.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{puzzles.length}</span>
              </div>
              
              <p className="text-white/90 text-center mb-6">
                {currentP.question}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentP.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const isCorrect = isSelected && option.isCorrect;
                  const isWrong = isSelected && !option.isCorrect;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option)}
                      disabled={selectedOption !== null}
                      className={`w-full p-4 rounded-xl transition-all border-2 ${
                        !selectedOption
                          ? 'bg-white/10 hover:bg-white/20 border-white/30 cursor-pointer'
                          : isCorrect
                            ? 'bg-green-500/20 border-green-400 opacity-70 cursor-not-allowed'
                            : isWrong
                              ? 'bg-red-500/20 border-red-400 opacity-70 cursor-not-allowed'
                              : 'bg-white/10 border-white/30 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{option.emoji}</span>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-white">{option.text}</div>
                          <div className="text-sm text-white/70">{option.explanation}</div>
                        </div>
                        {isSelected && (
                          <span className={`text-xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {isCorrect ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default DailyMatchPuzzle;
