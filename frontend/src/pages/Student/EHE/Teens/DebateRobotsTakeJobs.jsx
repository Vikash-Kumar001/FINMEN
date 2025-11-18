import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateRobotsTakeJobs = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Will robots take jobs or create new ones?",
      options: [
        {
          id: "a",
          text: "Only take jobs, no new ones created",
          emoji: "❌",
          description: "Technology historically creates new job categories even as it automates others",
          isCorrect: false
        },
        {
          id: "b",
          text: "Create new ones too",
          emoji: "✅",
          description: "Exactly! Automation often creates new roles in technology development and maintenance",
          isCorrect: true
        },
        {
          id: "c",
          text: "No impact on employment",
          emoji: "🤷",
          description: "Technology has significant impacts on employment patterns and job types",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's a benefit of automation in the workplace?",
      options: [
        {
          id: "a",
          text: "Increased efficiency and safety",
          emoji: "⚡",
          description: "Perfect! Automation can handle dangerous or repetitive tasks more efficiently",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eliminates all human workers",
          emoji: "🤖",
          description: "Automation complements rather than completely replaces human workers",
          isCorrect: false
        },
        {
          id: "c",
          text: "No need for human oversight",
          emoji: "👁️",
          description: "Human oversight remains important for quality control and decision-making",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should workers adapt to automation?",
      options: [
        {
          id: "a",
          text: "Continuous learning and skill development",
          emoji: "📚",
          description: "Exactly! Ongoing education helps workers stay relevant in changing job markets",
          isCorrect: true
        },
        {
          id: "b",
          text: "Resist all technological change",
          emoji: "🚫",
          description: "Resistance to change can limit career opportunities and growth",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid learning new skills",
          emoji: "😴",
          description: "Skill development is essential for adapting to workplace changes",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What new jobs might emerge from AI development?",
      options: [
        {
          id: "a",
          text: "AI trainers, ethicists, and maintenance specialists",
          emoji: "👨‍💻",
          description: "Perfect! These roles are emerging as AI becomes more prevalent",
          isCorrect: true
        },
        {
          id: "b",
          text: "No new jobs from technology",
          emoji: "❌",
          description: "Technology consistently creates new job categories and specializations",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only traditional roles",
          emoji: "📜",
          description: "New technology creates specialized roles that didn't exist before",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the role of humans in an automated workplace?",
      options: [
        {
          id: "a",
          text: "Creative problem-solving and complex decision-making",
          emoji: "🧠",
          description: "Exactly! Humans excel at creativity, empathy, and complex reasoning that machines can't replicate",
          isCorrect: true
        },
        {
          id: "b",
          text: "No role needed",
          emoji: "❌",
          description: "Humans remain essential for leadership, innovation, and interpersonal skills",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only manual labor",
          emoji: "💪",
          description: "Human contributions extend far beyond physical labor to cognitive and creative work",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(2, true);
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
    navigate("/student/ehe/teens/journal-future-skills");
  };

  return (
    <GameShell
      title="Debate: Robots Take Jobs?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      gameId="ehe-teen-76"
      gameType="ehe"
      totalLevels={80}
      currentLevel={76}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 2}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Robots and Jobs Debate</h3>
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

export default DebateRobotsTakeJobs;