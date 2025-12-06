import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyAwkwardDebateTeen = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-26";

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
      title: "Voice Cracks",
      question: "Are voice cracks embarrassing?",
      options: [
        {
          id: "a",
          text: "It's natural, don't worry",
          emoji: "😌",
          description: "Everyone goes through it.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, hide forever",
          emoji: "🙈",
          description: "No need to hide.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stop talking",
          emoji: "🤐",
          description: "Don't silence yourself.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Body Hair",
      question: "Is body hair gross?",
      options: [
        {
          id: "b",
          text: "Yes, shave it all",
          emoji: "🪒",
          description: "It's a personal choice, not gross.",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, it's normal",
          emoji: "🧔",
          description: "It protects your skin.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only on aliens",
          emoji: "👽",
          description: "Humans have hair too.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Growth Spurts",
      question: "Is being clumsy okay?",
      options: [
        {
          id: "c",
          text: "No, be perfect",
          emoji: "🤖",
          description: "Nobody is perfect.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Quit sports",
          emoji: "🏳️",
          description: "Keep moving!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, body is adjusting",
          emoji: "📏",
          description: "Your brain is catching up to your height.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Mood Swings",
      question: "Are you crazy for having mood swings?",
      options: [
        {
          id: "b",
          text: "Yes, totally",
          emoji: "🤪",
          description: "You are not crazy.",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, it's hormones",
          emoji: "🧪",
          description: "Chemicals are changing in your body.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only if you cry",
          emoji: "😢",
          description: "Crying is normal too.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Asking Questions",
      question: "Is it okay to ask about puberty?",
      options: [
        {
          id: "c",
          text: "Never speak of it",
          emoji: "🤫",
          description: "Knowledge is power.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Google only",
          emoji: "💻",
          description: "Internet can be misleading.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, ask trusted adults",
          emoji: "👨‍👩‍👦",
          description: "Parents, doctors, or teachers can help.",
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
    navigate("/student/health-male/teens/teen-growth-journal");
  };

  const currentS = stages[currentStage];

  return (
    <GameShell
      title="Puberty Awkward Debate"
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

export default PubertyAwkwardDebateTeen;
