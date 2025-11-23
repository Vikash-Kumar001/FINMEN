import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SchoolCleanlinessStory = () => {
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
      text: "The classroom is messy with papers and trash everywhere. Some students are complaining about the janitor. What should you do?",
      options: [
        {
          id: "a",
          text: "Join the complaints and blame the janitor",
          emoji: "😠",
          description: "That's not helpful. Complaining doesn't solve the problem and creates a negative environment.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Take initiative to help clean up the classroom",
          emoji: "🧹",
          description: "That's right! Taking action to solve problems shows leadership and civic responsibility.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore the mess and continue with your own work",
          emoji: "😒",
          description: "That's not taking responsibility. A clean environment benefits everyone.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend drops their lunch wrapper on the floor and walks away. What should you do?",
      options: [
        {
          id: "a",
          text: "Tell the teacher immediately to get them in trouble",
          emoji: "👮",
          description: "That's not kind. It's better to approach the situation with understanding.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Pick up the wrapper yourself to keep the school clean",
          emoji: "♻️",
          description: "Perfect! Taking small actions to maintain cleanliness shows civic responsibility.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Leave it for someone else to clean up",
          emoji: "🚶",
          description: "That's not responsible. Everyone should contribute to keeping shared spaces clean.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "There's a broken chair in the classroom that could hurt someone. What's the right thing to do?",
      options: [
        {
          id: "a",
          text: "Report it to the teacher or school authority",
          emoji: "📢",
          description: "Great! Reporting safety hazards helps prevent accidents and shows concern for others.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Move it to a corner where fewer people walk",
          emoji: "🧹",
          description: "That's not sufficient. Hidden hazards can still cause accidents.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore it since it's not your chair",
          emoji: "😒",
          description: "That's not responsible. Everyone should help maintain a safe environment.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "During recess, you notice the school playground has a lot of trash. What should you do?",
      options: [
        {
          id: "a",
          text: "Organize a group of friends to clean it up",
          emoji: "🤝",
          description: "That's right! Taking initiative and involving others creates positive change.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wait for the janitor to clean it up later",
          emoji: "⏰",
          description: "While the janitor does clean, taking initiative shows leadership and responsibility.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Complain to friends about how messy the school is",
          emoji: "😠",
          description: "That's not constructive. Complaining without action doesn't solve the problem.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your class is assigned to clean the library, but some students are slacking off. How should you respond?",
      options: [
        {
          id: "a",
          text: "Take on extra work to ensure the job gets done properly",
          emoji: "💪",
          description: "Perfect! Taking responsibility and ensuring quality work shows true leadership.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Slack off too since others aren't working hard",
          emoji: "😒",
          description: "That's not responsible. Your actions should be based on what's right, not what others do.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell the teacher on your classmates",
          emoji: "📚",
          description: "While reporting issues might sometimes be necessary, it's better to try to work together first.",
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
      title="School Cleanliness Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-91"
      gameType="civic-responsibility"
      totalLevels={100}
      currentLevel={91}
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

export default SchoolCleanlinessStory;