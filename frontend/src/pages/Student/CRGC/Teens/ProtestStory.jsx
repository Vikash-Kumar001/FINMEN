import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ProtestStory = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Students want safer roads. Should they protest violently or petition peacefully?",
      options: [
        {
          id: "a",
          text: "Petition peacefully for change",
          emoji: "🕊️",
          description: "That's right! Peaceful petitioning is a constructive way to advocate for change while respecting others.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Use violence to get attention",
          emoji: "🔥",
          description: "That's not right. Violence harms others and undermines the legitimate cause students are advocating for.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Do nothing about the issue",
          emoji: "🤐",
          description: "That's not civic engagement. Addressing important community issues is a responsibility of engaged citizens.",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How can students effectively advocate for safer roads?",
      options: [
        {
          id: "a",
          text: "Research and present data to officials",
          emoji: "📊",
          description: "That's right! Research and data help make a compelling case for change to decision-makers.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spread misinformation online",
          emoji: "📱",
          description: "That's not helpful. Misinformation undermines credibility and can create more problems than solutions.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip school to protest",
          emoji: "🏃",
          description: "That's not responsible. Students should balance civic engagement with their educational responsibilities.",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What is the benefit of peaceful civic action?",
      options: [
        {
          id: "a",
          text: "Creates positive change while respecting others",
          emoji: "🌟",
          description: "That's right! Peaceful civic action can achieve meaningful results while maintaining community harmony.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Intimidates opponents into compliance",
          emoji: "😠",
          description: "That's not constructive. Intimidation creates fear rather than genuine support for positive change.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Draws attention regardless of consequences",
          emoji: "📢",
          description: "That's not responsible. Effective civic action considers both goals and methods to create lasting positive change.",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How should students respond to opposition to their cause?",
      options: [
        {
          id: "a",
          text: "Engage in respectful dialogue",
          emoji: "🤝",
          description: "That's right! Respectful dialogue can help bridge differences and find common ground.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Discredit opponents personally",
          emoji: "😤",
          description: "That's not productive. Personal attacks undermine the credibility of the cause and prevent constructive solutions.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Give up when facing resistance",
          emoji: "😔",
          description: "That's not persistence. Meaningful change often requires sustained effort despite obstacles.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is it important to work within legal frameworks for change?",
      options: [
        {
          id: "a",
          text: "Ensures legitimacy and sustainability of efforts",
          emoji: "⚖️",
          description: "That's right! Working within legal frameworks ensures efforts are legitimate and have lasting impact.",
          isCorrect: true
        },
        {
          id: "b",
          text: "Prevents any real change from happening",
          emoji: "🔒",
          description: "That's not accurate. Legal frameworks provide structure for effective and sustainable change.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Makes change happen instantly",
          emoji: "⚡",
          description: "That's not realistic. Meaningful change typically requires sustained effort within established systems.",
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
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Protest Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-95"
      gameType="civic-responsibility"
      totalLevels={100}
      currentLevel={95}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-4">
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

export default ProtestStory;