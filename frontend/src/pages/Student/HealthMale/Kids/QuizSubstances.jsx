import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizSubstances = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-82";
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
      text: "What is alcohol?",
      options: [
        {
          id: "b",
          text: "A healthy juice",
          emoji: "🧃",
          description: "Alcohol is not healthy like juice",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Water",
          emoji: "💧",
          description: "Water is healthy, alcohol is not",
          isCorrect: false
        },
        {
          id: "a",
          text: "A drink for adults only",
          emoji: "🍷",
          description: "It is dangerous for kids' growing bodies",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "Why should kids avoid alcohol?",
      options: [
        {
          id: "c",
          text: "It tastes too sweet",
          emoji: "🍬",
          description: "It's about health, not taste",
          isCorrect: false
        },
        {
          id: "a",
          text: "It hurts the brain and body",
          emoji: "🧠",
          description: "Your brain is still growing and needs protection",
          isCorrect: true
        },
        {
          id: "b",
          text: "It makes you super strong",
          emoji: "💪",
          description: "It actually makes you weaker and clumsy",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What is a drug?",
      options: [
        {
          id: "b",
          text: "A toy",
          emoji: "🧸",
          description: "Drugs are not toys",
          isCorrect: false
        },
        {
          id: "a",
          text: "Something that changes how your body works",
          emoji: "💊",
          description: "Bad drugs can hurt your body very much",
          isCorrect: true
        },
        {
          id: "c",
          text: "A type of food",
          emoji: "🍔",
          description: "Drugs are not food",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Who can give you medicine safely?",
      options: [
        {
          id: "a",
          text: "Parents or Doctors",
          emoji: "👨‍⚕️",
          description: "Only trusted adults should give medicine",
          isCorrect: true
        },
        {
          id: "c",
          text: "A stranger",
          emoji: "👤",
          description: "Never take anything from strangers",
          isCorrect: false
        },
       
        {
          id: "b",
          text: "A friend at school",
          emoji: "🎒",
          description: "Friends shouldn't share medicine",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is the best choice?",
      options: [
        {
          id: "b",
          text: "Try everything once",
          emoji: "🎲",
          description: "Some things are too dangerous to try",
          isCorrect: false
        },
        {
          id: "c",
          text: "Do what friends do",
          emoji: "👯",
          description: "Think for yourself!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Stay drug and alcohol free",
          emoji: "🌟",
          description: "Keep your body clean and healthy!",
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
    navigate("/student/health-male/kids/reflex-safe-choice");
  };

  return (
    <GameShell
      title="Quiz on Substances"
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

export default QuizSubstances;
