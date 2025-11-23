import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ClassroomStory = () => {
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
      text: "A new classmate joins your class who speaks a different language. Some kids are making fun of how he talks. What do you do?",
      options: [
        {
          id: "a",
          text: "Join in and laugh at him",
          emoji: "😂",
          description: "That's not respectful. Making fun of someone for how they speak is hurtful and unkind.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell the other kids to stop and be respectful",
          emoji: "✋",
          description: "Great choice! Standing up for others and promoting respect creates a welcoming environment for everyone.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "During group work, your new classmate seems confused about the instructions. What should you do?",
      options: [
        {
          id: "a",
          text: "Ignore him and work with others",
          emoji: "😒",
          description: "That's not inclusive. Leaving someone out makes them feel unwelcome and alone.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Help explain the instructions in a kind way",
          emoji: "🤝",
          description: "Perfect! Helping others understand shows kindness and creates a supportive learning environment.",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "At lunch, the new classmate sits alone. What would you do?",
      options: [
        {
          id: "a",
          text: "Avoid him and sit with your usual friends",
          emoji: "🚶",
          description: "That's not inclusive. Everyone deserves to feel welcomed and included.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Invite him to sit with you and your friends",
          emoji: "😊",
          description: "Wonderful! Including others helps them feel welcome and builds friendships across differences.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Some kids are excluding the new classmate from playing during recess. What's the right thing to do?",
      options: [
        {
          id: "a",
          text: "Join the group that's excluding him",
          emoji: "🙅",
          description: "That's not respectful. Excluding others based on differences is hurtful and unfair.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Invite him to play with you",
          emoji: "🎉",
          description: "Excellent! Including everyone in activities promotes fairness and builds a positive community.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "The teacher asks for a volunteer to help the new classmate practice English. What do you do?",
      options: [
        {
          id: "a",
          text: "Stay quiet and let someone else volunteer",
          emoji: "🤫",
          description: "That's not helpful. Everyone can contribute to making others feel welcome.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Raise your hand to volunteer",
          emoji: "🙋",
          description: "Great! Volunteering to help shows kindness and helps create an inclusive environment.",
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Classroom Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-11"
      gameType="civic-responsibility"
      totalLevels={20}
      currentLevel={11}
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

export default ClassroomStory;