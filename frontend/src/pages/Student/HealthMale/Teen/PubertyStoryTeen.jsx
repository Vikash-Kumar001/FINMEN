import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyStoryTeen = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You notice you're sweating more than usual and your voice sounds different. What's happening?",
      options: [
        {
          id: "a",
          text: "This is puberty",
          emoji: "🌱",
          description: "Puberty brings many body changes like sweating more and voice changes",
          isCorrect: true
        },
        {
          id: "b",
          text: "Something's wrong with me",
          emoji: "😰",
          description: "These are normal signs of growing up",
          isCorrect: false
        },
        {
          id: "c",
          text: "I need to see a doctor",
          emoji: "🏥",
          description: "These are normal changes that happen to all teens",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your mood swings from happy to upset quickly. How do you handle this?",
      options: [
        {
          id: "a",
          text: "Understand it's normal puberty",
          emoji: "🧠",
          description: "Mood changes are common during puberty due to hormones",
          isCorrect: true
        },
        {
          id: "b",
          text: "Get angry at everyone",
          emoji: "😠",
          description: "Learning to manage emotions is part of growing up",
          isCorrect: false
        },
        {
          id: "c",
          text: "Hide feelings completely",
          emoji: "😶",
          description: "It's okay to express emotions during puberty",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Friends tease you about your changing voice. What do you do?",
      options: [
        {
          id: "a",
          text: "Explain it's normal puberty",
          emoji: "💪",
          description: "Being confident about puberty changes helps others understand",
          isCorrect: true
        },
        {
          id: "b",
          text: "Stop talking to avoid embarrassment",
          emoji: "🤐",
          description: "Voice changes are temporary and normal for all teens",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tease them back",
          emoji: "😏",
          description: "Everyone goes through puberty changes",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You feel self-conscious about body changes. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Compare yourself to others",
          emoji: "👥",
          description: "Everyone develops at their own pace during puberty",
          isCorrect: false
        },
        {
          id: "b",
          text: "Talk to a trusted adult",
          emoji: "👨‍👦",
          description: "Adults can share their own experiences and reassure you",
          isCorrect: true
        },
        {
          id: "c",
          text: "Wear baggy clothes to hide",
          emoji: "👕",
          description: "It's okay to be comfortable with your changing body",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You're growing taller but feel awkward. How do you feel about this?",
      options: [
        {
          id: "a",
          text: "Accept it's part of growing",
          emoji: "🌱",
          description: "Puberty growth is temporary and means you're developing well",
          isCorrect: true
        },
        {
          id: "b",
          text: "Hate the changes",
          emoji: "😖",
          description: "Your body is growing exactly as it should",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wish it would stop",
          emoji: "⏸️",
          description: "Growth is a natural part of becoming an adult",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/health-male/teens/quiz-puberty-teen");
  };

  return (
    <GameShell
      title="Puberty Story (Teen)"
      subtitle={`Scenario ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 5}
      gameId="health-male-teen-21"
      gameType="health-male"
      totalLevels={100}
      currentLevel={21}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 21/100</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 5}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default PubertyStoryTeen;
