import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BloodDonationCampStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Teen is too young to donate blood. How else can she help?",
      options: [
        {
          id: "a",
          text: "Stay home since she can't donate",
          emoji: "🏠",
          description: "That's not helpful. There are many ways to contribute to a blood donation camp even if you can't donate.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Assist with organizing and supporting the camp",
          emoji: "🤝",
          description: "That's right! Helping with organization, registration, or providing refreshments is valuable support.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Tell others not to donate blood",
          emoji: "🚫",
          description: "That's not right. Blood donation saves lives, and discouraging it harms those in need.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "At the camp, she notices someone feeling nervous about donating. What should she do?",
      options: [
        {
          id: "a",
          text: "Ignore them and focus on her own tasks",
          emoji: "😶",
          description: "That's not compassionate. Offering support to someone who's nervous can make a big difference.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Offer words of encouragement and stay nearby",
          emoji: "🤗",
          description: "Perfect! Providing emotional support helps nervous donors feel more comfortable and confident.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Tell them to just get over their fear",
          emoji: "😤",
          description: "That's not supportive. Fear is natural, and dismissing someone's feelings isn't helpful.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "She sees volunteers running low on supplies. How should she respond?",
      options: [
        {
          id: "a",
          text: "Point it out to the coordinator and offer to help restock",
          emoji: "📋",
          description: "That's right! Being observant and proactive in offering help keeps the camp running smoothly.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wait for someone else to notice and handle it",
          emoji: "🕰️",
          description: "That's not proactive. Taking initiative when you see a need helps the entire operation.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Complain about poor organization to other volunteers",
          emoji: "😠",
          description: "That's not constructive. Criticizing doesn't solve problems and can create negativity.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "After the camp, she reflects on her experience. What's the most important lesson?",
      options: [
        {
          id: "a",
          text: "That every contribution, big or small, matters",
          emoji: "🌟",
          description: "Perfect! Recognizing that all contributions have value encourages continued community involvement.",
          isCorrect: true
        },
        {
          id: "b",
          text: "That she should wait until she's old enough to donate",
          emoji: "⏳",
          description: "That's not the main point. While age restrictions exist, there are always ways to contribute regardless of age.",
          isCorrect: false
        },
        {
          id: "c",
          text: "That organizing events is more important than participating",
          emoji: "📋",
          description: "That's not right. Both organizing and participating are valuable, and one isn't inherently more important.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How might she apply what she learned to future volunteer opportunities?",
      options: [
        {
          id: "a",
          text: "Look for ways to support causes even when she can't directly participate",
          emoji: "🌱",
          description: "That's right! This approach allows her to contribute meaningfully to causes she cares about in various ways.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only volunteer for activities she can personally benefit from",
          emoji: "🎁",
          description: "That's not the spirit of volunteering. Volunteer work is about helping others and contributing to the community.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid volunteering until she's old enough for all activities",
          emoji: "😴",
          description: "That's not helpful. There are always opportunities to volunteer and make a positive impact regardless of age.",
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
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Blood Donation Camp Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-51"
      gameType="civic-responsibility"
      totalLevels={60}
      currentLevel={51}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-4">
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

export default BloodDonationCampStory;