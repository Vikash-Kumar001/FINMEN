import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EducationStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Teen girl wants to study engineering. Should parents stop her?",
      options: [
        {
          id: "a",
          text: "Yes, engineering is not for girls",
          emoji: "🚫",
          description: "That's not right. Engineering is a field that anyone can pursue regardless of gender.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, support her dreams",
          emoji: "🎓",
          description: "That's right! Everyone should have the opportunity to pursue their educational goals regardless of gender.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "A girl is excelling in math and science. What should her parents do?",
      options: [
        {
          id: "a",
          text: "Encourage her to continue in STEM fields",
          emoji: "🔬",
          description: "Perfect! Supporting girls in STEM fields helps break down gender barriers in education.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tell her to focus on arts instead",
          emoji: "🎨",
          description: "That's not inclusive. Girls should be encouraged to pursue any field they're interested in and excel at.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A school offers advanced math classes only to boys. Is this fair?",
      options: [
        {
          id: "a",
          text: "Yes, boys are naturally better at math",
          emoji: "♂️",
          description: "That's a harmful stereotype. There's no scientific basis for claiming one gender is naturally better at math.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, educational opportunities should be equal",
          emoji: "⚖️",
          description: "Great choice! Educational opportunities should be available to all students regardless of gender.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "A girl wants to attend university, but her family expects her to marry instead. What should she do?",
      options: [
        {
          id: "a",
          text: "Follow family expectations to avoid conflict",
          emoji: "🏠",
          description: "That's not empowering. Everyone should have the right to make their own life choices.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Pursue her education and communicate with her family",
          emoji: "📚",
          description: "Wonderful! Pursuing education while maintaining family relationships shows strength and determination.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "A scholarship program is only available to boys. Is this acceptable?",
      options: [
        {
          id: "a",
          text: "Yes, boys need more support in education",
          emoji: "💰",
          description: "That's not equitable. Scholarships should be based on merit and need, not gender.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, scholarships should be gender-neutral",
          emoji: "✅",
          description: "Excellent! Scholarships should be available to all qualified students regardless of gender.",
          isCorrect: true
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
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Education Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-21"
      gameType="civic-responsibility"
      totalLevels={30}
      currentLevel={21}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
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

export default EducationStory;