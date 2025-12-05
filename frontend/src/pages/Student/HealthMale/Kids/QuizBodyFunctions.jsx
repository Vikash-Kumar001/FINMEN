import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizBodyFunctions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-32";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which organ helps pump blood?",
      options: [
        {
          id: "b",
          text: "Brain",
          emoji: "🧠",
          description: "Brain thinks and controls body",
          isCorrect: false
        },
        {
          id: "a",
          text: "Heart",
          emoji: "❤️",
          description: "Heart pumps blood throughout the body",
          isCorrect: true
        },
        {
          id: "c",
          text: "Lungs",
          emoji: "🫁",
          description: "Lungs help us breathe",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What do lungs help us do?",
      options: [
        {
          id: "c",
          text: "Digest food",
          emoji: "🍎",
          description: "Stomach digests, lungs breathe",
          isCorrect: false
        },
        {
          id: "a",
          text: "Breathe oxygen",
          emoji: "💨",
          description: "Lungs bring oxygen into our blood",
          isCorrect: true
        },
        {
          id: "b",
          text: "Think thoughts",
          emoji: "💭",
          description: "Brain thinks, lungs breathe",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which organ helps us digest food?",
      options: [
        {
          id: "a",
          text: "Stomach",
          emoji: "🫄",
          description: "Stomach breaks down food for energy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Heart",
          emoji: "❤️",
          description: "Heart pumps blood, stomach digests",
          isCorrect: false
        },
        {
          id: "c",
          text: "Brain",
          emoji: "🧠",
          description: "Brain controls body, stomach processes food",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What does the brain help us do?",
      options: [
        {
          id: "b",
          text: "Pump blood",
          emoji: "💉",
          description: "Heart pumps blood, brain controls thinking",
          isCorrect: false
        },
        {
          id: "c",
          text: "Breathe air",
          emoji: "🌬️",
          description: "Lungs breathe, brain thinks and controls",
          isCorrect: false
        },
        {
          id: "a",
          text: "Think and learn",
          emoji: "🎓",
          description: "Brain is the control center of the body",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "How do all organs work together?",
      options: [
        {
          id: "b",
          text: "They work separately",
          emoji: "🔄",
          description: "Organs work as a team for body health",
          isCorrect: false
        },
        {
          id: "a",
          text: "As a team",
          emoji: "🤝",
          description: "All body systems cooperate for health",
          isCorrect: true
        },
        {
          id: "c",
          text: "Against each other",
          emoji: "⚔️",
          description: "Organs help each other stay healthy",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Quiz on Body Functions"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={32}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-2">Body Functions Quiz</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className={`bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${choices.some(c => c.question === currentQuestion) ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
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

export default QuizBodyFunctions;
