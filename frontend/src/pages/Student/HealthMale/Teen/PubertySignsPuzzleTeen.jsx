import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertySignsPuzzleTeen = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-24";

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
      category: "Voice",
      question: "What happens to your VOICE?",
      options: [
        { id: "a", text: "It gets deeper", emoji: "🗣️", isCorrect: true, explanation: "The larynx grows larger." },
        { id: "b", text: "It gets higher", emoji: "🐭", isCorrect: false, explanation: "That's not typical." },
        { id: "c", text: "It disappears", emoji: "😶", isCorrect: false, explanation: "You don't lose your voice." }
      ]
    },
    {
      id: 2,
      category: "Skin",
      question: "What happens to your SKIN?",
      options: [
        { id: "b", text: "It turns green", emoji: "🤢", isCorrect: false, explanation: "Only if you are sick." },
        { id: "a", text: "It gets oily/acne", emoji: "🧴", isCorrect: true, explanation: "Hormones increase oil production." },
        { id: "c", text: "It glows in dark", emoji: "💡", isCorrect: false, explanation: "That would be cool, but no." }
      ]
    },
    {
      id: 3,
      category: "Height",
      question: "What happens to your HEIGHT?",
      options: [
        { id: "c", text: "You shrink", emoji: "📉", isCorrect: false, explanation: "You grow up, not down." },
        { id: "b", text: "Stays same", emoji: "📏", isCorrect: false, explanation: "Puberty is a growth spurt." },
        { id: "a", text: "Growth Spurt", emoji: "📈", isCorrect: true, explanation: "You grow taller quickly." }
      ]
    },
    {
      id: 4,
      category: "Hair",
      question: "Where does HAIR grow?",
      options: [
        { id: "b", text: "On your palms", emoji: "✋", isCorrect: false, explanation: "Not there." },
        { id: "a", text: "Face & Body", emoji: "🧔", isCorrect: true, explanation: "Facial, underarm, and pubic hair appear." },
        { id: "c", text: "On your teeth", emoji: "🦷", isCorrect: false, explanation: "Definitely not." }
      ]
    },
    {
      id: 5,
      category: "Emotions",
      question: "What happens to EMOTIONS?",
      options: [
        { id: "c", text: "You become a robot", emoji: "🤖", isCorrect: false, explanation: "You feel more, not less." },
        { id: "b", text: "Nothing", emoji: "😐", isCorrect: false, explanation: "Hormones affect feelings." },
        { id: "a", text: "Mood Swings", emoji: "🎭", isCorrect: true, explanation: "Feelings can change fast." }
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
    navigate("/student/health-male/teens/acne-story-teen");
  };

  const currentP = puzzles[currentPuzzle];

  return (
    <GameShell
      title="Puberty Signs Puzzle"
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
            <p className="text-white/80">Match the sign!</p>
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

export default PubertySignsPuzzleTeen;
