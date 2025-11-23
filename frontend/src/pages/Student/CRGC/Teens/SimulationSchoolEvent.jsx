import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationSchoolEvent = () => {
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
      title: "School Project Team",
      description: "Your group project team is excluding a new classmate who seems eager to help. What do you do?",
      options: [
        {
          id: "a",
          text: "Add her to your team and give her a meaningful task",
          emoji: "👥",
          description: "That's right! Including the new classmate shows leadership and creates a welcoming environment.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the situation and let your teammates decide",
          emoji: "🤐",
          description: "That's not inclusive. Taking action to include others helps create a positive group dynamic.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Laugh at the new classmate for wanting to join",
          emoji: "😂",
          description: "That's hurtful. Making fun of someone who wants to participate damages the classroom environment.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Lunch Table",
      description: "You notice a student sitting alone at lunch while your friends make fun of them. How do you respond?",
      options: [
        {
          id: "a",
          text: "Tell your friends to stop and invite the student to join you",
          emoji: "✋",
          description: "Perfect! Standing up against bullying and including others shows true friendship and character.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Join in the teasing to fit in with your friends",
          emoji: "😈",
          description: "That's not kind. Joining in bullying hurts others and damages your own integrity.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stay silent to avoid conflict with your friends",
          emoji: "😶",
          description: "That's not helpful. Silence enables bullying behavior and leaves the victim feeling unsupported.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Class Discussion",
      description: "During a class discussion, a student with a speech impediment wants to share their opinion but is being talked over. What do you do?",
      options: [
        {
          id: "a",
          text: "Signal for quiet and encourage the student to finish speaking",
          emoji: "🤫",
          description: "Great choice! Giving everyone a chance to speak shows respect and creates an inclusive environment.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Laugh at the student's speech impediment",
          emoji: "😆",
          description: "That's hurtful. Making fun of someone's speech impediment is a form of bullying and shows disrespect.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the situation and focus on your own work",
          emoji: "📖",
          description: "That's not inclusive. Taking action to support others helps create a respectful classroom environment.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "School Event Planning",
      description: "Your class is planning a school event, but students with disabilities weren't consulted about accessibility. What should you do?",
      options: [
        {
          id: "a",
          text: "Suggest including students with disabilities in the planning process",
          emoji: "♿",
          description: "Wonderful! Including all students in planning ensures everyone can participate fully and feel valued.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the accessibility issue to save time",
          emoji: "⏰",
          description: "That's not inclusive. Ignoring accessibility needs excludes students and creates barriers to participation.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Complain that including everyone will make planning more complicated",
          emoji: "😤",
          description: "That's not considerate. Making inclusion a priority is worth the extra effort to ensure everyone can participate.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Cultural Celebration",
      description: "Your school is planning a cultural celebration but only includes traditions from the majority culture. How should you respond?",
      options: [
        {
          id: "a",
          text: "Suggest including traditions from all cultures represented in the school",
          emoji: "🌍",
          description: "Excellent! Including all cultures in celebrations helps everyone feel valued and promotes understanding.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Accept that only majority cultures matter",
          emoji: "👑",
          description: "That's not inclusive. All cultures deserve recognition and celebration in a diverse school community.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stay silent to avoid rocking the boat",
          emoji: "🤐",
          description: "That's not helpful. Speaking up for inclusion helps create a more welcoming environment for everyone.",
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
      title="Simulation: School Event"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-18"
      gameType="civic-responsibility"
      totalLevels={20}
      currentLevel={18}
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

export default SimulationSchoolEvent;