import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FreelanceStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A teen learns coding and works online for different clients. What is this called?",
      options: [
        {
          id: "a",
          text: "Freelancing",
          emoji: "💼",
          description: "Perfect! Freelancing means working independently for multiple clients",
          isCorrect: true
        },
        {
          id: "b",
          text: "Traditional employment",
          emoji: "🏢",
          description: "Traditional employment involves working for one company as an employee",
          isCorrect: false
        },
        {
          id: "c",
          text: "Unemployment",
          emoji: "❌",
          description: "Freelancing is a legitimate form of employment, just not traditional",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's an advantage of freelancing for teens?",
      options: [
        {
          id: "a",
          text: "Flexible schedule and skill development",
          emoji: "⏰",
          description: "Exactly! Freelancing allows flexible work arrangements and diverse skill building",
          isCorrect: true
        },
        {
          id: "b",
          text: "Guaranteed steady income",
          emoji: "💰",
          description: "Freelance income can vary and isn't always guaranteed",
          isCorrect: false
        },
        {
          id: "c",
          text: "No need for skills",
          emoji: "❓",
          description: "Freelancing requires specific skills to attract clients and complete projects",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's important for successful freelancing?",
      options: [
        {
          id: "a",
          text: "Reliability, communication, and time management",
          emoji: "📋",
          description: "Perfect! These skills are essential for maintaining client relationships",
          isCorrect: true
        },
        {
          id: "b",
          text: "Working whenever you feel like it",
          emoji: "😴",
          description: "Successful freelancing requires discipline and meeting deadlines",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding all client communication",
          emoji: "🔇",
          description: "Communication is crucial for understanding client needs and feedback",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which platform is commonly used for freelancing?",
      options: [
        {
          id: "a",
          text: "Upwork, Fiverr, Freelancer",
          emoji: "💻",
          description: "Exactly! These platforms connect freelancers with clients globally",
          isCorrect: true
        },
        {
          id: "b",
          text: "Social media only",
          emoji: "📱",
          description: "While social media can help, dedicated platforms are more effective",
          isCorrect: false
        },
        {
          id: "c",
          text: "Offline job fairs",
          emoji: "🎪",
          description: "Traditional job fairs are less common for freelancing opportunities",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should a teen freelancer focus on building?",
      options: [
        {
          id: "a",
          text: "Portfolio and client testimonials",
          emoji: "🏆",
          description: "Perfect! A strong portfolio and positive reviews attract more clients",
          isCorrect: true
        },
        {
          id: "b",
          text: "Working for free forever",
          emoji: "💸",
          description: "While building experience is important, sustainable income is also crucial",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding all feedback",
          emoji: "🙉",
          description: "Client feedback is valuable for improvement and building reputation",
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
    navigate("/student/ehe/teens/debate-robots-take-jobs");
  };

  return (
    <GameShell
      title="Freelance Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-75"
      gameType="ehe"
      totalLevels={80}
      currentLevel={75}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-2xl font-bold text-white mb-2">Freelance Career</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default FreelanceStory;