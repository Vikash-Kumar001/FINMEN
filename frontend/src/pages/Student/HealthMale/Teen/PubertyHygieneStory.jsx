import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PubertyHygieneStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-1";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You notice you are sweating more than usual. What's happening?",
      options: [
        {
          id: "b",
          text: "I'm sick",
          emoji: "🤒",
          description: "It's likely not sickness, just growing up.",
          isCorrect: false
        },
        {
          id: "a",
          text: "It's puberty",
          emoji: "🧍",
          description: "Puberty causes your sweat glands to become more active.",
          isCorrect: true
        },
        {
          id: "c",
          text: "It's too hot",
          emoji: "☀️",
          description: "Even when it's not hot, puberty causes sweating.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your sweat starts to smell. What should you use?",
      options: [
        {
          id: "c",
          text: "Perfume only",
          emoji: "🌸",
          description: "Perfume just covers the smell, it doesn't stop it.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Deodorant or Antiperspirant",
          emoji: "🧴",
          description: "These help control sweat and odor.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Nothing",
          emoji: "🤷",
          description: "Ignoring it might lead to body odor.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How often should you shower now?",
      options: [
        {
          id: "b",
          text: "Once a week",
          emoji: "🗓️",
          description: "That's not enough during puberty.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only when dirty",
          emoji: "💩",
          description: "Sweat happens even if you don't look dirty.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Every day",
          emoji: "🚿",
          description: "Daily showers keep you fresh and clean.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You notice hair growing in new places. What do you do?",
      options: [
        {
          id: "c",
          text: "Panic",
          emoji: "😱",
          description: "Don't panic! It's totally normal.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Keep it clean",
          emoji: "🧼",
          description: "Just wash it like the rest of your body.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Cut it all off",
          emoji: "✂️",
          description: "You don't have to remove it unless you want to.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your face feels oily. What helps?",
      options: [
        {
          id: "b",
          text: "Scrubbing hard",
          emoji: "🧽",
          description: "Scrubbing can irritate your skin.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Touching it",
          emoji: "👆",
          description: "Touching adds more dirt and oil.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Washing gently twice a day",
          emoji: "💧",
          description: "Gentle washing removes oil without hurting skin.",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/quiz-hygiene-changes");
  };

  return (
    <GameShell
      title="Puberty Hygiene Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {questions[currentQuestion].text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PubertyHygieneStory;
