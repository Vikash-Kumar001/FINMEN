import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizEmergingCareers = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which is an emerging field?",
      options: [
        {
          id: "a",
          text: "AI & Data Science",
          emoji: "🤖",
          description: "Correct! AI and data science are rapidly growing fields with high demand",
          isCorrect: true
        },
        {
          id: "b",
          text: "Basket Weaving only",
          emoji: "🧺",
          description: "While traditional crafts have value, they're not emerging fields like AI",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What makes a career field 'emerging'?",
      options: [
        {
          id: "a",
          text: "New technology or societal needs drive it",
          emoji: "🚀",
          description: "Exactly! Emerging fields respond to new developments and changing needs",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's just a marketing term",
          emoji: "📢",
          description: "Emerging fields represent real shifts in technology and society",
          isCorrect: false
        },
        {
          id: "c",
          text: "It requires no skills",
          emoji: "❌",
          description: "Emerging fields often require specialized and advanced skills",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which career is likely to grow due to climate change concerns?",
      options: [
        {
          id: "a",
          text: "Environmental Scientist",
          emoji: "🌿",
          description: "Correct! Environmental scientists address climate challenges and sustainability",
          isCorrect: true
        },
        {
          id: "b",
          text: "Typewriter Repairer",
          emoji: "⌨️",
          description: "This field is declining as technology advances",
          isCorrect: false
        },
        {
          id: "c",
          text: "Fax Machine Operator",
          emoji: "📠",
          description: "This field is obsolete with modern communication technology",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's driving growth in cybersecurity careers?",
      options: [
        {
          id: "a",
          text: "Increased digital threats and online activity",
          emoji: "🛡️",
          description: "Exactly! More online activity creates more need for digital protection",
          isCorrect: true
        },
        {
          id: "b",
          text: "People using less technology",
          emoji: "📴",
          description: "Less technology use would reduce rather than increase cybersecurity needs",
          isCorrect: false
        },
        {
          id: "c",
          text: "Decreased internet usage",
          emoji: "📉",
          description: "Reduced internet usage would decrease cybersecurity demand",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is continuous learning important in emerging fields?",
      options: [
        {
          id: "a",
          text: "Technology and methods evolve rapidly",
          emoji: "🔄",
          description: "Perfect! Rapid change requires ongoing skill development and adaptation",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skills become obsolete quickly",
          emoji: "⏰",
          description: "While some skills may change, continuous learning keeps professionals current",
          isCorrect: false
        },
        {
          id: "c",
          text: "It's not important",
          emoji: "😴",
          description: "Continuous learning is essential for success in fast-changing fields",
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
    navigate("/student/ehe/teens/reflex-teen-future-check");
  };

  return (
    <GameShell
      title="Quiz on Emerging Careers"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-72"
      gameType="ehe"
      totalLevels={80}
      currentLevel={72}
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
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-white mb-2">Emerging Careers Quiz</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default QuizEmergingCareers;