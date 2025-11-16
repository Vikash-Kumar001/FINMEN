import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NocturnalEmissionStoryTeen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You wake up and notice wet sheets and pajamas. What's your first thought?",
      options: [
        {
          id: "a",
          text: "I must have peed the bed",
          emoji: "🤔",
          description: "Wet dreams are different from bedwetting",
          isCorrect: false
        },
        {
          id: "b",
          text: "This is a normal wet dream",
          emoji: "😌",
          description: "Nocturnal emissions are natural during puberty",
          isCorrect: true
        },
        {
          id: "c",
          text: "Something is seriously wrong",
          emoji: "😰",
          description: "Wet dreams are completely normal for teen boys",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You feel embarrassed about the wet dream. What should you do?",
      options: [
        {
          id: "a",
          text: "Worry it will happen again",
          emoji: "😟",
          description: "Wet dreams are temporary and decrease with age",
          isCorrect: false
        },
        {
          id: "b",
          text: "Hide it and not tell anyone",
          emoji: "🙈",
          description: "It's okay to talk to trusted adults about puberty",
          isCorrect: false
        },
        {
          id: "c",
          text: "Understand it's completely normal",
          emoji: "🧠",
          description: "Wet dreams happen to most teen boys",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Your friend mentions having wet dreams. How do you respond?",
      options: [
        {
          id: "a",
          text: "Explain it's normal puberty",
          emoji: "💪",
          description: "Supporting friends helps reduce stigma",
          isCorrect: true
        },
        {
          id: "b",
          text: "Change the subject quickly",
          emoji: "😶",
          description: "Open discussion helps everyone feel normal",
          isCorrect: false
        },
        {
          id: "c",
          text: "Say it's weird and gross",
          emoji: "😖",
          description: "Wet dreams are natural and not embarrassing",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You want to know more about wet dreams. What do you do?",
      options: [
        {
          id: "a",
          text: "Look it up online",
          emoji: "🔍",
          description: "Be careful to use reliable health sources",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask a trusted adult",
          emoji: "👨‍🏫",
          description: "Adults can provide accurate information",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ask friends only",
          emoji: "👥",
          description: "Friends might not have accurate information",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You have another wet dream. How do you feel?",
      options: [
        {
          id: "a",
          text: "Worried and ashamed",
          emoji: "😔",
          description: "Wet dreams are nothing to be ashamed of",
          isCorrect: false
        },
        {
          id: "b",
          text: "Angry at your body",
          emoji: "😠",
          description: "Your body is developing normally",
          isCorrect: false
        },
        {
          id: "c",
          text: "Accept it's part of growing up",
          emoji: "🌱",
          description: "Wet dreams are a normal part of male puberty",
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
    navigate("/student/health-male/teens/reproductive-health-debate-teen");
  };

  return (
    <GameShell
      title="Nocturnal Emission Story (Teen)"
      subtitle={`Experience ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 5}
      gameId="health-male-teen-35"
      gameType="health-male"
      totalLevels={100}
      currentLevel={35}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 35/100</span>
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

export default NocturnalEmissionStoryTeen;
