import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StreamChoiceStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A teen loves biology and wants to help people. Which higher education path suits her best?",
      options: [
        {
          id: "a",
          text: "Engineering",
          emoji: "⚙️",
          description: "Engineering focuses on technical problem-solving rather than biological sciences",
          isCorrect: false
        },
        {
          id: "b",
          text: "Medicine",
          emoji: "👨‍⚕️",
          description: "Perfect! Medicine combines biology with helping people through healthcare",
          isCorrect: true
        },
        {
          id: "c",
          text: "Law",
          emoji: "⚖️",
          description: "Law focuses on legal systems rather than biological sciences",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should be the primary factor when choosing a higher education stream?",
      options: [
        {
          id: "a",
          text: "What friends are studying",
          emoji: "👥",
          description: "Following friends may not align with your interests or career goals",
          isCorrect: false
        },
        {
          id: "b",
          text: "Your interests and strengths",
          emoji: "🎯",
          description: "Exactly! Personal interests and strengths lead to better academic and career success",
          isCorrect: true
        },
        {
          id: "c",
          text: "Highest salary potential only",
          emoji: "💰",
          description: "While financial considerations matter, passion and fit are equally important",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can a teen explore different education streams before making a choice?",
      options: [
        {
          id: "a",
          text: "Talk to teachers, professionals, and take aptitude tests",
          emoji: "👨‍🏫",
          description: "Perfect! Multiple sources provide comprehensive insights for informed decisions",
          isCorrect: true
        },
        {
          id: "b",
          text: "Choose randomly without research",
          emoji: "🎲",
          description: "Random choices may not align with abilities or career prospects",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only read about streams online",
          emoji: "💻",
          description: "Online research helps but direct interaction provides deeper understanding",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's important to consider when evaluating a higher education stream?",
      options: [
        {
          id: "a",
          text: "Career prospects, personal interests, and required skills",
          emoji: "📊",
          description: "Exactly! A holistic evaluation considers multiple factors for long-term success",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only the duration of the course",
          emoji: "⏱️",
          description: "Duration is one factor but not the most important consideration",
          isCorrect: false
        },
        {
          id: "c",
          text: "What's popular among celebrities",
          emoji: "🌟",
          description: "Celebrity choices may not match personal aptitude or career goals",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How should a teen prepare for their chosen education stream?",
      options: [
        {
          id: "a",
          text: "Strengthen foundational subjects and develop relevant skills",
          emoji: "📚",
          description: "Perfect! Building strong foundations prepares students for advanced study",
          isCorrect: true
        },
        {
          id: "b",
          text: "Focus only on entertainment",
          emoji: "🎮",
          description: "Balanced preparation includes both study and recreation",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid all challenging subjects",
          emoji: "😴",
          description: "Challenging subjects build critical thinking and problem-solving skills",
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
    navigate("/student/ehe/teens/quiz-higher-studies");
  };

  return (
    <GameShell
      title="Stream Choice Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="ehe-teen-61"
      gameType="ehe"
      totalLevels={70}
      currentLevel={61}
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
            <div className="text-5xl mb-4">📘</div>
            <h3 className="text-2xl font-bold text-white mb-2">Education Stream Choice</h3>
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

export default StreamChoiceStory;