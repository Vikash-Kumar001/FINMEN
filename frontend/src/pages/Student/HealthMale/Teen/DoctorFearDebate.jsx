import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DoctorFearDebate = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const questions = [
    {
      id: 1,
      text: "Is visiting doctors scary or safe?",
      options: [
        {
          id: "a",
          text: "Scary",
          emoji: "😱",
          description: "Doctors help prevent and treat health issues",
          isCorrect: false
        },
        {
          id: "b",
          text: "Safe",
          emoji: "🛡️",
          description: "Healthcare professionals provide safe, expert care",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only for emergencies",
          emoji: "🚑",
          description: "Regular visits help prevent emergencies",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should teens know about medical procedures?",
      options: [
        {
          id: "a",
          text: "Procedures are designed to help",
          emoji: "💊",
          description: "Medical procedures improve health and save lives",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid all procedures",
          emoji: "❌",
          description: "Some procedures are necessary for good health",
          isCorrect: false
        },
        {
          id: "c",
          text: "All procedures are dangerous",
          emoji: "⚠️",
          description: "Most medical procedures are safe when done by professionals",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should teens prepare for doctor visits?",
      options: [
        {
          id: "a",
          text: "Avoid going altogether",
          emoji: "🏃",
          description: "Regular checkups are important for health",
          isCorrect: false
        },
        {
          id: "b",
          text: "Research and ask questions",
          emoji: "📚",
          description: "Being informed helps reduce anxiety about healthcare",
          isCorrect: true
        },
        {
          id: "c",
          text: "Go without preparation",
          emoji: "🤷",
          description: "Preparation makes visits more productive",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What role do doctors play in teen health?",
      options: [
        {
          id: "a",
          text: "Partners in health journey",
          emoji: "🤝",
          description: "Doctors guide teens through health decisions",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only for sick people",
          emoji: "🤒",
          description: "Doctors help prevent illness too",
          isCorrect: false
        },
        {
          id: "c",
          text: "Authority figures to fear",
          emoji: "👨‍⚕️",
          description: "Healthcare providers are supportive allies",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can teens overcome fear of doctors?",
      options: [
        {
          id: "a",
          text: "Never go to doctors",
          emoji: "🙈",
          description: "Healthcare is essential for well-being",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wait until emergency",
          emoji: "🚨",
          description: "Regular visits build comfort with healthcare",
          isCorrect: false
        },
        {
          id: "c",
          text: "Start with regular checkups",
          emoji: "📅",
          description: "Familiarity with healthcare reduces fear over time",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (gameFinished) return;

    const currentQ = questions[currentQuestion];
    const selectedOption = currentQ.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1000);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/journal-of-doctor-visits");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Doctor Fear"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-76"
      gameType="health-male"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {score}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Healthcare & Fear Debate</h3>
          </div>

          <p className="text-white text-lg mb-6 font-medium">
            {currentQ.text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {currentQ.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left border border-white/10"
              >
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
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

export default DoctorFearDebate;
