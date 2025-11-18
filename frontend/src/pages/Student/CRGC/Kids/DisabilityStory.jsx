import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DisabilityStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A girl in a wheelchair joins your school. Some kids are staring and whispering. What do you do?",
      options: [
        {
          id: "a",
          text: "Stare and whisper too",
          emoji: "👀",
          description: "That's not respectful. Staring and whispering can make someone feel uncomfortable and excluded.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Approach her with a friendly smile",
          emoji: "😊",
          description: "Great choice! Approaching with kindness helps create an inclusive environment for everyone.",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "During group work, the girl in a wheelchair can't reach some materials on the high shelf. What should you do?",
      options: [
        {
          id: "a",
          text: "Ignore her struggle and continue with your work",
          emoji: "😒",
          description: "That's not helpful. Everyone deserves support to participate fully.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Help her get the materials she needs",
          emoji: "🤝",
          description: "Perfect! Helping others ensures everyone can participate equally in activities.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Some kids are excluding the girl in a wheelchair from playing during recess. What would you do?",
      options: [
        {
          id: "a",
          text: "Join the group that's excluding her",
          emoji: "🙅",
          description: "That's not inclusive. Excluding others based on differences is hurtful and unfair.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Invite her to play with you and your friends",
          emoji: "🎉",
          description: "Wonderful! Including everyone in activities promotes fairness and builds a positive community.",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "The girl in a wheelchair wants to participate in a school play. Some students say she can't because of her wheelchair. What's the right thing to do?",
      options: [
        {
          id: "a",
          text: "Agree that she can't participate",
          emoji: "😞",
          description: "That's not fair. Everyone should have equal opportunities to participate in activities.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Support her participation and help find solutions",
          emoji: "💪",
          description: "Excellent! Supporting inclusion and finding creative solutions ensures everyone can participate.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "The teacher is explaining how to make the classroom more accessible. What do you do?",
      options: [
        {
          id: "a",
          text: "Stay quiet and let others contribute",
          emoji: "🤫",
          description: "That's not helpful. Everyone can contribute ideas to create an inclusive environment.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Share ideas on how to make the classroom welcoming for everyone",
          emoji: "🙋",
          description: "Great! Contributing ideas helps create an environment where everyone feels welcome and included.",
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
      title="Disability Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-18"
      gameType="civic-responsibility"
      totalLevels={20}
      currentLevel={18}
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

export default DisabilityStory;