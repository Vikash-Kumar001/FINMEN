import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TrafficStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You're walking with your friends and you see a red light. What should you do?",
      options: [
        {
          id: "a",
          text: "Cross quickly before cars come",
          emoji: "🏃",
          description: "That's dangerous! Red lights mean stop for a reason - to keep pedestrians safe.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Wait patiently for the green light",
          emoji: "✋",
          description: "That's right! Following traffic signals keeps everyone safe.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Run back home to avoid crossing",
          emoji: "🏠",
          description: "That's not necessary. Traffic lights are designed to help us cross safely when they turn green.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend wants to jaywalk because they're in a hurry. What do you do?",
      options: [
        {
          id: "a",
          text: "Follow your friend to jaywalk",
          emoji: "👥",
          description: "That's not safe. Following others in breaking rules can put everyone at risk.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell your friend it's dangerous and wait for the signal",
          emoji: "🚦",
          description: "Perfect! Being a good friend means keeping each other safe.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore your friend and walk away",
          emoji: "🚶",
          description: "While safety is important, being a good friend means communicating about safety concerns.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You see a classmate riding a bicycle without a helmet. What should you do?",
      options: [
        {
          id: "a",
          text: "Tell them helmets are important for safety",
          emoji: "⛑️",
          description: "Great! Helmets protect the head in case of accidents.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Join them without a helmet since they're not wearing one",
          emoji: "🚴",
          description: "That's not safe. Safety rules apply to everyone regardless of what others are doing.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell the teacher immediately",
          emoji: "👩‍🏫",
          description: "While safety is important, it's better to first kindly remind your friend about safety rules.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You're in a car and the driver is speeding. What's the right thing to do?",
      options: [
        {
          id: "a",
          text: "Ask the driver to slow down for safety",
          emoji: "🛑",
          description: "That's right! Everyone in the car should speak up about safety concerns.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay quiet to avoid conflict",
          emoji: "🤐",
          description: "Safety is more important than avoiding conflict. Speaking up could prevent an accident.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Start screaming to get attention",
          emoji: "😱",
          description: "That's not helpful. Calmly discussing safety concerns is more effective.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should you do when you see a 'No Entry' sign?",
      options: [
        {
          id: "a",
          text: "Ignore the sign and enter anyway",
          emoji: "🚫",
          description: "That's not safe. Signs are there for important reasons, often related to safety or traffic flow.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Find another route or ask for directions",
          emoji: "🗺️",
          description: "Excellent! Following signs and finding alternative routes keeps everyone safe and prevents confusion.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Climb over the barrier to get through",
          emoji: "🧗",
          description: "That's dangerous. Barriers are there for safety reasons and should not be crossed.",
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
      title="Traffic Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-71"
      gameType="civic-responsibility"
      totalLevels={80}
      currentLevel={71}
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

export default TrafficStory;