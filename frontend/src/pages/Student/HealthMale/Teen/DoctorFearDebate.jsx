import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DoctorFearDebate = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const questions = [
    {
      id: 1,
      text: "Is visiting doctors scary or safe?",
      options: [
        {
          id: "a",
          text: "Scary",
          emoji: "😱"
        },
        {
          id: "b",
          text: "Safe",
          emoji: "🛡️"
        },
        {
          id: "c",
          text: "Only for emergencies",
          emoji: "🚑"
        }
      ],
      correctAnswer: "a",
      explanation: "While it's normal to feel nervous about doctor visits, healthcare professionals are trained to provide safe, expert care. Doctors help prevent and treat health issues, making visits beneficial for your well-being."
    },
    {
      id: 2,
      text: "What should teens know about medical procedures?",
      options: [
        {
          id: "a",
          text: "Procedures are designed to help",
          emoji: "💊"
        },
        {
          id: "b",
          text: "Avoid all procedures",
          emoji: "❌"
        },
        {
          id: "c",
          text: "All procedures are dangerous",
          emoji: "⚠️"
        }
      ],
      correctAnswer: "b",
      explanation: "Some medical procedures are necessary for good health. Medical procedures are designed to improve health and save lives, and most are safe when performed by qualified professionals."
    },
    {
      id: 3,
      text: "How should teens prepare for doctor visits?",
      options: [
        {
          id: "a",
          text: "Avoid going altogether",
          emoji: "🏃"
        },
        {
          id: "b",
          text: "Research and ask questions",
          emoji: "📚"
        },
        {
          id: "c",
          text: "Go without preparation",
          emoji: "🤷"
        }
      ],
      correctAnswer: "c",
      explanation: "Being informed helps reduce anxiety about healthcare. Researching and preparing questions can make visits more productive, but going in without any preparation can still be valuable."
    },
    {
      id: 4,
      text: "What role do doctors play in teen health?",
      options: [
        {
          id: "a",
          text: "Partners in health journey",
          emoji: "🤝"
        },
        {
          id: "b",
          text: "Only for sick people",
          emoji: "🤒"
        },
        {
          id: "c",
          text: "Authority figures to fear",
          emoji: "👨‍⚕️"
        }
      ],
      correctAnswer: "a",
      explanation: "Doctors guide teens through health decisions and are partners in your health journey. They help prevent illness, not just treat it, and are supportive allies in maintaining your well-being."
    },
    {
      id: 5,
      text: "How can teens overcome fear of doctors?",
      options: [
        {
          id: "a",
          text: "Never go to doctors",
          emoji: "🙈"
        },
        {
          id: "b",
          text: "Wait until emergency",
          emoji: "🚨"
        },
        {
          id: "c",
          text: "Start with regular checkups",
          emoji: "📅"
        }
      ],
      correctAnswer: "c",
      explanation: "Familiarity with healthcare reduces fear over time. Starting with regular checkups helps build comfort with healthcare providers and makes future visits less intimidating."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    resetFeedback(); // Reset any existing feedback
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1); // 1 point per correct answer
      showCorrectAnswerFeedback(1, true);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/journal-of-doctor-visits");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Doctor Fear"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-76"
      gameType="health-male"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {score}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Healthcare & Fear Debate</h3>
          </div>

          <p className="text-white text-lg mb-6 font-medium">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map(option => {
              const isSelected = selectedOption === option.id;
              const isCorrect = option.id === getCurrentQuestion().correctAnswer;
              const showCorrect = showFeedback && isCorrect;
              const showIncorrect = showFeedback && isSelected && !isCorrect;
              
              // Add emojis for each option like in the reference game
              const optionEmojis = {
                a: "✅",
                b: "❌",
                c: "⚠️"
              };
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={showFeedback}
                  className={`bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left border border-white/10 ${
                    showFeedback ? (isCorrect ? 'ring-4 ring-green-500' : isSelected ? 'ring-4 ring-red-500' : '') : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{optionEmojis[option.id] || '❓'}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className={`mt-6 p-4 rounded-xl ${
              selectedOption === getCurrentQuestion().correctAnswer
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <p className={`font-semibold ${
                selectedOption === getCurrentQuestion().correctAnswer
                  ? 'text-green-300'
                  : 'text-red-300'
              }`}>
                {selectedOption === getCurrentQuestion().correctAnswer
                  ? 'Correct! 🎉'
                  : 'Not quite right!'}
              </p>
              <p className="text-white/90 mt-2">
                {getCurrentQuestion().explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default DoctorFearDebate;
