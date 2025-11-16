import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeriodHygieneStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A girl doesn't change her pad for many hours. What is the most likely risk?",
      options: [
        {
          id: "a",
          text: "Risk of infection and discomfort",
          emoji: "🦠",
          description: "Exactly! Not changing pads regularly can lead to bacterial growth, infections, and discomfort.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Nothing serious will happen",
          emoji: "😌",
          description: "Prolonged use without changing increases health risks. Regular changes are important for hygiene.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How often should pads or tampons typically be changed during a period?",
      options: [
        {
          id: "a",
          text: "Every 4-8 hours depending on flow",
          emoji: "⏰",
          description: "Perfect! Changing every 4-8 hours prevents leaks, odor, and infection risk. More frequently during heavy flow.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Once per day is sufficient",
          emoji: "📅",
          description: "Once per day is not frequent enough and can lead to health issues. Regular changes are essential.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What's the best way to maintain hygiene during periods?",
      options: [
        {
          id: "a",
          text: "Regular changes, washing hands, and cleaning the area",
          emoji: "🧼",
          description: "Great choice! These practices prevent infections and maintain comfort throughout the period.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only change when it's visibly soiled",
          emoji: "👀",
          description: "Waiting until visible soiling increases infection risk. Proactive hygiene is much more effective.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is hand washing important when changing period products?",
      options: [
        {
          id: "a",
          text: "Prevents transferring bacteria to and from the body",
          emoji: "✋",
          description: "Correct! Hand washing prevents introducing bacteria to the genital area and protects from infections.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It's not necessary if you're careful",
          emoji: "🙅",
          description: "Hand washing is always important to prevent bacterial transfer, regardless of how careful you are.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should you do if you notice unusual odor during your period?",
      options: [
        {
          id: "a",
          text: "Change more frequently and consult a healthcare provider if it persists",
          emoji: "👩‍⚕️",
          description: "Wonderful! Increased frequency and professional advice when needed helps maintain health and address issues.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it as normal period smell",
          emoji: "👃",
          description: "While periods have some odor, unusual or strong smells may indicate infection and should be addressed.",
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
      title="Period Hygiene Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-45"
      gameType="health-female"
      totalLevels={50}
      currentLevel={45}
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

export default PeriodHygieneStory;