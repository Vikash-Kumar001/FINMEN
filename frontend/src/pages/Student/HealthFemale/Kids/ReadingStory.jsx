import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReadingStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Why read daily?",
      options: [
        {
          id: "a",
          text: "Improves knowledge and mind",
          emoji: "🧠",
          description: "Exactly! Reading expands your vocabulary, improves concentration, and enhances critical thinking skills.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's boring and not useful",
          emoji: "😴",
          description: "Reading has many benefits for your brain and personal development. Finding the right books can make it enjoyable.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend says reading is only for school. What do you think?",
      options: [
        {
          id: "a",
          text: "Reading for pleasure has many benefits beyond school",
          emoji: "📚",
          description: "Great choice! Reading for fun reduces stress, improves empathy, and can be a great source of entertainment.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Agree that reading is only for school assignments",
          emoji: "📝",
          description: "Reading has lifelong benefits that extend far beyond school assignments and can be a source of joy and relaxation.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You find a book too difficult to understand. What should you do?",
      options: [
        {
          id: "a",
          text: "Choose a book at your reading level or ask for help",
          emoji: "📖",
          description: "Perfect! Starting with books at your level and gradually challenging yourself helps build reading skills.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Give up on reading altogether",
          emoji: "😔",
          description: "Giving up prevents you from enjoying the many benefits of reading. There are books for every reading level and interest.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can reading improve your future?",
      options: [
        {
          id: "a",
          text: "Builds knowledge, vocabulary, and critical thinking skills",
          emoji: "🌟",
          description: "Wonderful! These skills are valuable in all areas of life, from academics to career success to personal growth.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It won't make a difference in your future",
          emoji: "🤔",
          description: "Reading regularly has been shown to improve cognitive abilities, communication skills, and career prospects throughout life.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You learn that readers have better focus and memory. How does this make you feel?",
      options: [
        {
          id: "a",
          text: "Motivated to read more regularly",
          emoji: "💪",
          description: "Excellent! Understanding the benefits of reading reinforces your commitment to making it a daily habit.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Think it won't affect you personally",
          emoji: "🤷",
          description: "Regular reading benefits everyone's brain function. Making it a habit can improve your focus and memory over time.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
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

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Reading Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-98"
      gameType="health-female"
      totalLevels={100}
      currentLevel={98}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.question === currentQuestion)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {choices.some(c => c.question === currentQuestion && c.optionId === option.id) && (
                      <p className="text-white/90">{option.description}</p>
                    )}
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

export default ReadingStory;