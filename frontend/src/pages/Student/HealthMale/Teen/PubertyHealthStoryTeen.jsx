import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyHealthStoryTeen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your health teacher starts talking about reproductive health in class. How do you react?",
      options: [
        {
          id: "a",
          text: "Listen calmly and take notes",
          emoji: "📝",
          description: "Learning about reproductive health helps you make informed decisions",
          isCorrect: true
        },
        {
          id: "b",
          text: "Make jokes with friends",
          emoji: "😏",
          description: "Reproductive health education is serious and important",
          isCorrect: false
        },
        {
          id: "c",
          text: "Feel embarrassed and look away",
          emoji: "😳",
          description: "Reproductive health is a normal part of growing up",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The teacher explains that reproductive health includes understanding your body. What's your response?",
      options: [
        {
          id: "a",
          text: "Feel it's only for adults",
          emoji: "👨",
          description: "Teens need this information to make healthy choices",
          isCorrect: false
        },
        {
          id: "b",
          text: "Realize it's part of growing up",
          emoji: "🌱",
          description: "Reproductive health knowledge is essential for teens",
          isCorrect: true
        },
        {
          id: "c",
          text: "Think it's not important",
          emoji: "🤷",
          description: "Understanding your body helps you stay healthy",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Teacher mentions seeing a doctor for reproductive health concerns. What do you think?",
      options: [
        {
          id: "a",
          text: "Doctors don't need to know",
          emoji: "😶",
          description: "Healthcare providers help with reproductive health questions",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only if something hurts",
          emoji: "🤕",
          description: "Preventive care is important for reproductive health",
          isCorrect: false
        },
        {
          id: "c",
          text: "It's normal and responsible",
          emoji: "🏥",
          description: "Regular check-ups help maintain reproductive health",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "The class discusses how reproductive health affects emotional wellbeing. How do you respond?",
      options: [
        {
          id: "a",
          text: "Laugh it off with friends",
          emoji: "😄",
          description: "Emotional health is connected to reproductive health",
          isCorrect: false
        },
        {
          id: "b",
          text: "Understand the connection",
          emoji: "💡",
          description: "Reproductive health impacts both physical and emotional wellbeing",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore the discussion",
          emoji: "🙉",
          description: "Understanding emotions is part of reproductive health",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "The teacher says reproductive health includes hygiene. What's your reaction?",
      options: [
        {
          id: "a",
          text: "Think it's not necessary",
          emoji: "❌",
          description: "Good hygiene is crucial for reproductive health",
          isCorrect: false
        },
        {
          id: "b",
          text: "Practice good hygiene daily",
          emoji: "🚿",
          description: "Proper hygiene prevents infections and maintains health",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only when someone reminds you",
          emoji: "⏰",
          description: "Regular hygiene should be a personal habit",
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
    navigate("/student/health-male/teens/quiz-male-reproductive-basics-teen");
  };

  return (
    <GameShell
      title="Puberty Health Story (Teen)"
      subtitle={`Health Lesson ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 5}
      gameId="health-male-teen-31"
      gameType="health-male"
      totalLevels={100}
      currentLevel={31}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 31/100</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 5}</span>
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

export default PubertyHealthStoryTeen;
