import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateGirlsShouldNotCry = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is crying a sign of weakness for girls?",
      options: [
        {
          id: "a",
          text: "No, crying is a natural emotional expression",
          emoji: "💧",
          description: "Emotional expression is healthy and normal for everyone",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, girls should suppress their emotions",
          emoji: "🤐",
          description: "Suppressing emotions can lead to mental health issues",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only boys should cry, not girls",
          emoji: "♂️♀️",
          description: "Emotional expression isn't gender-specific",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What is the purpose of crying?",
      options: [
        {
          id: "a",
          text: "To release emotional tension and communicate distress",
          emoji: "😌",
          description: "Crying serves important psychological and social functions",
          isCorrect: true
        },
        {
          id: "b",
          text: "To manipulate others for personal gain",
          emoji: "🤥",
          description: "This is a harmful stereotype, not the primary purpose",
          isCorrect: false
        },
        {
          id: "c",
          text: "To show off or seek attention",
          emoji: "🎭",
          description: "This dismisses the genuine emotional function of crying",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should society view emotional expression in girls?",
      options: [
        {
          id: "a",
          text: "As healthy and normal human behavior",
          emoji: "😊",
          description: "Emotional expression benefits mental health and relationships",
          isCorrect: true
        },
        {
          id: "b",
          text: "As inappropriate and unprofessional",
          emoji: "❌",
          description: "This stigma prevents emotional well-being",
          isCorrect: false
        },
        {
          id: "c",
          text: "As a sign of instability",
          emoji: "🌀",
          description: "Normal emotional expression indicates mental health, not instability",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What are the consequences of suppressing emotions?",
      options: [
        {
          id: "a",
          text: "Increased stress, anxiety, and potential mental health issues",
          emoji: "😰",
          description: "Emotional suppression can harm psychological well-being",
          isCorrect: true
        },
        {
          id: "b",
          text: "Improved mental strength and resilience",
          emoji: "💪",
          description: "Healthy emotional expression actually builds resilience",
          isCorrect: false
        },
        {
          id: "c",
          text: "Better social relationships and communication",
          emoji: "🤝",
          description: "Suppressing emotions can damage relationships",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can we create supportive environments for emotional expression?",
      options: [
        {
          id: "a",
          text: "By validating feelings and providing safe spaces",
          emoji: "🤗",
          description: "Supportive environments promote mental health and well-being",
          isCorrect: true
        },
        {
          id: "b",
          text: "By dismissing emotions as overreactions",
          emoji: "🙄",
          description: "Dismissing emotions can increase isolation and distress",
          isCorrect: false
        },
        {
          id: "c",
          text: "By encouraging only positive emotions",
          emoji: "😄",
          description: "All emotions are valid and serve important functions",
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
    navigate("/student/health-female/teens/journal-stress-relief");
  };

  return (
    <GameShell
      title="Debate: Girls Should Not Cry?"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-56"
      gameType="health-female"
      totalLevels={10}
      currentLevel={6}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
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

export default DebateGirlsShouldNotCry;