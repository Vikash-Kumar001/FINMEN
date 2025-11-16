import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PartyStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Teen sees drugs at a party. Should she try?",
      options: [
        {
          id: "a",
          text: "No, it's dangerous and illegal",
          emoji: "❌",
          description: "Drugs can cause serious harm and legal consequences",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, just to fit in",
          emoji: "👥",
          description: "Fitting in isn't worth risking health and future",
          isCorrect: false
        },
        {
          id: "c",
          text: "Maybe, if everyone else is doing it",
          emoji: "🤷",
          description: "Popularity doesn't make something safe or right",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should you handle peer pressure at a party?",
      options: [
        {
          id: "a",
          text: "Stay true to your values and boundaries",
          emoji: "🛡️",
          description: "Self-respect is more important than peer approval",
          isCorrect: true
        },
        {
          id: "b",
          text: "Do whatever makes others happy",
          emoji: "😊",
          description: "Constantly pleasing others compromises your well-being",
          isCorrect: false
        },
        {
          id: "c",
          text: "Leave immediately without explanation",
          emoji: "🏃",
          description: "Sometimes leaving is necessary, but not always immediately",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's the best way to refuse substances at a party?",
      options: [
        {
          id: "a",
          text: "Firmly say \"No thanks\" and change the subject",
          emoji: "🙅",
          description: "Direct and confident refusal is most effective",
          isCorrect: true
        },
        {
          id: "b",
          text: "Take a small amount to avoid conflict",
          emoji: "小心翼",
          description: "This compromises your safety and values",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell a long story about why you can't",
          emoji: "📖",
          description: "Over-explaining invites challenges to your refusal",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you do if you feel unsafe at a party?",
      options: [
        {
          id: "a",
          text: "Find a trusted adult or leave with a friend",
          emoji: "🆘",
          description: "Your safety is the top priority",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay and try to handle it alone",
          emoji: "💪",
          description: "Asking for help is smart, not weak",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore your feelings and have fun",
          emoji: "🎉",
          description: "Trusting your instincts protects you",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is it important to plan ahead for parties?",
      options: [
        {
          id: "a",
          text: "To know how to stay safe and handle situations",
          emoji: "📋",
          description: "Preparation helps you make good decisions under pressure",
          isCorrect: true
        },
        {
          id: "b",
          text: "To memorize all the party rules",
          emoji: "📝",
          description: "Understanding safety strategies is more important than rules",
          isCorrect: false
        },
        {
          id: "c",
          text: "To decide what to wear",
          emoji: "👗",
          description: "Safety planning is more important than appearance",
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
    navigate("/student/health-female/teens/debate-smoking-cool");
  };

  return (
    <GameShell
      title="Party Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-85"
      gameType="health-female"
      totalLevels={10}
      currentLevel={5}
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

export default PartyStory;