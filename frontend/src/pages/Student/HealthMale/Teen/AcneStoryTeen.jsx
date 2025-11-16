import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AcneStoryTeen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You notice pimples on your face. What's your first reaction?",
      options: [
        {
          id: "a",
          text: "Learn it's normal puberty",
          emoji: "📚",
          description: "Acne affects most teens due to hormone changes",
          isCorrect: true
        },
        {
          id: "b",
          text: "Blame it on bad food",
          emoji: "🍕",
          description: "Acne is mostly caused by hormones, not just food",
          isCorrect: false
        },
        {
          id: "c",
          text: "Panic and hide from friends",
          emoji: "😰",
          description: "Acne is normal and treatable during puberty",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You want to get rid of pimples quickly. What do you do?",
      options: [
        {
          id: "a",
          text: "Squeeze and pop every pimple",
          emoji: "🤏",
          description: "Squeezing can cause scarring and spread bacteria",
          isCorrect: false
        },
        {
          id: "b",
          text: "Use harsh chemicals",
          emoji: "🧪",
          description: "Harsh products can irritate sensitive teen skin",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wash face gently twice daily",
          emoji: "🧼",
          description: "Gentle cleansing prevents acne without damaging skin",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "A big event is coming up and you have acne. What do you do?",
      options: [
        {
          id: "a",
          text: "Skip the event",
          emoji: "🏠",
          description: "You can attend events and manage acne at the same time",
          isCorrect: false
        },
        {
          id: "b",
          text: "Use gentle acne treatment",
          emoji: "💊",
          description: "Over-the-counter treatments can help manage acne",
          isCorrect: true
        },
        {
          id: "c",
          text: "Cover with heavy makeup",
          emoji: "🎨",
          description: "Heavy makeup can clog pores and worsen acne",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your acne makes you feel self-conscious. How do you handle it?",
      options: [
        {
          id: "a",
          text: "Compare to others without acne",
          emoji: "👀",
          description: "Everyone's skin is different during puberty",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stop looking in mirrors",
          emoji: "🙈",
          description: "Self-care includes accepting and treating acne",
          isCorrect: false
        },
        {
          id: "c",
          text: "Focus on overall health",
          emoji: "🏃",
          description: "Healthy lifestyle supports clearer skin",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "When should you see a doctor about acne?",
      options: [
        {
          id: "a",
          text: "Never, handle it yourself",
          emoji: "🛠️",
          description: "Professional help is available for acne concerns",
          isCorrect: false
        },
        {
          id: "b",
          text: "If it affects confidence or is severe",
          emoji: "💪",
          description: "Dermatologists can help with treatment options",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only if it covers entire face",
          emoji: "😟",
          description: "Early treatment prevents scarring and boosts confidence",
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
    navigate("/student/health-male/teens/puberty-awkward-debate-teen");
  };

  return (
    <GameShell
      title="Acne Story (Teen)"
      subtitle={`Decision ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 5}
      gameId="health-male-teen-25"
      gameType="health-male"
      totalLevels={100}
      currentLevel={25}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 25/100</span>
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

export default AcneStoryTeen;
