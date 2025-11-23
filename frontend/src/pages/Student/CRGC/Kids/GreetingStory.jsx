import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const GreetingStory = () => {
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
      text: "You're meeting a new classmate from Japan who greets you with a bow. How should you respond?",
      options: [
        {
          id: "a",
          text: "Laugh and tell them to shake hands instead",
          emoji: "😂",
          description: "That's not respectful. Different cultures have different ways of greeting, and we should respect them.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Bow back politely to show respect",
          emoji: "🙇",
          description: "That's right! Bowing back shows respect for their cultural tradition and helps build a positive connection.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore the greeting and walk away",
          emoji: "🚶",
          description: "That's not polite. Ignoring someone's greeting can make them feel unwelcome and disrespected.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A visitor from India presses their hands together and says 'Namaste' to you. What's the appropriate response?",
      options: [
        {
          id: "a",
          text: "Press your hands together and say 'Namaste' back",
          emoji: "🙏",
          description: "Perfect! Responding with the same gesture shows cultural respect and appreciation.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wave and say 'Hello' in a loud voice",
          emoji: "👋",
          description: "While friendly, it's more respectful to acknowledge their cultural greeting in the same way.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stare and ask 'What was that?'",
          emoji: "🤨",
          description: "That's not respectful. Asking questions about cultural practices is fine, but staring and questioning is rude.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You're at an international fair and someone from Thailand does the 'wai' greeting (pressing hands together with a slight bow). How should you respond?",
      options: [
        {
          id: "a",
          text: "Do the same gesture to show respect",
          emoji: "🙏",
          description: "Great! Reciprocating the gesture shows respect for their cultural tradition.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Give them a high-five instead",
          emoji: "✋",
          description: "That's not appropriate. While high-fives are friendly, they don't acknowledge the cultural significance of the greeting.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Step back and avoid eye contact",
          emoji: "🙈",
          description: "That's not polite. Avoiding someone during a greeting can make them feel rejected.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A new student from Hawaii greets you with a hug. Your family is more reserved. What should you do?",
      options: [
        {
          id: "a",
          text: "Politely hug them back and then explain your family's customs later",
          emoji: "🤗",
          description: "That's right! Accepting their greeting shows respect while you can explain your own customs at an appropriate time.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Push them away and tell them not to touch you",
          emoji: "🚫",
          description: "That's not kind. While personal space is important, pushing someone away is disrespectful.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell them they're doing it wrong",
          emoji: "😒",
          description: "That's not respectful. Different cultures have different ways of greeting, and none are 'wrong'.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "At a cultural exchange event, someone from New Zealand performs a traditional Māori greeting. What's the best response?",
      options: [
        {
          id: "a",
          text: "Watch respectfully and follow the lead of others",
          emoji: "👀",
          description: "Perfect! Observing respectfully and following others' lead shows cultural sensitivity.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ask loudly 'What are they doing?'",
          emoji: "📢",
          description: "That's not respectful. If you're curious, it's better to ask quietly or look up the information later.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Refuse to participate and cross your arms",
          emoji: "🙅",
          description: "That's not welcoming. While you don't have to participate, showing openness is more respectful.",
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
      title="Greeting Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-85"
      gameType="civic-responsibility"
      totalLevels={90}
      currentLevel={85}
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

export default GreetingStory;