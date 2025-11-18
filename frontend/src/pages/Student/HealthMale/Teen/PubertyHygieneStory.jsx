import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyHygieneStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You sweat more during puberty. What should you do?",
      options: [
        {
          id: "a",
          text: "Ignore the sweat",
          emoji: "😅",
          description: "Ignoring sweat leads to bad smell and discomfort",
          isCorrect: false
        },
        {
          id: "b",
          text: "Use deodorant daily",
          emoji: "🧴",
          description: "Deodorant helps control body odor during puberty changes",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only use it sometimes",
          emoji: "📅",
          description: "Daily use is important for puberty hygiene",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your skin gets oily during puberty. What's the best routine?",
      options: [
        {
          id: "a",
          text: "Wash face twice daily",
          emoji: "🧼",
          description: "Regular face washing prevents acne and keeps skin healthy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Skip face washing",
          emoji: "❌",
          description: "Oily skin needs regular cleaning during puberty",
          isCorrect: false
        },
        {
          id: "c",
          text: "Use harsh soaps",
          emoji: "🔥",
          description: "Harsh products can damage sensitive puberty skin",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "During puberty, you notice body hair growing. What do you do?",
      options: [
        {
          id: "a",
          text: "Learn safe grooming habits",
          emoji: "✂️",
          description: "Safe grooming is important for teen hygiene",
          isCorrect: true
        },
        {
          id: "b",
          text: "Shave everything immediately",
          emoji: "🪒",
          description: "Need to learn proper techniques first",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore body hair completely",
          emoji: "🤷",
          description: "Proper grooming is part of puberty hygiene",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You notice changes in your body during puberty. How do you respond?",
      options: [
        {
          id: "a",
          text: "Feel embarrassed about changes",
          emoji: "😳",
          description: "Puberty is normal and happens to everyone",
          isCorrect: false
        },
        {
          id: "b",
          text: "Hide changes from others",
          emoji: "🙈",
          description: "It's okay to talk about puberty with trusted adults",
          isCorrect: false
        },
        {
          id: "c",
          text: "Learn about body changes positively",
          emoji: "📚",
          description: "Understanding puberty helps you feel confident",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "During puberty, your emotions change. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Learn emotional management skills",
          emoji: "🧠",
          description: "Understanding emotions helps during puberty changes",
          isCorrect: true
        },
        {
          id: "b",
          text: "Let emotions control you",
          emoji: "🌪️",
          description: "Learning to manage emotions is key during puberty",
          isCorrect: false
        },
        {
          id: "c",
          text: "Suppress all emotions",
          emoji: "😶",
          description: "It's healthy to express and understand feelings",
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
    navigate("/student/health-male/teens/quiz-hygiene-changes");
  };

  return (
    <GameShell
      title="Puberty Hygiene Story"
      subtitle={`Level 1 of 10`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-male-teen-1"
      gameType="health-male"
      totalLevels={10}
      currentLevel={1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 1/10</span>
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

export default PubertyHygieneStory;
