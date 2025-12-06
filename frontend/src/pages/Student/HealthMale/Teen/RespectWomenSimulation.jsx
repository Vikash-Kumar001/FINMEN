import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RespectWomenSimulation = () => {
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
      text: "Teen hears friends make rude jokes about girls. Should he join or stop?",
      options: [
        {
          id: "a",
          text: "Join in to fit in",
          emoji: "😏",
          description: "Joining disrespectful behavior harms everyone",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stop them politely",
          emoji: "✋",
          description: "Speaking up against disrespect shows character",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore and stay silent",
          emoji: "😶",
          description: "Silence can enable harmful behavior",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should you respond to disrespectful comments about women?",
      options: [
        {
          id: "c",
          text: "Laugh along",
          emoji: "😂",
          description: "Laughing encourages disrespectful behavior",
          isCorrect: false
        },
        {
          id: "a",
          text: "Call them out directly",
          emoji: "🗣️",
          description: "Direct confrontation can escalate situations",
          isCorrect: false
        },
        {
          id: "b",
          text: "Change the subject respectfully",
          emoji: "💬",
          description: "Redirecting conversation promotes positive dialogue",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What shows respect towards women in daily interactions?",
      options: [
        {
          id: "a",
          text: "Opening doors for them",
          emoji: "🚪",
          description: "Respect is about equality, not just gestures",
          isCorrect: false
        },
        {
          id: "c",
          text: "Listening to their opinions",
          emoji: "👂",
          description: "Valuing everyone's voice shows true respect",
          isCorrect: true
        },
        {
          id: "b",
          text: "Complimenting their appearance",
          emoji: "😊",
          description: "Respect goes beyond physical compliments",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A girl says 'no' to a date. How should you react?",
      options: [
        {
          id: "a",
          text: "Keep asking until she says yes",
          emoji: "🔁",
          description: "Persistence after a 'no' is disrespectful.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Accept her answer gracefully",
          emoji: "👍",
          description: "Respecting boundaries is key to healthy relationships.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Get angry",
          emoji: "😠",
          description: "Rejection is part of life and should be handled with maturity.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You see a girl struggling with heavy bags. What do you do?",
      options: [
        {
          id: "a",
          text: "Offer to help",
          emoji: "🤝",
          description: "Helping others is a kind and respectful gesture.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Laugh at her",
          emoji: "😆",
          description: "Mocking others is disrespectful.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Walk past",
          emoji: "🚶",
          description: "Offering help is a sign of good character.",
          isCorrect: false
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

  const currentScenario = scenarios[currentStep];

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-respect-check");
  };

  return (
    <GameShell
      title="Simulation: Respect Women"
      subtitle={!gameFinished ? `Step ${currentStep + 1} of ${scenarios.length}` : "Simulation Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-68"
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
              <h3 className="text-2xl font-bold text-white mb-2">Respect Simulator</h3>
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
              Respect is the foundation of all healthy relationships.
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

export default RespectWomenSimulation;
