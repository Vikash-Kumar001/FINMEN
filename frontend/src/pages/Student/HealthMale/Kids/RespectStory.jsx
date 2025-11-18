import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RespectStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Why should we respect private parts?",
      options: [
        {
          id: "b",
          text: "Because they're ugly",
          emoji: "😞",
          description: "Private parts are special and deserve respect",
          isCorrect: false
        },
        {
          id: "a",
          text: "Because they're special & private",
          emoji: "✨",
          description: "All body parts deserve respect, especially private ones",
          isCorrect: true
        },
        {
          id: "c",
          text: "Because they're scary",
          emoji: "😨",
          description: "Private parts are normal and need respect",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Someone asks to see your private parts. What do you say?",
      options: [
        {
          id: "a",
          text: "No, that's private",
          emoji: "🛡️",
          description: "It's important to protect your privacy",
          isCorrect: true
        },
        {
          id: "b",
          text: "Maybe later",
          emoji: "⏰",
          description: "Private parts should always stay private",
          isCorrect: false
        },
        {
          id: "c",
          text: "Okay, show me yours first",
          emoji: "👀",
          description: "Private parts are not for sharing",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You see someone else's private parts by accident. What do you do?",
      options: [
        {
          id: "c",
          text: "Tell everyone",
          emoji: "📢",
          description: "Respect privacy by looking away and not talking",
          isCorrect: false
        },
        {
          id: "b",
          text: "Laugh at them",
          emoji: "😂",
          description: "Everyone deserves privacy and respect",
          isCorrect: false
        },
        {
          id: "a",
          text: "Look away and respect privacy",
          emoji: "🙏",
          description: "Respect means giving others privacy too",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your friend shows you their private parts. How do you respond?",
      options: [
        {
          id: "b",
          text: "Show them yours too",
          emoji: "👀",
          description: "Private parts should stay private",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell the teacher immediately",
          emoji: "👩‍🏫",
          description: "It's better to talk to a trusted adult",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and walk away",
          emoji: "🚶",
          description: "Respect your own privacy and boundaries",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Why is body respect important for everyone?",
      options: [
        {
          id: "b",
          text: "Only for grown-ups",
          emoji: "👨‍🦳",
          description: "Everyone deserves body respect at any age",
          isCorrect: false
        },
        {
          id: "a",
          text: "Because all bodies are special",
          emoji: "🌟",
          description: "Every person deserves respect and privacy",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only when others are watching",
          emoji: "👁️",
          description: "Body respect is important always",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(5, true);
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/health-male/kids/my-body-respect-poster");
  };

  return (
    <GameShell
      title="Respect Story"
      subtitle={`Story ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 5}
      gameId="health-male-kids-35"
      gameType="health-male"
      totalLevels={40}
      currentLevel={35}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Story {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 5}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🙏</div>
            <h3 className="text-2xl font-bold text-white mb-2">Body Respect</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
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

export default RespectStory;
