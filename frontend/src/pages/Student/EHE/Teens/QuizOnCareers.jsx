import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnCareers = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which career needs coding skills?",
      options: [
        {
          id: "a",
          text: "Teacher",
          emoji: "📚",
          description: "Teachers focus on education, not primarily on coding",
          isCorrect: false
        },
        {
          id: "b",
          text: "Software Engineer",
          emoji: "💻",
          description: "Correct! Software engineers write code to create applications and systems",
          isCorrect: true
        },
        {
          id: "c",
          text: "Farmer",
          emoji: "🚜",
          description: "Farmers focus on agriculture, not coding",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which professional helps people with legal issues?",
      options: [
        {
          id: "a",
          text: "Doctor",
          emoji: "👨‍⚕️",
          description: "Doctors focus on medical health, not legal matters",
          isCorrect: false
        },
        {
          id: "b",
          text: "Lawyer",
          emoji: "⚖️",
          description: "Correct! Lawyers provide legal advice and represent clients in court",
          isCorrect: true
        },
        {
          id: "c",
          text: "Chef",
          emoji: "👨‍🍳",
          description: "Chefs focus on cooking and food preparation",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Who designs buildings and structures?",
      options: [
        {
          id: "a",
          text: "Architect",
          emoji: "🏛️",
          description: "Correct! Architects design buildings and structures",
          isCorrect: true
        },
        {
          id: "b",
          text: "Journalist",
          emoji: "📰",
          description: "Journalists focus on reporting news and writing articles",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nurse",
          emoji: "👩‍⚕️",
          description: "Nurses focus on patient care in healthcare settings",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which career involves treating patients' medical conditions?",
      options: [
        {
          id: "a",
          text: "Teacher",
          emoji: "🏫",
          description: "Teachers focus on education, not medical treatment",
          isCorrect: false
        },
        {
          id: "b",
          text: "Doctor",
          emoji: "🏥",
          description: "Correct! Doctors diagnose and treat medical conditions",
          isCorrect: true
        },
        {
          id: "c",
          text: "Mechanic",
          emoji: "🔧",
          description: "Mechanics fix vehicles and machinery, not medical conditions",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Who investigates crimes and collects evidence?",
      options: [
        {
          id: "a",
          text: "Scientist",
          emoji: "🔬",
          description: "Scientists conduct research and experiments in various fields",
          isCorrect: false
        },
        {
          id: "b",
          text: "Police Detective",
          emoji: "👮",
          description: "Correct! Police detectives investigate crimes and gather evidence",
          isCorrect: true
        },
        {
          id: "c",
          text: "Librarian",
          emoji: "📚",
          description: "Librarians manage books and information resources",
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
    navigate("/student/ehe/teens/reflex-teen-career");
  };

  return (
    <GameShell
      title="Quiz on Careers"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-2"
      gameType="ehe"
      totalLevels={10}
      currentLevel={2}
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

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default QuizOnCareers;