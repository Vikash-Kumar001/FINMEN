import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SafetyMatchPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-74";
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
      scenario: "You are riding a bike. What do you need?",
      options: [
        { id: "a", text: "A Helmet", emoji: "⛑️", isCorrect: true, explanation: "Helmets protect your head!" },
        { id: "b", text: "A Cape", emoji: "🦸", isCorrect: false, explanation: "Capes don't protect you from falls." },
        { id: "c", text: "Slippers", emoji: "🩴", isCorrect: false, explanation: "You need sturdy shoes for biking." }
      ]
    },
    {
      id: 2,
      scenario: "You are in a car. What keeps you safe?",
      options: [
        { id: "b", text: "Loud Music", emoji: "🎵", isCorrect: false, explanation: "Music is fun but doesn't keep you safe." },
        { id: "a", text: "Seatbelt", emoji: "🚗", isCorrect: true, explanation: "Seatbelts hold you safe in your seat!" },
        { id: "c", text: "Toys", emoji: "🧸", isCorrect: false, explanation: "Toys are for playing, not safety." }
      ]
    },
    {
      id: 3,
      scenario: "You want to cross the street. What helps you?",
      options: [
        { id: "c", text: "Running Shoes", emoji: "👟", isCorrect: false, explanation: "Running across is dangerous!" },
        { id: "b", text: "Headphones", emoji: "🎧", isCorrect: false, explanation: "You need to hear traffic." },
        { id: "a", text: "Crosswalk", emoji: "🦓", isCorrect: true, explanation: "Crosswalks are the safe place to cross!" }
      ]
    },
    {
      id: 4,
      scenario: "It is very sunny outside. What protects your skin?",
      options: [
        { id: "b", text: "Winter Coat", emoji: "🧥", isCorrect: false, explanation: "You'll get too hot!" },
        { id: "a", text: "Sunscreen", emoji: "🧴", isCorrect: true, explanation: "Sunscreen protects you from sunburn!" },
        { id: "c", text: "Rain Boots", emoji: "👢", isCorrect: false, explanation: "Boots are for rain, not sun." }
      ]
    },
    {
      id: 5,
      scenario: "You are swimming in a pool. What helps you float?",
      options: [
        { id: "c", text: "Heavy Rocks", emoji: "🪨", isCorrect: false, explanation: "Rocks will make you sink!" },
        { id: "b", text: "Umbrella", emoji: "☂️", isCorrect: false, explanation: "Umbrellas are for rain." },
        { id: "a", text: "Life Jacket", emoji: "🦺", isCorrect: true, explanation: "Life jackets help you stay afloat!" }
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
    navigate("/student/health-male/kids/sickness-story");
  };

  const currentP = puzzles[currentPuzzle];

  return (
    <GameShell
      title="Safety Match Puzzle"
      subtitle={showResult ? "Puzzle Complete!" : `Match safety scenarios with safety items (${currentPuzzle + 1}/${puzzles.length} completed)`}
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
                {currentP.scenario}
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

export default SafetyMatchPuzzle;
