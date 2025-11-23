import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebatePeriodHygieneInSchools = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Should schools teach period hygiene openly and provide resources?",
      options: [
        {
          id: "a",
          text: "Yes, with factual information and support",
          emoji: "✅",
          description: "Correct! Open education helps students understand and manage their health with dignity.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, it should be discussed only at home",
          emoji: "🏠",
          description: "This approach may leave students without essential knowledge and support.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only in all-girls classes",
          emoji: "👧",
          description: "Inclusive education benefits everyone and reduces stigma around natural processes.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should schools accommodate students during their periods?",
      options: [
        {
          id: "a",
          text: "Provide access to clean restrooms and hygiene products",
          emoji: "🚻",
          description: "Correct! Access to facilities and products supports student health and attendance.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Expect students to manage on their own",
          emoji: "自理",
          description: "This may disadvantage students who lack resources or support at home.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Provide access to clean restrooms and hygiene products",
          emoji: "🚻",
          description: "Correct! Access to facilities and products supports student health and attendance.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What role should teachers play in period hygiene education?",
      options: [
        {
          id: "a",
          text: "Provide factual, age-appropriate information",
          emoji: "📚",
          description: "Correct! Teachers can play a crucial role in delivering accurate health information.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Provide factual, age-appropriate information",
          emoji: "📚",
          description: "Correct! Teachers can play a crucial role in delivering accurate health information.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Avoid the topic completely",
          emoji: "🤫",
          description: "This leaves students without important health education they need.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Should schools have policies supporting period hygiene?",
      options: [
        {
          id: "a",
          text: "Yes, with free products and private changing areas",
          emoji: "🏛️",
          description: "Correct! Supportive policies ensure all students can maintain dignity and hygiene.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, this is a personal/family responsibility",
          emoji: "👪",
          description: "Schools have a role in supporting student health and educational access.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Yes, with free products and private changing areas",
          emoji: "🏛️",
          description: "Correct! Supportive policies ensure all students can maintain dignity and hygiene.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "How can schools reduce period-related stigma?",
      options: [
        {
          id: "a",
          text: "Normalize discussions and provide inclusive education",
          emoji: "🤝",
          description: "Correct! Open, respectful dialogue helps reduce shame and misinformation.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Treat it as a shameful secret",
          emoji: "🤐",
          description: "This perpetuates stigma and prevents students from getting needed support.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only address it when problems arise",
          emoji: "⚠️",
          description: "Proactive education is more effective than reactive problem-solving.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
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
    navigate("/student/health-female/teens/journal-teen-hygiene");
  };

  return (
    <GameShell
      title="Debate: Period Hygiene in Schools"
      subtitle={`Debate Point ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-46"
      gameType="health-female"
      totalLevels={50}
      currentLevel={46}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate Point {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              {getCurrentQuestion().text}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map((option) => (
              <div
                key={option.id}
                onClick={() => !choices.find(c => c.question === currentQuestion) && handleChoice(option.id)}
                className={`bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  choices.find(c => c.question === currentQuestion)?.optionId === option.id
                    ? option.isCorrect
                      ? "border-green-400 bg-green-500/20"
                      : "border-red-400 bg-red-500/20"
                    : "border-white/30 hover:border-purple-400"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <span className="text-4xl">{option.emoji}</span>
                  <span className="text-white font-medium">{option.text}</span>
                </div>
                
                {choices.find(c => c.question === currentQuestion)?.optionId === option.id && (
                  <div className={`mt-3 p-2 rounded-lg text-sm ${
                    option.isCorrect ? "bg-green-500/30 text-green-200" : "bg-red-500/30 text-red-200"
                  }`}>
                    {option.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default DebatePeriodHygieneInSchools;