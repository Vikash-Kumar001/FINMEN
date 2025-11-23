import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DisabledChildStory = () => {
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
      text: "A child who uses a wheelchair is not allowed to enter the school. Is this fair?",
      options: [
        {
          id: "a",
          text: "Yes, the school isn't equipped for disabled children",
          emoji: "🚫",
          description: "That's not fair. All children have the right to education regardless of physical abilities.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, everyone has the right to education",
          emoji: "♿",
          description: "That's right! The UN Convention on the Rights of Persons with Disabilities states that all children have the right to inclusive education.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "How should the school accommodate a student with physical disabilities?",
      options: [
        {
          id: "a",
          text: "Make necessary adjustments to ensure access",
          emoji: "🔧",
          description: "Perfect! Schools should make reasonable accommodations to ensure all students can participate fully.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Expect the student to adapt to the existing environment",
          emoji: "😣",
          description: "That's not inclusive. The environment should be adapted to meet the needs of all students.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What can you do to support a classmate with disabilities?",
      options: [
        {
          id: "a",
          text: "Include them in activities and treat them with respect",
          emoji: "🤝",
          description: "Great! Inclusion and respect help create a supportive environment for all students.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid them to prevent making them uncomfortable",
          emoji: "🚶",
          description: "That's not helpful. Exclusion can make someone feel isolated and unwelcome.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Why is inclusive education important?",
      options: [
        {
          id: "a",
          text: "It helps all students learn about diversity and acceptance",
          emoji: "🌍",
          description: "That's right! Inclusive education teaches all students the value of diversity and creates more accepting communities.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It makes education more difficult for other students",
          emoji: "😓",
          description: "That's a misconception. Inclusive education benefits all students by promoting understanding and empathy.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should you do if you see someone being unkind to a student with disabilities?",
      options: [
        {
          id: "a",
          text: "Speak up and support your classmate",
          emoji: "📢",
          description: "Excellent! Standing up against discrimination helps create a more inclusive environment.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it to avoid getting involved",
          emoji: "🤫",
          description: "That's not helpful. Ignoring mistreatment allows it to continue and can make the victim feel unsupported.",
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
      title="Disabled Child Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-68"
      gameType="civic-responsibility"
      totalLevels={70}
      currentLevel={68}
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

export default DisabledChildStory;