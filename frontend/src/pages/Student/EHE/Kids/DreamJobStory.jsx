import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DreamJobStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You love helping animals feel better when they're sick. Which job would suit you best?",
      options: [
        {
          id: "b",
          text: "Chef",
          emoji: "👨‍🍳",
          description: "Chefs cook food for people, not animals!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Veterinarian",
          emoji: "🐶",
          description: "Perfect! Veterinarians help animals stay healthy!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Pilot",
          emoji: "✈️",
          description: "Pilots fly airplanes, not animals!",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You enjoy building things with blocks and fixing broken toys. Which job matches your interests?",
      options: [
        {
          id: "c",
          text: "Artist",
          emoji: "🎨",
          description: "Artists create beautiful art, not buildings!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Engineer",
          emoji: "🏗️",
          description: "Excellent! Engineers design and build things!",
          isCorrect: true
        },
        {
          id: "b",
          text: "Teacher",
          emoji: "📚",
          description: "Teachers help students learn, but that's not about building!",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You love solving puzzles and figuring out how things work. What career might be right for you?",
      options: [
        {
          id: "b",
          text: "Musician",
          emoji: "🎵",
          description: "Musicians create music, not solve scientific puzzles!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Scientist",
          emoji: "🔬",
          description: "Great choice! Scientists solve problems and discover new things!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Writer",
          emoji: "✍️",
          description: "Writers tell stories, but they don't conduct experiments!",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You enjoy working with numbers and helping people manage their money. Which job fits you?",
      options: [
        {
          id: "b",
          text: "Actor",
          emoji: "🎭",
          description: "Actors perform in plays and movies!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Accountant",
          emoji: "🧮",
          description: "Perfect! Accountants work with numbers and finances!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Gardener",
          emoji: "🌱",
          description: "Gardeners take care of plants, not finances!",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You love being creative and designing beautiful things. What career would suit your talents?",
      options: [
        {
          id: "b",
          text: "Police Officer",
          emoji: "👮",
          description: "Police officers help keep people safe!",
          isCorrect: false
        },
        {
          id: "a",
          text: "Designer",
          emoji: "🎨",
          description: "Excellent! Designers create beautiful and functional things!",
          isCorrect: true
        },
        {
          id: "c",
          text: "Mechanic",
          emoji: "🔧",
          description: "Mechanics fix machines, not design them!",
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
    navigate("/games/ehe/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Dream Job Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="ehe-kids-5"
      gameType="ehe"
      totalLevels={10}
      currentLevel={5}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/kids"
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
            {getCurrentQuestion().options.map(option => {
              const isSelected = choices.some(c => 
                c.question === currentQuestion && c.optionId === option.id
              );
              const showFeedback = choices.some(c => c.question === currentQuestion);
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  disabled={showFeedback}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{option.emoji}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                      {showFeedback && isSelected && (
                        <p className="text-white/90">{option.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default DreamJobStory;