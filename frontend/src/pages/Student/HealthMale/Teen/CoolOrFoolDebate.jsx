import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CoolOrFoolDebate = () => {
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
      text: "Is smoking/drinking cool or harmful?",
      options: [
        {
          id: "a",
          text: "Cool",
          emoji: "😎"
        },
        {
          id: "b",
          text: "Makes you popular",
          emoji: "⭐"
        },
        {
          id: "c",
          text: "Harmful",
          emoji: "⚠️"
        }
      ],
      correctAnswer: "c",
      explanation: "Real friends respect healthy choices. Making healthy decisions shows real strength and leads to more genuine friendships."
    },
    {
      id: 2,
      text: "What happens when teens use substances to seem cool?",
      options: [
        {
          id: "c",
          text: "Creates health problems",
          emoji: "🏥"
        },
        {
          id: "b",
          text: "Gains real respect",
          emoji: "🏆"
        },
        {
          id: "a",
          text: "Impresses everyone",
          emoji: "👏"
        },
        
      ],
      correctAnswer: "c",
      explanation: "Most people respect healthy, responsible choices. True confidence comes from making good decisions, not from impressing others with risky behaviors."
    },
    {
      id: 3,
      text: "How should teens respond to friends who use substances?",
      options: [
        {
          id: "a",
          text: "Join them to fit in",
          emoji: "👥"
        },
        {
          id: "c",
          text: "Encourage healthy alternatives",
          emoji: "💪"
        },
        {
          id: "b",
          text: "Judge and criticize",
          emoji: "👎"
        }
      ],
      correctAnswer: "c",
      explanation: "Healthy choices are more important than fitting in. Being true to your values is more important than peer pressure."
    },
    {
      id: 4,
      text: "What is the 'cool' thing about staying substance-free?",
      options: [
        {
          id: "b",
          text: "Being different",
          emoji: "🦄"
        },
        {
          id: "a",
          text: "Protecting your future",
          emoji: "🚀"
        },
        {
          id: "c",
          text: "Following rules",
          emoji: "📋"
        }
      ],
      correctAnswer: "a",
      explanation: "Substance-free life leads to more opportunities. Protecting your health and future opens doors to achievements and experiences."
    },
    {
      id: 5,
      text: "How does society view teen substance use?",
      options: [
        {
          id: "a",
          text: "As a rite of passage",
          emoji: "🎭"
        },
        {
          id: "b",
          text: "As normal teen behavior",
          emoji: "😊"
        },
        {
          id: "c",
          text: "As a serious health risk",
          emoji: "⚠️"
        }
      ],
      correctAnswer: "c",
      explanation: "Substance use is recognized as harmful to teens. Society increasingly understands the dangers of teen substance use and supports prevention efforts."
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
    navigate("/student/health-male/teens/journal-of-awareness");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Cool or Fool?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-86"
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
            <h3 className="text-2xl font-bold text-white mb-2">Substance Use Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
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
                  className={`bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${
                    showFeedback ? (isCorrect ? 'ring-4 ring-green-500' : isSelected ? 'ring-4 ring-red-500' : '') : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{optionEmojis[option.id] || '❓'}</div>
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

export default CoolOrFoolDebate;
