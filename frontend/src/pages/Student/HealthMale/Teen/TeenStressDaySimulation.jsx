import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeenStressDaySimulation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const scenarios = [
    {
      id: 1,
      text: "Teen has exams + sports practice",
      options: [
        {
          id: "b",
          text: "Panic",
          emoji: "😰",
          description: "Panic increases stress and reduces performance",
          isCorrect: false
        },
        {
          id: "a",
          text: "Relax + Plan",
          emoji: "📅",
          description: "Planning and relaxation help manage multiple responsibilities",
          isCorrect: true
        },
        {
          id: "c",
          text: "Skip everything",
          emoji: "🏃",
          description: "Facing responsibilities is better than avoidance",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "During study session, feeling overwhelmed. What do you do?",
      options: [
        {
          id: "a",
          text: "Take a 10-minute break",
          emoji: "⏸️",
          description: "Short breaks improve focus and reduce stress",
          isCorrect: true
        },
        {
          id: "b",
          text: "Push through without break",
          emoji: "💪",
          description: "Without breaks, performance and mood suffer",
          isCorrect: false
        },
        {
          id: "c",
          text: "Give up studying",
          emoji: "😞",
          description: "Perseverance with breaks leads to better results",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "After sports, feeling tired and stressed. Best recovery?",
      options: [
        {
          id: "b",
          text: "More intense workout",
          emoji: "🏋️",
          description: "Rest and recovery are important after activity",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip meals and rest",
          emoji: "😴",
          description: "Nutrition is essential for stress management",
          isCorrect: false
        },
        {
          id: "a",
          text: "Light exercise + healthy snack",
          emoji: "🥗",
          description: "Proper recovery supports both body and mind",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Late night, can't sleep because of worry. What to do?",
      options: [
        {
          id: "b",
          text: "Check social media",
          emoji: "📱",
          description: "Blue light can make sleep harder.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Read or listen to music",
          emoji: "🎧",
          description: "Relaxing activities help clear the mind.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Stare at ceiling",
          emoji: "👀",
          description: "Getting up and doing something calm is better.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Friend cancels plans last minute. Reaction?",
      options: [
        {
          id: "a",
          text: "Get angry",
          emoji: "😡",
          description: "Anger only increases your own stress.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Feel rejected",
          emoji: "😢",
          description: "Don't take it personally, things happen.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Understand and reschedule",
          emoji: "🤝",
          description: "Flexibility reduces stress in relationships.",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentStep < scenarios.length - 1) {
        setCurrentStep(prev => prev + 1);
        setAnswered(false);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-emotional-health");
  };

  const currentScenario = scenarios[currentStep];

  return (
    <GameShell
      title="Simulation: Teen Stress Day"
      subtitle={!gameFinished ? `Step ${currentStep + 1} of ${scenarios.length}` : "Simulation Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-58"
      gameType="health-male"
      totalLevels={scenarios.length}
      currentLevel={currentStep + 1}
      maxScore={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!gameFinished ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
              <span className="text-yellow-400 font-bold">Score: {score}</span>
            </div>

            <div className="text-center mb-6">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-white mb-2">Stress Day Simulator</h3>
            </div>

            <p className="text-white text-lg mb-6">
              {currentScenario.text}
            </p>

            <div className="grid grid-cols-1 gap-4">
              {currentScenario.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.isCorrect)}
                  disabled={answered}
                  className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${answered
                      ? option.isCorrect
                        ? "bg-green-500/50 border-green-400"
                        : "bg-white/10 opacity-50"
                      : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    } text-white border border-transparent`}
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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Simulation Complete!</h3>
            <p className="text-xl text-white/90 mb-6">
              You scored {score} out of {scenarios.length}!
            </p>
            <p className="text-white/80 mb-8">
              Managing stress is a daily practice. Keep making healthy choices!
            </p>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Next Challenge
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TeenStressDaySimulation;
