import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SayNoPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-86";
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
      title: "Be Clear",
      question: "Which poster shows the best way to say NO?",
      options: [
        {
          id: "a",
          text: "Say NO Firmly",
          emoji: "✋",
          description: "Be clear and strong with your answer.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Whisper No",
          emoji: "🤫",
          description: "If you whisper, they might not hear you.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Smile and Nod",
          emoji: "🙂",
          description: "Smiling might make them think you mean yes.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Walk Away",
      question: "Which poster shows what to do after saying no?",
      options: [
        {
          id: "b",
          text: "Stay and Watch",
          emoji: "👀",
          description: "Staying might tempt you to join in.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Argue with Them",
          emoji: "🗣️",
          description: "Arguing keeps you in the bad situation.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Walk Away Fast",
          emoji: "🏃",
          description: "Leave the situation immediately.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      title: "Healthy Choice",
      question: "Which poster shows a healthy alternative?",
      options: [
        {
          id: "c",
          text: "Drink Soda",
          emoji: "🥤",
          description: "Soda isn't the healthiest choice either.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Eat Candy",
          emoji: "🍭",
          description: "Candy is okay sometimes, but not the best.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Play Sports",
          emoji: "🏀",
          description: "Sports are fun and keep you healthy!",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Real Friends",
      question: "Which poster shows what real friends do?",
      options: [
        {
          id: "b",
          text: "Pressure You",
          emoji: "😤",
          description: "Friends shouldn't force you to do bad things.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Make Fun of You",
          emoji: "😝",
          description: "Teasing isn't what friends do.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Respect Your No",
          emoji: "🤝",
          description: "Real friends listen when you say no.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Stay Strong",
      question: "Which poster shows a strong kid?",
      options: [
        {
          id: "c",
          text: "Follows the Crowd",
          emoji: "🐑",
          description: "Doing what everyone else does isn't strength.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Makes Own Choices",
          emoji: "🦁",
          description: "Being a leader of your own life is strong!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hides Away",
          emoji: "🙈",
          description: "Hiding doesn't solve the problem.",
          isCorrect: false
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
      // Show feedback for incorrect answer and move to next question
      showCorrectAnswerFeedback(0, false);
      
      setTimeout(() => {
        if (currentStage < stages.length - 1) {
          setCurrentStage(prev => prev + 1);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/refusal-journal");
  };

  const currentS = stages[currentStage];

  return (
    <GameShell
      title="Say No Poster"
      subtitle={`Poster ${currentStage + 1} of ${stages.length}`}
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
                disabled={gameFinished}
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

export default SayNoPoster;
