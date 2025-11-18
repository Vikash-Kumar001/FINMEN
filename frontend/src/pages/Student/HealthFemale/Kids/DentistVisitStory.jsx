import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DentistVisitStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Doctor says: Visit dentist twice a year. Should you?",
      options: [
        {
          id: "a",
          text: "Yes, regular checkups prevent tooth problems",
          emoji: "😁",
          description: "Exactly! Regular dental checkups help catch problems early and keep your teeth healthy and strong.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, I'm scared of the dentist",
          emoji: "😨",
          description: "While it's normal to feel nervous, dentists are trained to help you. Regular visits actually make dental care easier and less scary.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The dentist finds a small cavity. What should you do?",
      options: [
        {
          id: "a",
          text: "Get it treated early to prevent bigger problems",
          emoji: "🛠️",
          description: "Great choice! Early treatment prevents cavities from growing and causing more serious problems or pain.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it since it doesn't hurt yet",
          emoji: "⏳",
          description: "Ignoring dental problems usually makes them worse. Small issues are easier and less expensive to fix early.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Dentist recommends fluoride treatment. Should you get it?",
      options: [
        {
          id: "a",
          text: "Yes, it strengthens teeth and prevents cavities",
          emoji: "💪",
          description: "Perfect! Fluoride treatments help strengthen tooth enamel and prevent cavities. They're safe and effective.",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, it's unnecessary",
          emoji: "🙅‍♀️",
          description: "Fluoride treatments are beneficial for tooth health, especially for children. They help prevent tooth decay and strengthen enamel.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You feel nervous about your dental visit. What's best?",
      options: [
        {
          id: "a",
          text: "Talk to your parents and dentist about your concerns",
          emoji: "💬",
          description: "Wonderful! Communicating your feelings helps adults support you and dentists explain procedures to reduce anxiety.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid going to the dentist altogether",
          emoji: "🏃",
          description: "Avoiding the dentist can lead to more serious dental problems. Dentists are trained to help patients feel comfortable.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After cleaning, dentist says you have healthy teeth. How do you feel?",
      options: [
        {
          id: "a",
          text: "Proud and motivated to keep up good habits",
          emoji: "😊",
          description: "Excellent! Feeling proud of your dental health motivates you to continue good brushing, flossing, and eating habits.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Relieved but don't plan to change habits",
          emoji: "😌",
          description: "While relief is natural, maintaining healthy habits is important for continued good dental health.",
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
      title="Dentist Visit Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-78"
      gameType="health-female"
      totalLevels={80}
      currentLevel={78}
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

export default DentistVisitStory;