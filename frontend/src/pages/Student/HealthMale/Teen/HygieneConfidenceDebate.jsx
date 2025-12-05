import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HygieneConfidenceDebate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-6";
  const gameData = getGameDataById(gameId);

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
      title: "First Impression",
      question: "Does looking clean help you make a good first impression?",
      options: [
        {
          id: "a",
          text: "Yes, definitely",
          emoji: "👍",
          description: "People see you take care of yourself.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, looks don't matter",
          emoji: "👎",
          description: "Hygiene shows respect for yourself and others.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if you wear expensive clothes",
          emoji: "💰",
          description: "Cleanliness matters more than brands.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Self-Esteem",
      question: "How does smelling good make you feel?",
      options: [
        {
          id: "b",
          text: "Nervous",
          emoji: "😰",
          description: "Usually, it reduces anxiety.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Confident and ready",
          emoji: "😎",
          description: "Knowing you're fresh boosts confidence.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Tired",
          emoji: "😴",
          description: "Smelling good doesn't make you tired.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Social Life",
      question: "Does bad hygiene affect friendships?",
      options: [
        {
          id: "c",
          text: "Friends don't care",
          emoji: "🤷",
          description: "Body odor can push people away.",
          isCorrect: false
        },
        {
          id: "b",
          text: "It makes you popular",
          emoji: "🌟",
          description: "Definitely not.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, it can push people away",
          emoji: "🚶",
          description: "People prefer being around fresh scents.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Professionalism",
      question: "Is hygiene important for a job interview?",
      options: [
        {
          id: "b",
          text: "No, only skills matter",
          emoji: "🧠",
          description: "Presentation is part of professionalism.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, it shows responsibility",
          emoji: "👔",
          description: "It shows you can take care of details.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only for models",
          emoji: "📸",
          description: "It matters for every job.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Mental Health",
      question: "Can a shower improve your mood?",
      options: [
        {
          id: "c",
          text: "It makes you sad",
          emoji: "😢",
          description: "Showers are refreshing.",
          isCorrect: false
        },
        {
          id: "b",
          text: "It does nothing",
          emoji: "😐",
          description: "It physically resets your state.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, it's refreshing",
          emoji: "🚿",
          description: "Self-care is a mood booster.",
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
    navigate("/student/health-male/teens/self-care-journal");
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

export default HygieneConfidenceDebate;
