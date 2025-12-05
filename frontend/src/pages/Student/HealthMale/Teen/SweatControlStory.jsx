import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SweatControlStory = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-41";

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
      text: "You notice you are sweating more than usual. What is happening?",
      options: [
        {
          id: "b",
          text: "You are melting",
          emoji: "🫠",
          description: "Not quite!",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "You drank too much water",
          emoji: "💧",
          description: "Hydration is good, but hormones cause the sweat.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Puberty hormones",
          emoji: "🧬",
          description: "Sweat glands become more active.",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "What is the difference between deodorant and antiperspirant?",
      options: [
        {
          id: "c",
          text: "They are the same",
          emoji: "🤷",
          description: "They work differently.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Deodorant masks smell, antiperspirant stops sweat",
          emoji: "🛡️",
          description: "Correct! One fights odor, the other fights wetness.",
          isCorrect: true
        },
        {
          id: "b",
          text: "One is for boys, one for girls",
          emoji: "🚻",
          description: "Both can be used by anyone.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "When is the best time to apply antiperspirant?",
      options: [
        {
          id: "b",
          text: "While sweating",
          emoji: "💦",
          description: "It won't stick well.",
          isCorrect: false
        },
        {
          id: "a",
          text: "On clean, dry skin",
          emoji: "✨",
          description: "Works best when pores are clean.",
          isCorrect: true
        },
        {
          id: "c",
          text: "After a workout without showering",
          emoji: "🏋️",
          description: "Wash first!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your clothes smell like sweat. What should you do?",
      options: [
          {
          id: "a",
          text: "Wash them",
          emoji: "🧺",
          description: "Clean clothes prevent body odor.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Spray perfume on them",
          emoji: "🌸",
          description: "Just masks the smell temporarily.",
          isCorrect: false
        },
      
        {
          id: "b",
          text: "Wear them again",
          emoji: "👕",
          description: "Bacteria will grow.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Is sweating bad for you?",
      options: [
        {
          id: "b",
          text: "Yes, always stop it",
          emoji: "🛑",
          description: "Your body needs to cool down.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if it smells",
          emoji: "👃",
          description: "Sweat itself is odorless; bacteria cause the smell.",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, it cools the body",
          emoji: "❄️",
          description: "It's a natural cooling mechanism.",
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
    navigate("/student/health-male/teens/quiz-hygiene");
  };

  return (
    <GameShell
      title="Sweat Control Story"
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

export default SweatControlStory;
