import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyHealthStoryTeen = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-31";

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
      text: "You notice you are gaining weight during puberty. Is this bad?",
      options: [
         {
          id: "a",
          text: "No, it's normal growth",
          emoji: "📈",
          description: "Your body is building muscle and bone.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, stop eating",
          emoji: "🚫",
          description: "You need food to grow.",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Only eat salad",
          emoji: "🥗",
          description: "You need a balanced diet.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You feel tired all the time. Why?",
      options: [
        {
          id: "c",
          text: "You are lazy",
          emoji: "🛋️",
          description: "Not true.",
          isCorrect: false
        },
       
        {
          id: "b",
          text: "Too much homework",
          emoji: "📚",
          description: "Maybe, but growth is the main reason.",
          isCorrect: false
        },
         {
          id: "a",
          text: "Growing takes energy",
          emoji: "🔋",
          description: "Your body is working hard to grow.",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "You have body odor even after showering. What helps?",
      options: [
        {
          id: "b",
          text: "Shower 5 times a day",
          emoji: "🚿",
          description: "Too much washing dries skin.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wear perfume only",
          emoji: "🌸",
          description: "Doesn't kill bacteria.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Deodorant/Antiperspirant",
          emoji: "🧴",
          description: "Controls sweat and smell.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You feel like no one understands you.",
      options: [
        {
          id: "c",
          text: "Run away",
          emoji: "🏃",
          description: "Not the answer.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Talk to a friend/adult",
          emoji: "🗣️",
          description: "Sharing helps you feel better.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Scream at everyone",
          emoji: "🤬",
          description: "Makes things worse.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Is it okay to cry if you are a boy?",
      options: [
        {
          id: "b",
          text: "No, boys don't cry",
          emoji: "🤖",
          description: "That's a myth.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only when alone",
          emoji: "🚪",
          description: "You can show emotions.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, emotions are human",
          emoji: "❤️",
          description: "Everyone has feelings.",
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
    navigate("/student/health-male/teens/quiz-puberty-health-teen");
  };

  return (
    <GameShell
      title="Puberty Health Story"
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

export default PubertyHealthStoryTeen;
