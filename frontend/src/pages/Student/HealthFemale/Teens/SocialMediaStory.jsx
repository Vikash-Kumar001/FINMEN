import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SocialMediaStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A teen feels bad after comparing her life to edited photos online. What should she do?",
      options: [
        {
          id: "a",
          text: "Limit social media and focus on real life",
          emoji: "📵",
          description: "Reducing exposure to unrealistic content improves well-being",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spend more time scrolling to feel better",
          emoji: "📱",
          description: "More exposure often increases negative feelings",
          isCorrect: false
        },
        {
          id: "c",
          text: "Try to post more perfect photos herself",
          emoji: "📸",
          description: "This perpetuates the cycle of unrealistic comparisons",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How can social media affect self-esteem?",
      options: [
        {
          id: "a",
          text: "By always showing authentic real-life experiences",
          emoji: "👩",
          description: "Most social media content is curated and enhanced",
          isCorrect: false
        },
        {
          id: "b",
          text: "By showing unrealistic, edited versions of reality",
          emoji: "🎭",
          description: "Edited content creates unattainable standards",
          isCorrect: true
        },
        {
          id: "c",
          text: "By having no impact on how we see ourselves",
          emoji: "😐",
          description: "Social media significantly influences self-perception",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's a healthy approach to social media use?",
      options: [
        {
          id: "a",
          text: "Use it whenever feeling bored or sad",
          emoji: "🔄",
          description: "Using social media to cope can create dependency",
          isCorrect: false
        },
        {
          id: "b",
          text: "Set time limits and curate positive content",
          emoji: "⏰",
          description: "Mindful usage promotes well-being",
          isCorrect: true
        },
        {
          id: "c",
          text: "Avoid it completely at all costs",
          emoji: "🚫",
          description: "Complete avoidance may not be necessary or realistic",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How should you handle negative comments online?",
      options: [
        {
          id: "a",
          text: "Respond aggressively to defend yourself",
          emoji: "😠",
          description: "This often escalates conflicts and stress",
          isCorrect: false
        },
        {
          id: "b",
          text: "Don't engage and block if necessary",
          emoji: "🛡️",
          description: "Protecting mental health is important",
          isCorrect: true
        },
        {
          id: "c",
          text: "Read all comments, even hurtful ones",
          emoji: "😢",
          description: "Exposure to negativity harms mental health",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the benefit of taking breaks from social media?",
      options: [
        {
          id: "a",
          text: "Missing out on important updates",
          emoji: "❓",
          description: "Most updates aren't as urgent as they seem",
          isCorrect: false
        },
        {
          id: "b",
          text: "Being seen as antisocial by friends",
          emoji: "👥",
          description: "True friends understand the need for balance",
          isCorrect: false
        },
        {
          id: "c",
          text: "Improved focus, sleep, and real-world connections",
          emoji: "😴",
          description: "Breaks restore balance and reduce anxiety",
          isCorrect: true
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
    navigate("/student/health-female/teens/debate-beauty-confidence");
  };

  return (
    <GameShell
      title="Social Media Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-65"
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

export default SocialMediaStory;