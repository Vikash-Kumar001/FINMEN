import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmokingStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your friend finds cigarettes and offers you one. What should you do?",
      options: [
        {
          id: "b",
          text: "Try it to fit in with friends",
          emoji: "🚬",
          description: "Smoking harms your lungs and health - it's never safe to try",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and explain why it's bad",
          emoji: "🙅",
          description: "Saying no shows strength and protects your health",
          isCorrect: true
        },
        {
          id: "c",
          text: "Take it but don't smoke it",
          emoji: "🤏",
          description: "Even holding cigarettes can be dangerous",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend says 'Everyone tries smoking, it's no big deal.' How do you respond?",
      options: [
        {
          id: "c",
          text: "Agree and try it",
          emoji: "😅",
          description: "Real friends respect when you say no to harmful things",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say 'I choose not to smoke'",
          emoji: "💪",
          description: "Making healthy choices shows maturity and self-respect",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ask why they want to smoke",
          emoji: "🤔",
          description: "It's better to firmly say no than question others",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Someone says smoking makes you look cool. What do you think?",
      options: [
        {
          id: "b",
          text: "I want to look cool too",
          emoji: "😎",
          description: "Real coolness comes from being healthy and confident",
          isCorrect: false
        },
        {
          id: "a",
          text: "Being healthy is cooler than smoking",
          emoji: "🌟",
          description: "Healthy choices show real strength and confidence",
          isCorrect: true
        },
        {
          id: "c",
          text: "Maybe just try once",
          emoji: "🤷",
          description: "Even trying once can start a dangerous habit",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your older cousin smokes and says it's okay for kids too. What do you do?",
      options: [
        {
          id: "c",
          text: "Listen to your cousin",
          emoji: "👂",
          description: "Family should protect you, not encourage harmful habits",
          isCorrect: false
        },
        {
          id: "a",
          text: "Tell a trusted adult about it",
          emoji: "🗣️",
          description: "Adults can help protect you from dangerous influences",
          isCorrect: true
        },
        {
          id: "b",
          text: "Try it secretly",
          emoji: "🤫",
          description: "Secret habits are never safe or healthy",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can you help a friend who wants to try smoking?",
      options: [
        {
          id: "b",
          text: "Try it together",
          emoji: "👫",
          description: "Help friends make healthy choices instead",
          isCorrect: false
        },
        {
          id: "c",
          text: "Say nothing and let them decide",
          emoji: "🤐",
          description: "Good friends help each other stay safe",
          isCorrect: false
        },
        {
          id: "a",
          text: "Explain why smoking is harmful",
          emoji: "🛡️",
          description: "Sharing health knowledge helps protect your friends",
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
    navigate("/student/health-male/kids/quiz-substances");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Smoking Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-81"
      gameType="health-male"
      totalLevels={90}
      currentLevel={81}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
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

export default SmokingStory;
