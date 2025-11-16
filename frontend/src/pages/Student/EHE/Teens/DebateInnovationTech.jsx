import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateInnovationTech = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is innovation only about technology and gadgets?",
      options: [
        {
          id: "a",
          text: "No, any new idea or improvement counts",
          emoji: "🔄",
          description: "Correct! Innovation can happen in processes, services, business models, and more.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Yes, only technology counts as innovation",
          emoji: "💻",
          description: "This narrow view misses opportunities for innovation in many other areas.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Innovation is impossible without huge investment",
          emoji: "💰",
          description: "Many innovations start small and grow - investment isn't always required upfront.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's an example of non-technology innovation?",
      options: [
        {
          id: "a",
          text: "New teaching method in a classroom",
          emoji: "📚",
          description: "Exactly! Educational innovations improve learning without requiring technology.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only creating new smartphone apps",
          emoji: "📱",
          description: "This is just one type of innovation - there are many others.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copying existing solutions exactly",
          emoji: "📎",
          description: "Copying isn't innovation - it's replication without improvement.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is broadening the definition of innovation important?",
      options: [
        {
          id: "a",
          text: "It encourages creative problem-solving in all areas",
          emoji: "🎯",
          description: "Great! A broader view empowers more people to innovate in their own contexts.",
          isCorrect: true
        },
        {
          id: "b",
          text: "It makes innovation more exclusive",
          emoji: "🔒",
          description: "Exclusivity limits innovation rather than encouraging it.",
          isCorrect: false
        },
        {
          id: "c",
          text: "It focuses only on wealthy sectors",
          emoji: "💎",
          description: "Innovation can happen anywhere, not just in wealthy sectors.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What role does social innovation play?",
      options: [
        {
          id: "a",
          text: "Creates solutions for societal challenges",
          emoji: "🌍",
          description: "Perfect! Social innovations address community needs and improve lives.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only benefits corporations",
          emoji: "🏢",
          description: "Social innovation benefits communities and society as a whole.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Isn't as valuable as tech innovation",
          emoji: "📉",
          description: "All types of innovation have value depending on context and impact.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can teens innovate without technology?",
      options: [
        {
          id: "a",
          text: "Improve processes, create art, solve community problems",
          emoji: "🌟",
          description: "Correct! Innovation takes many forms beyond technology.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only by starting businesses",
          emoji: "💼",
          description: "Entrepreneurship is one form of innovation, but not the only one.",
          isCorrect: false
        },
        {
          id: "c",
          text: "By avoiding all challenges",
          emoji: "🚫",
          description: "Avoiding challenges prevents the opportunity to innovate.",
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
    navigate("/student/ehe/teens/journal-teen-innovation");
  };

  return (
    <GameShell
      title="Debate: Innovation = Only Tech?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length * 2}
      gameId="ehe-teen-36"
      gameType="ehe"
      totalLevels={40}
      currentLevel={36}
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
            <h3 className="text-2xl font-bold text-white mb-2">Innovation Debate</h3>
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

export default DebateInnovationTech;