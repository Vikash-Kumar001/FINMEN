import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DirtyShirtStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-8";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You wore the same sweaty shirt for 3 days. What happens?",
      options: [
        {
          id: "b",
          text: "Shirt becomes stronger",
          emoji: "💪",
          description: "Dirty clothes get weaker, not stronger",
          isCorrect: false
        },
        {
          id: "a",
          text: "Shirt smells bad",
          emoji: "🤢",
          description: "Sweat creates bad odors over time",
          isCorrect: true
        },
        {
          id: "c",
          text: "Nothing changes",
          emoji: "😊",
          description: "Dirt and sweat build up over time",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Friends say 'You smell!' What do you do?",
      options: [
        {
          id: "b",
          text: "Spray perfume",
          emoji: "🌸",
          description: "Perfume only covers smell, doesn't clean",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore them",
          emoji: "😤",
          description: "Clean habits are important for health",
          isCorrect: false
        },
        {
          id: "a",
          text: "Take a bath and change shirt",
          emoji: "🛁",
          description: "Clean clothes and body fix the smell",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "You keep wearing dirty clothes. What happens to your skin?",
      options: [
        {
          id: "a",
          text: "Skin gets rashes",
          emoji: "🤕",
          description: "Germs and dirt can cause skin problems",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skin becomes tougher",
          emoji: "🛡️",
          description: "Dirty skin is more likely to get infections",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing happens",
          emoji: "👍",
          description: "Dirty clothes affect skin health",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why should you change your socks daily?",
      options: [
        {
          id: "b",
          text: "To match your shoes",
          emoji: "👟",
          description: "Hygiene is more important than fashion",
          isCorrect: false
        },
        {
          id: "a",
          text: "To prevent smelly feet",
          emoji: "🦶",
          description: "Feet sweat a lot and need clean socks",
          isCorrect: true
        },
        {
          id: "c",
          text: "Socks never get dirty",
          emoji: "🧦",
          description: "Socks collect sweat and bacteria",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should you do with dirty clothes?",
      options: [
        {
          id: "b",
          text: "Hide them under bed",
          emoji: "🛏️",
          description: "They will smell and attract bugs",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wear them again",
          emoji: "👕",
          description: "Dirty clothes should be washed",
          isCorrect: false
        },
        {
          id: "a",
          text: "Put them in laundry basket",
          emoji: "🧺",
          description: "Keep them separate for washing",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    if (currentQuestion < 0 || currentQuestion >= questions.length) {
      return;
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ || !currentQ.options) {
      return;
    }

    const newChoices = [...choices, {
      questionId: currentQ.id,
      choice: selectedChoice,
      isCorrect: currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];

    setChoices(newChoices);

    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  const getCurrentQuestion = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title="Dirty Shirt Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={8}
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="health-male-kids-8"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === questions.length}>
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>

              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 flex flex-col items-center justify-center text-center h-full"
                  >
                    <div className="text-4xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default DirtyShirtStory;
