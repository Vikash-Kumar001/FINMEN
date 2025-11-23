import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NeighbourStory = () => {
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
      text: "You see your neighbor littering in the community park. What's your civic duty?",
      options: [
        {
          id: "a",
          text: "Join them since everyone does it",
          emoji: "🗑️",
          description: "That's not responsible. As a community member, you should help keep shared spaces clean.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Politely remind them about keeping the park clean",
          emoji: "🌱",
          description: "That's right! Being a good neighbor means helping maintain our shared community spaces.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore it since it's not your property",
          emoji: "🙈",
          description: "While it might seem easier to ignore, civic duties include taking care of our shared community spaces.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "An elderly neighbor needs help carrying groceries but you're in a hurry. What should you do?",
      options: [
        {
          id: "a",
          text: "Quickly offer to help since it's the right thing to do",
          emoji: "🤗",
          description: "Perfect! Helping neighbors in need is an important civic duty that strengthens community bonds.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Continue on your way since you're busy",
          emoji: "🏃",
          description: "While we all have our own responsibilities, taking a moment to help neighbors builds a caring community.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell them to ask someone else for help",
          emoji: "🤷",
          description: "That's not being a good neighbor. Civic duties include helping others when we can.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You notice a neighbor's house has a broken window after a storm. What's your responsibility?",
      options: [
        {
          id: "a",
          text: "Inform the neighbor so they can get it fixed",
          emoji: "📢",
          description: "Great! Looking out for neighbors' safety and property is part of being a responsible community member.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Mind your own business and stay inside",
          emoji: "🚪",
          description: "While safety is important, being a good neighbor sometimes means helping others notice potential hazards.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Post about it on social media",
          emoji: "📱",
          description: "That's not helpful. The best approach is to communicate directly with your neighbor about safety concerns.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your neighbor's dog is barking loudly late at night, disturbing everyone. What should you do?",
      options: [
        {
          id: "a",
          text: "Bang on their door to make them stop",
          emoji: "💢",
          description: "That's not the best approach. There are more respectful ways to address neighborhood concerns.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Politely talk to them the next day about the noise",
          emoji: "💬",
          description: "That's right! Addressing concerns respectfully helps maintain good relationships while solving problems.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Call the police immediately",
          emoji: "👮",
          description: "While noise can be disruptive, it's better to first try addressing it directly with your neighbor.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You see a neighbor put out recycling on the wrong day. What's the kind thing to do?",
      options: [
        {
          id: "a",
          text: "Leave a polite note about the correct pickup day",
          emoji: "📝",
          description: "Perfect! Small acts of kindness like this help build a caring and informed community.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Move their recycling to the correct day yourself",
          emoji: "♻️",
          description: "While helpful, it's better to inform them so they can learn the correct schedule for next time.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell other neighbors about their mistake",
          emoji: "🗣️",
          description: "That's not respectful. It's better to address the issue directly and kindly with the person involved.",
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
      title="Neighbour Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-78"
      gameType="civic-responsibility"
      totalLevels={80}
      currentLevel={78}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
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

export default NeighbourStory;