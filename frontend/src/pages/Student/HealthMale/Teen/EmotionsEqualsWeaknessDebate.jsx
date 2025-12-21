import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmotionsEqualsWeaknessDebate = () => {
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
      text: "Is showing emotions weak or strong?",
      options: [
        {
          id: "b",
          text: "Strong",
          emoji: "💪"
        },
        {
          id: "a",
          text: "Weak",
          emoji: "😔"
        },
        {
          id: "c",
          text: "Only for certain emotions",
          emoji: "🤔"
        }
      ],
      correctAnswer: "b",
      explanation: "Expressing emotions takes courage and builds emotional intelligence. Suppressing emotions can harm mental health, and all emotions are valid and should be expressed healthily."
    },
    {
      id: 2,
      text: "What happens when men express emotions?",
      options: [
        {
          id: "a",
          text: "They appear weaker",
          emoji: "😞"
        },
        {
          id: "c",
          text: "They build stronger relationships",
          emoji: "🤝"
        },
        {
          id: "b",
          text: "Nothing changes",
          emoji: "😐"
        }
      ],
      correctAnswer: "c",
      explanation: "Open emotional expression improves connections with others. Expressing emotions shows emotional maturity, and emotional expression leads to better mental health."
    },
    {
      id: 3,
      text: "How should society view men who express emotions?",
      options: [
        {
          id: "b",
          text: "As less masculine",
          emoji: "👎"
        },
        {
          id: "a",
          text: "As emotionally healthy",
          emoji: "❤️"
        },
        {
          id: "c",
          text: "As attention-seeking",
          emoji: "📢"
        }
      ],
      correctAnswer: "a",
      explanation: "Healthy emotional expression benefits everyone. Emotional expression is a sign of strength, and expressing emotions is a normal human need."
    },
    {
      id: 4,
      text: "What is the result of suppressing emotions?",
      options: [
        {
          id: "a",
          text: "Better focus",
          emoji: "🎯"
        },
        {
          id: "b",
          text: "Increased stress and anxiety",
          emoji: "😫"
        },
        {
          id: "c",
          text: "More friends",
          emoji: "👯"
        }
      ],
      correctAnswer: "b",
      explanation: "Bottling up feelings harms mental and physical health. Suppression often leads to distraction and stress, and authenticity attracts genuine friends."
    },
    {
      id: 5,
      text: "Can a leader show vulnerability?",
      options: [
        {
          id: "a",
          text: "No, never",
          emoji: "🙅"
        },
        {
          id: "b",
          text: "Yes, it builds trust",
          emoji: "🤝"
        },
        {
          id: "c",
          text: "Only if they are failing",
          emoji: "📉"
        }
      ],
      correctAnswer: "b",
      explanation: "Vulnerability shows humanity and builds connection. Vulnerability builds trust, and vulnerability is powerful in success and failure."
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
    navigate("/student/health-male/teens/journal-of-masculinity");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Emotions = Weakness?"
      subtitle={!gameFinished ? `Debate ${currentQuestion + 1} of ${questions.length}` : "Debate Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-66"
      gameType="health-male"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameFinished && score >= 3}
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
            <h3 className="text-2xl font-bold text-white mb-2">Emotions & Strength Debate</h3>
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
        
        {gameFinished && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Debate Complete!</h3>
            <p className="text-xl text-white/90 mb-6">
              You scored {score} out of {questions.length}!
            </p>
            <p className="text-white/80 mb-8">
              Expressing emotions is a sign of strength and maturity.
            </p>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Next Challenge
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmotionsEqualsWeaknessDebate;
