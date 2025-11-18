import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateDegreeOrSkill = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "In today's job market, what's more important for career success?",
      options: [
        {
          id: "a",
          text: "Degree only",
          emoji: "🎓",
          description: "While degrees are valuable, skills are increasingly important in modern careers",
          isCorrect: false
        },
        {
          id: "b",
          text: "Skills with degree are best",
          emoji: "✅",
          description: "Exactly! Combining formal education with practical skills maximizes career opportunities",
          isCorrect: true
        },
        {
          id: "c",
          text: "Skills only",
          emoji: "🔧",
          description: "Skills are crucial but degrees often provide foundational knowledge and credibility",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How do employers typically view candidates with both degree and skills?",
      options: [
        {
          id: "a",
          text: "Highly favorable - well-rounded candidates",
          emoji: "🌟",
          description: "Perfect! Employers value candidates who combine theoretical knowledge with practical abilities",
          isCorrect: true
        },
        {
          id: "b",
          text: "No different from others",
          emoji: "😐",
          description: "Having both degree and skills typically gives candidates a competitive advantage",
          isCorrect: false
        },
        {
          id: "c",
          text: "Overqualified for most positions",
          emoji: "🤯",
          description: "Being well-qualified is generally seen as an asset, not a disadvantage",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Which approach leads to better long-term career growth?",
      options: [
        {
          id: "a",
          text: "Continuously developing both academic knowledge and practical skills",
          emoji: "📈",
          description: "Exactly! Ongoing learning in both areas ensures adaptability and advancement",
          isCorrect: true
        },
        {
          id: "b",
          text: "Focusing on just one area",
          emoji: "🎯",
          description: "Specialization has value but versatility often leads to broader opportunities",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoiding formal education entirely",
          emoji: "❌",
          description: "Formal education provides foundational knowledge that complements skill development",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How do skills and degrees complement each other?",
      options: [
        {
          id: "a",
          text: "Degrees provide theory, skills provide application",
          emoji: "🔄",
          description: "Perfect! Theory and practice together create well-rounded professional capabilities",
          isCorrect: true
        },
        {
          id: "b",
          text: "They compete with each other",
          emoji: "⚔️",
          description: "Degrees and skills are complementary rather than competing elements",
          isCorrect: false
        },
        {
          id: "c",
          text: "One replaces the need for the other",
          emoji: "🔄",
          description: "Both elements contribute uniquely to professional development and success",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the modern employer's perspective on education and skills?",
      options: [
        {
          id: "a",
          text: "Value both formal credentials and demonstrable abilities",
          emoji: "⚖️",
          description: "Exactly! Modern employers seek candidates with both educational background and proven skills",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only care about prestigious degrees",
          emoji: "🏛️",
          description: "While degrees matter, employers increasingly prioritize practical skills and competencies",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only care about years of experience",
          emoji: "📅",
          description: "Experience is valuable but skills and education provide different types of value",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(2, true);
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
    navigate("/student/ehe/teens/journal-teen-paths");
  };

  return (
    <GameShell
      title="Debate: Degree or Skill?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      gameId="ehe-teen-56"
      gameType="ehe"
      totalLevels={60}
      currentLevel={56}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length * 2}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Education vs Skills Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default DebateDegreeOrSkill;