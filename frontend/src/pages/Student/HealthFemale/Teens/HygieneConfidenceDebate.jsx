import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneConfidenceDebate = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Should teens practice daily hygiene for confidence?",
      options: [
        {
          id: "a",
          text: "Yes, daily hygiene builds confidence",
          emoji: "👍",
          description: "Regular hygiene makes you feel fresh and confident",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, hygiene doesn't matter",
          emoji: "👎",
          description: "Poor hygiene affects self-esteem and social interactions",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only for special occasions",
          emoji: "🎭",
          description: "Daily hygiene builds consistent confidence",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What happens when teens have poor hygiene?",
      options: [
        {
          id: "a",
          text: "Nothing changes",
          emoji: "😊",
          description: "Poor hygiene affects social interactions",
          isCorrect: false
        },
        {
          id: "b",
          text: "Lower self-confidence",
          emoji: "😔",
          description: "Body odor and unclean appearance reduce confidence",
          isCorrect: true
        },
        {
          id: "c",
          text: "More friends",
          emoji: "👥",
          description: "Poor hygiene usually pushes people away",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How does daily hygiene help teen confidence?",
      options: [
        {
          id: "a",
          text: "Makes no difference",
          emoji: "😐",
          description: "Hygiene is key to feeling good about yourself",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only helps appearance",
          emoji: "💅",
          description: "Hygiene affects both appearance and self-esteem",
          isCorrect: false
        },
        {
          id: "c",
          text: "Feel fresh and ready for anything",
          emoji: "✨",
          description: "Clean teens feel prepared and self-assured",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "How does good hygiene affect social interactions?",
      options: [
        {
          id: "a",
          text: "Doesn't affect how people treat you",
          emoji: "😕",
          description: "Hygiene impacts social acceptance and comfort",
          isCorrect: false
        },
        {
          id: "b",
          text: "Makes others comfortable around you",
          emoji: "🤝",
          description: "Good hygiene shows respect for yourself and others",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only matters for dating",
          emoji: "💕",
          description: "Hygiene is important in all social situations",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the long-term benefit of teen hygiene habits?",
      options: [
        {
          id: "a",
          text: "Only temporary benefit",
          emoji: "⏰",
          description: "Teen hygiene habits shape adult confidence",
          isCorrect: false
        },
        {
          id: "b",
          text: "No lasting impact",
          emoji: "🤷",
          description: "Hygiene habits affect mental and physical health long-term",
          isCorrect: false
        },
        {
          id: "c",
          text: "Builds lifelong confidence and health",
          emoji: "🌟",
          description: "Good habits formed in teens last a lifetime",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(2, true);
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
    navigate("/student/health-female/teens/self-care-journal");
  };

  return (
    <GameShell
      title="Debate: Hygiene = Confidence?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      gameId="health-female-teen-6"
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
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 2}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Hygiene Confidence Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default HygieneConfidenceDebate;