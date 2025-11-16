import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeriodPainStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A girl experiences cramps during her period. What helps manage the pain?",
      options: [
        {
          id: "a",
          text: "Rest and use of a hot water bottle",
          emoji: "🛋️",
          description: "Rest and heat therapy are effective ways to manage menstrual cramps",
          isCorrect: true
        },
        {
          id: "b",
          text: "Intense exercise despite the pain",
          emoji: "🏋️",
          description: "While light exercise can help, intense exercise during severe cramps may worsen discomfort",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignoring the pain completely",
          emoji: "🙈",
          description: "Ignoring severe pain isn't healthy - it's important to manage it appropriately",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which over-the-counter medication can help with period cramps?",
      options: [
        {
          id: "a",
          text: "Ibuprofen or paracetamol",
          emoji: "💊",
          description: "These medications are commonly recommended for menstrual pain relief",
          isCorrect: true
        },
        {
          id: "b",
          text: "Antibiotics",
          emoji: "🦠",
          description: "Antibiotics treat infections, not menstrual cramps",
          isCorrect: false
        },
        {
          id: "c",
          text: "Caffeine pills",
          emoji: "☕",
          description: "Caffeine may actually worsen cramps for some people",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "When should someone seek medical help for period pain?",
      options: [
        {
          id: "a",
          text: "If pain is severe and interferes with daily activities",
          emoji: "🏥",
          description: "Severe pain that disrupts normal activities should be evaluated by a healthcare provider",
          isCorrect: true
        },
        {
          id: "b",
          text: "For any mild discomfort during periods",
          emoji: "⚠️",
          description: "Mild discomfort is normal - medical help is needed only for severe cases",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only during the first period",
          emoji: "🆕",
          description: "Medical help depends on pain severity, not just the timing of periods",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Which lifestyle factor can help reduce period pain?",
      options: [
        {
          id: "a",
          text: "Regular exercise and healthy diet",
          emoji: "🥗",
          description: "Regular physical activity and a balanced diet can help reduce menstrual pain",
          isCorrect: true
        },
        {
          id: "b",
          text: "Eating only junk food",
          emoji: "🍔",
          description: "Unhealthy eating habits may actually worsen period symptoms",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding all physical activity",
          emoji: "🛋️",
          description: "Complete inactivity can actually make cramps worse",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is a common emotional support strategy during periods?",
      options: [
        {
          id: "a",
          text: "Talking to trusted friends or family",
          emoji: "💬",
          description: "Emotional support from trusted people helps manage period-related stress",
          isCorrect: true
        },
        {
          id: "b",
          text: "Isolating oneself completely",
          emoji: "🔇",
          description: "Isolation can increase stress and make the experience more difficult",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding all social interactions",
          emoji: "🙅",
          description: "Healthy social connections are important for emotional well-being",
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
    navigate("/student/health-female/teens/debate-talking-about-periods");
  };

  return (
    <GameShell
      title="Period Pain Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-35"
      gameType="health-female"
      totalLevels={40}
      currentLevel={35}
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

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              {getCurrentQuestion().text}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map((option) => (
              <div
                key={option.id}
                onClick={() => !choices.find(c => c.question === currentQuestion) && handleChoice(option.id)}
                className={`bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  choices.find(c => c.question === currentQuestion)?.optionId === option.id
                    ? option.isCorrect
                      ? "border-green-400 bg-green-500/20"
                      : "border-red-400 bg-red-500/20"
                    : "border-white/30 hover:border-purple-400"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <span className="text-4xl">{option.emoji}</span>
                  <span className="text-white font-medium">{option.text}</span>
                </div>
                
                {choices.find(c => c.question === currentQuestion)?.optionId === option.id && (
                  <div className={`mt-3 p-2 rounded-lg text-sm ${
                    option.isCorrect ? "bg-green-500/30 text-green-200" : "bg-red-500/30 text-red-200"
                  }`}>
                    {option.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default PeriodPainStory;