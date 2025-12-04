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

  const [coins, setCoins] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

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
    navigate("/student/health-male/kids/sickness-story");
  };

  const currentP = puzzles[currentPuzzle];

  return (
    <GameShell
      title="Safety Match Puzzle"
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
            <h3 className="text-2xl font-bold text-white mb-4">{currentP.scenario}</h3>
            <p className="text-white/80">Find the matching safety item!</p>
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
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default SafetyMatchPuzzle;
