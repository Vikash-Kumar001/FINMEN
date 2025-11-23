import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationHospitalVisit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Hospital Visit",
      description: "You visit your sick classmate in the hospital. When you enter the room, you see them lying in bed looking pale and tired.",
      options: [
        {
          id: "a",
          text: "Cheer them up with encouraging words and a smile",
          emoji: "😊",
          description: "That's right! Bringing positive energy and encouragement helps lift their spirits during a difficult time.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stay silent because you don't know what to say",
          emoji: "🤐",
          description: "That's not the best approach. Your presence and kind words can make a big difference to someone who is sick.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore them and check your phone",
          emoji: "📱",
          description: "That's not kind. Visiting someone in the hospital is about showing you care and providing companionship.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Gift Decision",
      description: "You want to bring something to make your sick classmate feel better. What do you choose?",
      options: [
        {
          id: "a",
          text: "A get-well-soon card with a heartfelt message",
          emoji: "💌",
          description: "Perfect! A thoughtful card with kind words shows you care and gives them something meaningful to keep.",
          isCorrect: true
        },
        {
          id: "b",
          text: "An expensive gadget they asked for",
          emoji: "📱",
          description: "That's not necessary. Thoughtful gestures matter more than expensive gifts, especially when someone is sick.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing - they probably don't want visitors",
          emoji: "❌",
          description: "That's not compassionate. Most people appreciate visits and kind gestures when they're recovering.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Conversation Topic",
      description: "During your visit, what's the best thing to talk about?",
      options: [
        {
          id: "a",
          text: "Share positive updates about school and friends",
          emoji: "🏫",
          description: "Great choice! Sharing positive news helps distract them from their illness and keeps their spirits up.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ask detailed questions about their illness and treatment",
          emoji: "🤒",
          description: "That might make them uncomfortable. Let them share what they want to share without prying.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Complain about your own problems",
          emoji: "😤",
          description: "That's not considerate. When someone is sick, the focus should be on making them feel better, not adding to their stress.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Visit Duration",
      description: "How long should you stay during your hospital visit?",
      options: [
        {
          id: "a",
          text: "A short but meaningful visit (15-20 minutes)",
          emoji: "⏱️",
          description: "Wonderful! Short visits are considerate of their energy levels and hospital rules while still showing you care.",
          isCorrect: true
        },
        {
          id: "b",
          text: "As long as you want, since you came all this way",
          emoji: "⏳",
          description: "That's not considerate. Long visits can tire patients and may interfere with their rest and medical care.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Just a quick hello and then leave immediately",
          emoji: "🏃",
          description: "That's too brief. While you shouldn't overstay, a quick hello doesn't provide the comfort and connection they need.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Follow-up",
      description: "After your hospital visit, what should you do?",
      options: [
        {
          id: "a",
          text: "Check in with them or their family periodically",
          emoji: "📞",
          description: "Excellent! Following up shows ongoing care and support throughout their recovery journey.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Forget about them until you see them at school",
          emoji: "😶",
          description: "That's not compassionate. Continuing to show support during recovery is an important part of caring for others.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell all your friends about their illness",
          emoji: "🗣️",
          description: "That's a breach of privacy. Personal health information should be kept confidential out of respect.",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentScenario().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { scenario: currentScenario, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Hospital Visit"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-8"
      gameType="civic-responsibility"
      totalLevels={10}
      currentLevel={8}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-4">
            {getCurrentScenario().title}
          </h2>
          
          <p className="text-white/90 mb-6">
            {getCurrentScenario().description}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentScenario().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={choices.some(c => c.scenario === currentScenario)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    {choices.some(c => c.scenario === currentScenario && c.optionId === option.id) && (
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

export default SimulationHospitalVisit;