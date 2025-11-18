import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ScreenTimeStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Should you use mobile all night or sleep early?",
      options: [
        {
          id: "a",
          text: "Sleep early for good health and focus",
          emoji: "😴",
          description: "Exactly! Getting enough sleep is essential for your physical and mental health, and helps you focus better during the day.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Use mobile all night for entertainment",
          emoji: "📱",
          description: "Using mobile all night can disrupt your sleep cycle and affect your health, mood, and ability to focus the next day.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friends are chatting online late at night. What do you do?",
      options: [
        {
          id: "a",
          text: "Join them but set a time limit for yourself",
          emoji: "⏰",
          description: "Great choice! Setting boundaries helps you maintain healthy habits while still enjoying social connections.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay up all night to keep up with conversations",
          emoji: "👥",
          description: "Staying up all night can negatively impact your health and school performance. True friends respect your need for sleep.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You feel tired during school after using your phone late. What should you change?",
      options: [
        {
          id: "a",
          text: "Set a specific time to stop using devices before bed",
          emoji: "🕘",
          description: "Perfect! Creating a bedtime routine without screens helps improve sleep quality and energy levels.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the tiredness and continue your habits",
          emoji: "😴",
          description: "Ignoring the signs of poor sleep habits can lead to ongoing health and academic problems.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You want to reduce screen time. What's a good strategy?",
      options: [
        {
          id: "a",
          text: "Replace screen time with reading or outdoor activities",
          emoji: "📚",
          description: "Wonderful! Finding healthy alternatives helps you develop a more balanced lifestyle.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just try to use devices less without a plan",
          emoji: "🤔",
          description: "Having a specific plan with alternatives is more effective than just trying to reduce usage without a strategy.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You learn that good sleep improves concentration. How does this make you feel?",
      options: [
        {
          id: "a",
          text: "Motivated to prioritize sleep over late-night screen time",
          emoji: "💪",
          description: "Excellent! Understanding the benefits of sleep reinforces your commitment to healthy habits.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Think you can function well without much sleep",
          emoji: "🤷",
          description: "Most people need 8-10 hours of sleep for optimal health and performance. Consistent good sleep is important for everyone.",
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
      title="Screen-Time Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-95"
      gameType="health-female"
      totalLevels={100}
      currentLevel={95}
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

export default ScreenTimeStory;