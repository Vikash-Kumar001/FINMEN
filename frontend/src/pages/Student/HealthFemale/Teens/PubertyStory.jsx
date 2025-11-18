import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You start noticing your body changing. What is happening?",
      options: [
        {
          id: "a",
          text: "This is normal growth and development",
          emoji: "🌱",
          description: "Puberty is a natural part of growing up",
          isCorrect: true
        },
        {
          id: "b",
          text: "Something is wrong with me",
          emoji: "❓",
          description: "These changes are normal and expected",
          isCorrect: false
        },
        {
          id: "c",
          text: "I should be worried about these changes",
          emoji: "😟",
          description: "There's no need to worry - these changes are normal",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You notice breast development starting. How should you feel?",
      options: [
        {
          id: "a",
          text: "This is a normal sign of puberty",
          emoji: "✅",
          description: "Breast development is one of the first signs of puberty in girls",
          isCorrect: true
        },
        {
          id: "b",
          text: "I'm developing too early",
          emoji: "⏰",
          description: "Puberty timing varies greatly among individuals",
          isCorrect: false
        },
        {
          id: "c",
          text: "I should hide this from others",
          emoji: "🙈",
          description: "These changes are natural and nothing to be ashamed of",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your hips are starting to widen. What does this mean?",
      options: [
        {
          id: "a",
          text: "My body is preparing for future reproductive health",
          emoji: "🦋",
          description: "Widening hips are part of normal female development",
          isCorrect: true
        },
        {
          id: "b",
          text: "I'm gaining unhealthy weight",
          emoji: "⚖️",
          description: "This is normal growth, not unhealthy weight gain",
          isCorrect: false
        },
        {
          id: "c",
          text: "I should try to stop this change",
          emoji: "🚫",
          description: "These changes are natural and cannot be stopped",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You're experiencing mood swings. Why is this happening?",
      options: [
        {
          id: "a",
          text: "Hormonal changes during puberty affect emotions",
          emoji: "🌀",
          description: "Hormonal fluctuations are normal during puberty",
          isCorrect: true
        },
        {
          id: "b",
          text: "I'm becoming emotionally unstable",
          emoji: "💔",
          description: "Mood swings are temporary and normal during puberty",
          isCorrect: false
        },
        {
          id: "c",
          text: "Something is seriously wrong with me",
          emoji: "⚠️",
          description: "Mood swings are a common part of puberty",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can you best handle these body changes?",
      options: [
        {
          id: "a",
          text: "Learn about changes and talk to trusted adults",
          emoji: "📚",
          description: "Education and communication help you understand and accept changes",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the changes completely",
          emoji: "😶",
          description: "Ignoring changes won't make them go away",
          isCorrect: false
        },
        {
          id: "c",
          text: "Compare myself constantly to others",
          emoji: "👥",
          description: "Everyone develops at their own pace",
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
    navigate("/student/health-female/teens/quiz-puberty");
  };

  return (
    <GameShell
      title="Puberty Story"
      subtitle={`Level 21 of 30`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-21"
      gameType="health-female"
      totalLevels={30}
      currentLevel={21}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 21/30</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default PubertyStory;