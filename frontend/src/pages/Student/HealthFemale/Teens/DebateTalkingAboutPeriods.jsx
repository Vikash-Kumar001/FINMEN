import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateTalkingAboutPeriods = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Should periods be openly discussed in schools?",
      options: [
        {
          id: "a",
          text: "Yes, with respect and education",
          emoji: "✅",
          description: "Open, respectful discussion helps normalize periods and provides important education",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, it's too private a topic",
          emoji: "🤫",
          description: "While personal, education about periods is important for health and should be discussed appropriately",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only in all-girls settings",
          emoji: "👭",
          description: "Education should be inclusive - everyone should understand reproductive health",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should period discussions be approached in mixed-gender settings?",
      options: [
        {
          id: "a",
          text: "With scientific accuracy and respect for all",
          emoji: "🔬",
          description: "Scientific, respectful discussion promotes understanding and reduces stigma",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoided completely to prevent embarrassment",
          emoji: "🙈",
          description: "Avoiding the topic perpetuates stigma and prevents important education",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only with jokes and casual references",
          emoji: "😂",
          description: "Jokes can increase stigma - respectful, educational discussion is more appropriate",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What is the benefit of normalizing period conversations?",
      options: [
        {
          id: "a",
          text: "Reduces stigma and improves health outcomes",
          emoji: "🌟",
          description: "Normalizing conversations reduces shame and improves access to care and support",
          isCorrect: true
        },
        {
          id: "b",
          text: "Makes periods less special and important",
          emoji: "⬇️",
          description: "Normalizing doesn't diminish importance - it reduces unnecessary shame and secrecy",
          isCorrect: false
        },
        {
          id: "c",
          text: "Encourages excessive focus on the topic",
          emoji: "📢",
          description: "Healthy normalization is about appropriate education, not excessive focus",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can parents contribute to healthy period discussions?",
      options: [
        {
          id: "a",
          text: "Start age-appropriate conversations early",
          emoji: "👨‍👩‍👧",
          description: "Early, age-appropriate education helps children understand their bodies and health",
          isCorrect: true
        },
        {
          id: "b",
          text: "Wait until puberty begins to mention anything",
          emoji: "⏰",
          description: "Waiting until puberty can create confusion and anxiety - earlier preparation is better",
          isCorrect: false
        },
        {
          id: "c",
          text: "Leave all education to schools entirely",
          emoji: "🏫",
          description: "Parents play an important role in education - partnership with schools is ideal",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What role should media play in period representation?",
      options: [
        {
          id: "a",
          text: "Accurate, inclusive, and destigmatizing portrayal",
          emoji: "📺",
          description: "Media has significant influence - responsible portrayal helps normalize periods",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid the topic completely in entertainment",
          emoji: "🔇",
          description: "Complete avoidance perpetuates the idea that periods are shameful or unmentionable",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only show periods as comedic or embarrassing",
          emoji: "😂",
          description: "Comedic portrayals can reinforce negative stereotypes and stigma",
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
    navigate("/student/health-female/teens/journal-of-awareness");
  };

  return (
    <GameShell
      title="Debate: Talking About Periods"
      subtitle={`Debate Point ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      gameId="health-female-teen-36"
      gameType="health-female"
      totalLevels={40}
      currentLevel={36}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate Point {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              {getCurrentQuestion().text}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map((option) => (
              <div
                key={option.id}
                onClick={() => !choices.find(c => c.question === currentQuestion) && handleChoice(option.id)}
                className={`bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  choices.find(c => c.question === currentQuestion)?.optionId === option.id
                    ? option.isCorrect
                      ? "border-green-400 bg-green-500/20"
                      : "border-red-400 bg-red-500/20"
                    : "border-white/30 hover:border-purple-400"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <span className="text-4xl">{option.emoji}</span>
                  <span className="text-white font-medium">{option.text}</span>
                </div>
                
                {choices.find(c => c.question === currentQuestion)?.optionId === option.id && (
                  <div className={`mt-3 p-2 rounded-lg text-sm ${
                    option.isCorrect ? "bg-green-500/30 text-green-200" : "bg-red-500/30 text-red-200"
                  }`}>
                    {option.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default DebateTalkingAboutPeriods;