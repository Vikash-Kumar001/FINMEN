import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyAwkwardDebateTeen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Friend says: 'Puberty makes me feel so awkward!' How do you respond?",
      options: [
        {
          id: "a",
          text: "It's a normal part of growing up",
          emoji: "🌱",
          description: "Understanding puberty helps reduce embarrassment",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yeah, it's totally embarrassing",
          emoji: "😳",
          description: "Puberty is natural and happens to everyone",
          isCorrect: false
        },
        {
          id: "c",
          text: "Just ignore the changes",
          emoji: "🙈",
          description: "Learning about puberty helps you feel more confident",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Classmate jokes about your voice cracking. What's your response?",
      options: [
        {
          id: "a",
          text: "Explain it's normal puberty",
          emoji: "💪",
          description: "Educating others helps create understanding",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stop talking in class",
          emoji: "🤐",
          description: "Voice changes are temporary and normal",
          isCorrect: false
        },
        {
          id: "c",
          text: "Get angry and argue back",
          emoji: "😠",
          description: "Responding calmly shows maturity",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You feel self-conscious about body changes. What helps most?",
      options: [
        {
          id: "a",
          text: "Comparing to magazines",
          emoji: "📸",
          description: "Media often shows unrealistic images",
          isCorrect: false
        },
        {
          id: "b",
          text: "Learning puberty is natural",
          emoji: "📖",
          description: "Knowledge reduces anxiety about changes",
          isCorrect: true
        },
        {
          id: "c",
          text: "Trying to hide all changes",
          emoji: "🕶️",
          description: "Accepting changes leads to confidence",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Parent asks how you're handling puberty. What do you say?",
      options: [
        {
          id: "a",
          text: "I don't want to talk about it",
          emoji: "🚫",
          description: "Communication helps with concerns",
          isCorrect: false
        },
        {
          id: "b",
          text: "I'm fine, don't worry",
          emoji: "👍",
          description: "Parents can offer support if you're open",
          isCorrect: false
        },
        {
          id: "c",
          text: "I have questions actually",
          emoji: "❓",
          description: "Asking questions helps you understand changes",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "You notice a friend struggling with puberty. What do you do?",
      options: [
        {
          id: "a",
          text: "Share what you know",
          emoji: "💡",
          description: "Supporting others builds strong friendships",
          isCorrect: true
        },
        {
          id: "b",
          text: "Make fun of them",
          emoji: "😆",
          description: "Support helps more than teasing",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore them",
          emoji: "😶",
          description: "Friends should support each other",
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
    navigate("/student/health-male/teens/teen-growth-journal");
  };

  return (
    <GameShell
      title="Debate: Puberty = Awkward? (Teen)"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 10}
      gameId="health-male-teen-26"
      gameType="health-male"
      totalLevels={100}
      currentLevel={26}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 26/100</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 10}</span>
          </div>

          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl mb-4">
              <p className="font-bold">💬 Debate Topic</p>
            </div>
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

export default PubertyAwkwardDebateTeen;
