import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MasculinityStory = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const questions = [
    {
      id: 1,
      text: 'Teen hears "Real men don\'t cry." Should he believe?',
      options: [
        {
          id: "c",
          text: "Yes, crying is weak",
          emoji: "💪",
          description: "Emotions are human and healthy to express",
          isCorrect: false
        },
        
        {
          id: "a",
          text: "Only in private",
          emoji: "🏠",
          description: "It's okay to express emotions when needed",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, feelings are human",
          emoji: "❤️",
          description: "Everyone has emotions and expressing them is healthy",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "What makes a real man according to healthy standards?",
      options: [
         {
          id: "c",
          text: "Showing respect to others",
          emoji: "🤝",
          description: "Respect and kindness are key traits of healthy masculinity",
          isCorrect: true
        },
        {
          id: "a",
          text: "Being tough always",
          emoji: "💪",
          description: "Real strength includes kindness and emotional intelligence",
          isCorrect: false
        },
       
        {
          id: "b",
          text: "Never showing emotions",
          emoji: "😐",
          description: "Suppressing emotions can harm mental health",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should teens respond to toxic masculinity messages?",
      options: [
        {
          id: "b",
          text: "Accept them as truth",
          emoji: "✅",
          description: "Question and challenge harmful stereotypes",
          isCorrect: false
        },
        {
          id: "a",
          text: "Question and learn healthy alternatives",
          emoji: "🧠",
          description: "Learning about healthy masculinity promotes positive growth",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore them completely",
          emoji: "🤷",
          description: "Understanding helps form healthy beliefs",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A friend is being bullied. What does a strong man do?",
      options: [
        {
          id: "a",
          text: "Join in the bullying",
          emoji: "👊",
          description: "Bullying is never a sign of strength.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stand up for the friend",
          emoji: "🛡️",
          description: "Protecting others is a true sign of strength.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Pretend not to see",
          emoji: "🙈",
          description: "Ignoring injustice is not the right choice.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You made a mistake. What is the manly thing to do?",
      options: [
        {
          id: "a",
          text: "Blame someone else",
          emoji: "👉",
          description: "Taking responsibility is a sign of maturity.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Hide the mistake",
          emoji: "🤫",
          description: "Honesty is always the best policy.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Admit and learn from it",
          emoji: "🎓",
          description: "Learning from mistakes helps you grow.",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/quiz-masculinity-myths");
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Masculinity Story"
      subtitle={!gameFinished ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-61"
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
        {!gameFinished ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
              <span className="text-yellow-400 font-bold">Score: {score}</span>
            </div>

            <p className="text-white text-lg mb-6">
              {currentQuestionData.text}
            </p>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestionData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.isCorrect)}
                  disabled={answered}
                  className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${answered
                      ? option.isCorrect
                        ? "bg-green-500/50 border-green-400"
                        : "bg-white/10 opacity-50"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    } text-white border border-transparent`}
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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Story Complete!</h3>
            <p className="text-xl text-white/90 mb-6">
              You scored {score} out of {questions.length}!
            </p>
            <p className="text-white/80 mb-8">
              True masculinity is about respect, responsibility, and emotional intelligence.
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

export default MasculinityStory;
