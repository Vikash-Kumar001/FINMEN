import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PlaygroundStory3 = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "The teacher only lets boys play football during recess. Is this fair?",
      options: [
        {
          id: "a",
          text: "Yes, boys are stronger",
          emoji: "💪",
          description: "That's not fair. Strength doesn't determine who should be allowed to play sports.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, everyone should have a chance to play",
          emoji: "⚽",
          description: "That's right! Everyone should have equal opportunities to participate in activities.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "Some girls want to play football too. How should the teacher respond?",
      options: [
        {
          id: "a",
          text: "Create separate teams for boys and girls",
          emoji: "👥",
          description: "That's a good approach! Separate teams can ensure everyone gets a chance to play.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tell girls to watch from the sidelines",
          emoji: "👀",
          description: "That's not inclusive. Everyone should be able to participate in school activities.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What if some boys don't want girls on their team?",
      options: [
        {
          id: "a",
          text: "Let the boys decide who can play",
          emoji: "👦",
          description: "That's not fair. Excluding others based on gender isn't right.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Explain that everyone has the right to play",
          emoji: "🤝",
          description: "Perfect! Everyone has the right to participate in school activities regardless of gender.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "How can you support equal opportunities in your school?",
      options: [
        {
          id: "a",
          text: "Speak up when you see unfair treatment",
          emoji: "📢",
          description: "That's right! Standing up for fairness helps create a more inclusive environment.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it to avoid conflict",
          emoji: "🤐",
          description: "That's not helpful. Ignoring unfair treatment allows it to continue.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should the school do to ensure all students have fun during recess?",
      options: [
        {
          id: "a",
          text: "Offer a variety of activities for everyone",
          emoji: "🎪",
          description: "Excellent! Different activities can accommodate different interests and abilities.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stick to traditional gender-based activities",
          emoji: "🧱",
          description: "That's not inclusive. Activities should be open to all students regardless of gender.",
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Playground Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-61"
      gameType="civic-responsibility"
      totalLevels={70}
      currentLevel={61}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
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

export default PlaygroundStory3;