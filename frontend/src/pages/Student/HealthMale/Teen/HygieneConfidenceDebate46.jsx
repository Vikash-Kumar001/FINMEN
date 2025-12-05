import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneConfidenceDebate46 = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-46";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stages = [
    {
      id: 1,
      title: "Smelling Good",
      question: "Does smelling good make you confident?",
      options: [
        {
          id: "a",
          text: "Yes, definitely",
          emoji: "😎",
          description: "You don't worry about odor.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, looks matter more",
          emoji: "🙄",
          description: "Smell is very noticeable.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only to dogs",
          emoji: "🐶",
          description: "People notice too.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Bad Breath",
      question: "Can bad breath ruin a conversation?",
      options: [
        {
          id: "b",
          text: "No, people ignore it",
          emoji: "🤥",
          description: "It's hard to ignore.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, it's distracting",
          emoji: "🤢",
          description: "It pushes people away.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only if you shout",
          emoji: "🗣️",
          description: "Even whispering spreads it.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Clean Clothes",
      question: "Do clean clothes matter?",
      options: [
        {
          id: "c",
          text: "No, messy is cool",
          emoji: "🗑️",
          description: "Clean is respectful.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only expensive ones",
          emoji: "💲",
          description: "Cleanliness > Brand.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, shows self-respect",
          emoji: "👔",
          description: "You feel better in clean clothes.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Acne",
      question: "Can you be confident with acne?",
      options: [
        {
          id: "b",
          text: "No, hide face",
          emoji: "🙈",
          description: "Don't hide.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, personality shines",
          emoji: "✨",
          description: "You are more than your skin.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only in dark rooms",
          emoji: "🌑",
          description: "Be confident everywhere.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Self-Care",
      question: "Is self-care selfish?",
      options: [
        {
          id: "c",
          text: "Yes, help others only",
          emoji: "🤲",
          description: "You must help yourself first.",
          isCorrect: false
        },
        {
          id: "b",
          text: "It's a waste of time",
          emoji: "⌛",
          description: "It's essential.",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, it's healthy",
          emoji: "❤️",
          description: "Taking care of you is good.",
          isCorrect: true
        }
      ]
    }
  ];

  const handleOptionSelect = (option) => {
    if (option.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);

      setTimeout(() => {
        if (currentStage < stages.length - 1) {
          setCurrentStage(prev => prev + 1);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/journal-of-care");
  };

  const currentS = stages[currentStage];

  return (
    <GameShell
      title="Hygiene Confidence Debate"
      subtitle={`Topic ${currentStage + 1} of ${stages.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={stages.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{currentS.title}</h3>
            <p className="text-white/90 text-lg">{currentS.question}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentS.options.map((option) => (
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
                <p className="text-white/70 text-sm text-center">{option.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default HygieneConfidenceDebate46;
