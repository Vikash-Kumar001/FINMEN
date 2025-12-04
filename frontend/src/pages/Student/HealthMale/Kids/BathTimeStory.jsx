import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BathTimeStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-5";

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
      text: "Mom says 'Take bath daily.' What do you do?",
      options: [
        {
          id: "b",
          text: "Skip bath sometimes",
          emoji: "😅",
          description: "Skipping baths leads to germs and bad smell",
          isCorrect: false
        },
        {
          id: "a",
          text: "Take bath daily",
          emoji: "🛁",
          description: "Clean body stays healthy and fresh",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only bath once a week",
          emoji: "📅",
          description: "Daily bathing is important for hygiene",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You played outside all day. What happens next?",
      options: [
        {
          id: "b",
          text: "Go straight to dinner",
          emoji: "🍽️",
          description: "Dirty body brings germs to food",
          isCorrect: false
        },
        {
          id: "c",
          text: "Just change clothes",
          emoji: "👕",
          description: "Need bath to clean body, not just clothes",
          isCorrect: false
        },
        {
          id: "a",
          text: "Take a refreshing bath",
          emoji: "🧼",
          description: "Bath removes dirt and sweat from playing",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Your friend says 'Bathing is boring!' What do you say?",
      options: [
        {
          id: "b",
          text: "Clean body stays healthy",
          emoji: "💪",
          description: "Daily baths prevent sickness",
          isCorrect: true
        },
        {
          id: "a",
          text: "You're right, I'll skip",
          emoji: "😒",
          description: "Skipping baths is unhealthy",
          isCorrect: false
        },
        {
          id: "c",
          text: "Make it fun with toys",
          emoji: "🦆",
          description: "Bathing can be fun and healthy",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "After swimming in pool, what should you do?",
      options: [
        {
          id: "b",
          text: "Wait until tomorrow",
          emoji: "⏰",
          description: "Chemicals and germs should be washed off today",
          isCorrect: false
        },
        {
          id: "a",
          text: "Take shower immediately",
          emoji: "🚿",
          description: "Pool water has chemicals that need washing off",
          isCorrect: true
        },
        {
          id: "c",
          text: "Just dry off",
          emoji: "💨",
          description: "Need soap and water to clean properly",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Mom notices you smell after playing. What happens?",
      options: [
        {
          id: "b",
          text: "Everyone stays away",
          emoji: "😷",
          description: "Bad smell from no baths pushes friends away",
          isCorrect: false
        },
        {
          id: "c",
          text: "You feel sick",
          emoji: "🤒",
          description: "Germs from dirt can make you ill",
          isCorrect: false
        },
        {
          id: "a",
          text: "Mom reminds you to bath",
          emoji: "🛁",
          description: "Daily baths keep you fresh and clean",
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
      title="Bath Time Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="health-male-kids-5"
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

export default BathTimeStory;
