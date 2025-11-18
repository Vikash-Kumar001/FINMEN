import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SelfImageStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A teen feels she is not pretty after seeing edited photos online. What should she do?",
      options: [
        {
          id: "a",
          text: "Value herself for who she is",
          emoji: "💖",
          description: "Self-worth comes from within, not appearance",
          isCorrect: true
        },
        {
          id: "b",
          text: "Compare herself to others constantly",
          emoji: "👥",
          description: "Constant comparison damages self-esteem",
          isCorrect: false
        },
        {
          id: "c",
          text: "Try extreme measures to change appearance",
          emoji: "🔍",
          description: "Extreme measures can harm physical and mental health",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should teens view their unique qualities during puberty?",
      options: [
        {
          id: "a",
          text: "As flaws that need fixing",
          emoji: "🔧",
          description: "This mindset can lead to unhealthy behaviors",
          isCorrect: false
        },
        {
          id: "b",
          text: "As strengths that make them special",
          emoji: "🌟",
          description: "Embracing uniqueness builds confidence",
          isCorrect: true
        },
        {
          id: "c",
          text: "As unimportant compared to others",
          emoji: "📉",
          description: "Undervaluing uniqueness reduces self-worth",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's a healthy approach to self-image?",
      options: [
        {
          id: "a",
          text: "Focus only on physical appearance",
          emoji: "🪞",
          description: "Appearance-focused self-image is unstable and limiting",
          isCorrect: false
        },
        {
          id: "b",
          text: "Focus on talents, kindness, and personal growth",
          emoji: "🌱",
          description: "Internal qualities contribute more to happiness than appearance",
          isCorrect: true
        },
        {
          id: "c",
          text: "Avoid thinking about self-image completely",
          emoji: "🙈",
          description: "Healthy self-awareness is important for well-being",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can social media affect self-image?",
      options: [
        {
          id: "a",
          text: "By always showing real bodies",
          emoji: "👩",
          description: "Most social media content is curated and edited",
          isCorrect: false
        },
        {
          id: "b",
          text: "By having no impact on self-perception",
          emoji: "😐",
          description: "Social media significantly influences self-image perceptions",
          isCorrect: false
        },
        {
          id: "c",
          text: "By showing unrealistic edited images",
          emoji: "📱",
          description: "Edited photos create unattainable beauty standards",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What should you do if you're concerned about your self-image?",
      options: [
        {
          id: "a",
          text: "Follow random advice from the internet",
          emoji: "🌐",
          description: "Unverified advice can be harmful or dangerous",
          isCorrect: false
        },
        {
          id: "b",
          text: "Talk to a trusted adult or counselor",
          emoji: "👩‍🏫",
          description: "Professional guidance ensures healthy approaches",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore concerns completely",
          emoji: "🤫",
          description: "Valid concerns deserve appropriate attention",
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
    navigate("/student/health-female/teens/quiz-self-esteem");
  };

  return (
    <GameShell
      title="Self-Image Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-61"
      gameType="health-female"
      totalLevels={10}
      currentLevel={1}
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

export default SelfImageStory;