import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizDesignThinking = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What is the first stage of design thinking?",
      options: [
        {
          id: "a",
          text: "Empathize - Understand user needs",
          emoji: "❤️",
          description: "Correct! Empathize is the foundation of design thinking - understanding users' needs and experiences.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Random guessing",
          emoji: "❓",
          description: "Random guessing doesn't lead to effective solutions - understanding needs does.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Jump to solutions immediately",
          emoji: "🏃",
          description: "Rushing to solutions without understanding needs often results in ineffective designs.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What does the 'Define' stage involve?",
      options: [
        {
          id: "a",
          text: "Articulating the problem statement clearly",
          emoji: "📝",
          description: "Exactly! Define involves synthesizing empathy findings into a clear problem statement.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Building the final product",
          emoji: "🏗️",
          description: "Building happens later in the process - Define focuses on problem articulation.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignoring user feedback",
          emoji: "🔇",
          description: "Ignoring feedback leads to solutions that don't address real needs.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What is the purpose of the Ideate stage?",
      options: [
        {
          id: "a",
          text: "Generate many creative solutions",
          emoji: "💡",
          description: "Great! Ideate encourages brainstorming diverse ideas without initial judgment.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Critique and eliminate ideas immediately",
          emoji: "❌",
          description: "Early criticism stifles creativity - Ideate focuses on generating possibilities.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copy existing solutions exactly",
          emoji: "📎",
          description: "Ideation encourages original thinking, not just copying existing solutions.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What happens during the Prototype stage?",
      options: [
        {
          id: "a",
          text: "Build simple versions to test ideas",
          emoji: "🛠️",
          description: "Perfect! Prototypes are quick, inexpensive ways to test concepts before full development.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Create the final perfect product",
          emoji: "🏆",
          description: "Prototypes are meant to be simple tests, not final polished products.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip testing and launch immediately",
          emoji: "🚀",
          description: "Testing prototypes helps identify issues before full development.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is the Test stage important?",
      options: [
        {
          id: "a",
          text: "Learn from user feedback to improve",
          emoji: "🔄",
          description: "Correct! Testing reveals what works and what needs refinement in the design process.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Prove your idea is perfect",
          emoji: "💯",
          description: "Testing often reveals areas for improvement, not perfection.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid user involvement completely",
          emoji: "🔒",
          description: "User feedback is essential for creating solutions that truly meet needs.",
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
    navigate("/student/ehe/teens/reflex-teen-innovator-2");
  };

  return (
    <GameShell
      title="Quiz on Design Thinking"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-32"
      gameType="ehe"
      totalLevels={40}
      currentLevel={32}
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

export default QuizDesignThinking;