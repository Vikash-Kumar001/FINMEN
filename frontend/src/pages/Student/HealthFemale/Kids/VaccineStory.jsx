import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const VaccineStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Doctor says you need a vaccine shot. Should you take it?",
      options: [
        {
          id: "a",
          text: "Yes, vaccines protect me from serious diseases",
          emoji: "💉",
          description: "Exactly! Vaccines help your body build immunity to prevent serious diseases. They're safe and effective.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, I'm scared of needles",
          emoji: "😨",
          description: "While it's normal to feel scared, vaccines are important for your health. The brief discomfort protects you from serious diseases.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend says vaccines are dangerous. What do you do?",
      options: [
        {
          id: "a",
          text: "Trust medical experts and get vaccinated",
          emoji: "👩‍⚕️",
          description: "Great choice! Medical experts and scientists have thoroughly tested vaccines. Trusting reliable sources is important for your health.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Believe your friend and skip vaccines",
          emoji: "👥",
          description: "It's important to verify health information from reliable sources like doctors, not just friends. Vaccines are proven safe and effective.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You feel slightly unwell after a vaccine. What should you do?",
      options: [
        {
          id: "a",
          text: "Rest and inform your parents - mild side effects are normal",
          emoji: "😴",
          description: "Perfect! Mild side effects like slight fever or soreness are normal and show your body is building immunity. Rest and inform your parents.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Panic and never get another vaccine",
          emoji: "😱",
          description: "Mild side effects are normal and temporary. Serious reactions are extremely rare. Don't let minor discomfort prevent important protection.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Parents forget to take you for a scheduled vaccine. What's best?",
      options: [
        {
          id: "a",
          text: "Remind parents about the appointment",
          emoji: "📅",
          description: "Wonderful! Keeping track of health appointments shows responsibility. Vaccines work best when given on schedule.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Forget about it and hope for the best",
          emoji: "🤷",
          description: "Vaccines are most effective when given on schedule. It's important to follow the recommended vaccination timeline for full protection.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "New vaccine is available for a disease in your area. Should you get it?",
      options: [
        {
          id: "a",
          text: "Yes, if recommended by health authorities",
          emoji: "✅",
          description: "Excellent! New vaccines that are recommended by health authorities have been thoroughly tested and approved for safety and effectiveness.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, wait to see if others get sick first",
          emoji: "⏳",
          description: "Waiting could put you at risk. Vaccines are developed and tested to be safe and effective before being recommended. Protection is better than waiting.",
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

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Vaccine Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-71"
      gameType="health-female"
      totalLevels={80}
      currentLevel={71}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {choices.some(c => c.question === currentQuestion && c.optionId === option.id) && (
                      <p className="text-white/90">{option.description}</p>
                    )}
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

export default VaccineStory;