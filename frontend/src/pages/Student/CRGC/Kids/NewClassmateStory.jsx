import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NewClassmateStory = () => {
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
      text: "A new student joins your class. They speak with an accent and seem nervous. What should you do?",
      options: [
        {
          id: "a",
          text: "Welcome them and offer to show them around",
          emoji: "🤗",
          description: "That's right! Being welcoming helps new students feel comfortable and included.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore them and sit with your usual friends",
          emoji: "😒",
          description: "That's not inclusive. Everyone deserves to feel welcomed in a new environment.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask loudly where they're from in front of everyone",
          emoji: "📢",
          description: "That's not respectful. While curiosity is natural, it's better to ask questions privately.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The new student seems to be struggling with the language. How can you help?",
      options: [
        {
          id: "a",
          text: "Speak slowly and use simple words when talking to them",
          emoji: "🗣️",
          description: "Perfect! Speaking clearly and simply helps bridge language barriers.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid talking to them to prevent embarrassment",
          emoji: "🤫",
          description: "That's not helpful. Isolation can make someone feel even more excluded.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Make jokes about how they speak",
          emoji: "😂",
          description: "That's not kind. Making fun of someone's language skills can be hurtful.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "During lunch, the new student sits alone. What's the kind thing to do?",
      options: [
        {
          id: "a",
          text: "Invite them to sit with you and your friends",
          emoji: "🍱",
          description: "Great! Including new students helps them make friends and feel part of the community.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tell your friends to stay away from the 'new kid'",
          emoji: "🙅",
          description: "That's not welcoming. Excluding someone based on where they're from is unfair.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stare at them and whisper to your friends",
          emoji: "👀",
          description: "That's not kind. Staring and whispering can make someone feel uncomfortable and self-conscious.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "The new student wears traditional clothing from their home country. How should you react?",
      options: [
        {
          id: "a",
          text: "Ask respectfully about their clothing and culture",
          emoji: "👗",
          description: "That's right! Showing genuine interest in someone's culture is respectful and can lead to learning.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tell them to change into 'normal' clothes",
          emoji: "😒",
          description: "That's not respectful. Traditional clothing is an important part of someone's identity and culture.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Laugh and point at their clothing",
          emoji: "😆",
          description: "That's not kind. Making fun of someone's clothing can hurt their feelings and make them feel unwelcome.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "The new student seems to be good at a sport that's popular in their country. What should you do?",
      options: [
        {
          id: "a",
          text: "Ask them to teach you about the sport and its rules",
          emoji: "⚽",
          description: "Perfect! Learning from each other's experiences and talents helps build friendships and understanding.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore their skills because it's not a sport you know",
          emoji: "😒",
          description: "That's not appreciative. Everyone has unique talents and experiences worth recognizing.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Try to prove you're better than them at their own sport",
          emoji: "😤",
          description: "That's not collaborative. Healthy competition is fine, but trying to prove superiority isn't respectful.",
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
      title="New Classmate Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-88"
      gameType="civic-responsibility"
      totalLevels={90}
      currentLevel={88}
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

export default NewClassmateStory;