import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const VaccineStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "The doctor says you need a vaccine shot to protect against diseases. What should you do?",
      options: [
        {
          id: "b",
          text: "Refuse the shot",
          emoji: "❌",
          description: "Vaccines protect you and others from serious diseases",
          isCorrect: false
        },
        {
          id: "a",
          text: "Take the vaccine shot",
          emoji: "💉",
          description: "Vaccines help your body fight diseases before they make you sick",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ask to wait until you're older",
          emoji: "⏰",
          description: "It's important to get vaccines on time for best protection",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your parent explains that vaccines help prevent diseases like measles. How do you feel?",
      options: [
        {
          id: "c",
          text: "Scared of the needle",
          emoji: "😨",
          description: "It's normal to feel scared, but vaccines are safe and important",
          isCorrect: false
        },
        {
          id: "a",
          text: "Safe knowing it's protecting you",
          emoji: "🛡️",
          description: "Vaccines are like a shield against dangerous diseases",
          isCorrect: true
        },
        {
          id: "b",
          text: "Confused about why you need it",
          emoji: "😕",
          description: "Asking questions about vaccines is good - they keep you healthy",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "The nurse gives you a sticker after your vaccine. What does this mean?",
      options: [
        {
          id: "b",
          text: "You did something wrong",
          emoji: "😞",
          description: "Stickers are rewards for being brave during vaccines",
          isCorrect: false
        },
        {
          id: "a",
          text: "You were brave and got protected",
          emoji: "⭐",
          description: "Getting vaccines shows courage and helps keep you healthy",
          isCorrect: true
        },
        {
          id: "c",
          text: "You can skip school now",
          emoji: "🏫",
          description: "Vaccines help you stay in school by preventing sickness",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your friend says vaccines hurt and you shouldn't get them. What do you think?",
      options: [
        {
          id: "c",
          text: "Listen to your friend",
          emoji: "👥",
          description: "Always trust doctors and parents about health decisions",
          isCorrect: false
        },
        {
          id: "a",
          text: "Trust your doctor and get vaccinated",
          emoji: "👩‍⚕️",
          description: "Doctors know vaccines are safe and important for health",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hide from the doctor",
          emoji: "🙈",
          description: "Facing health care bravely helps you stay strong",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After getting vaccinated, how do you help others?",
      options: [
        {
          id: "b",
          text: "Keep it a secret",
          emoji: "🤐",
          description: "Sharing about vaccines helps others understand their importance",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell friends to be scared",
          emoji: "😱",
          description: "Encourage friends that vaccines are safe and helpful",
          isCorrect: false
        },
        {
          id: "a",
          text: "Help protect the community from diseases",
          emoji: "🌍",
          description: "When you get vaccinated, you help protect everyone around you",
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
    navigate("/student/health-male/kids/quiz-safety");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Vaccine Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-71"
      gameType="health-male"
      totalLevels={80}
      currentLevel={71}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
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

export default VaccineStory;
