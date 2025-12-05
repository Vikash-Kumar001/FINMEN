import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizMasculinityMyths = () => {
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
      text: "Which is true?",
      options: [
        {
          id: "b",
          text: "Men must be tough always",
          emoji: "💪",
          description: "Vulnerability is also a strength",
          isCorrect: false
        },
        {
          id: "a",
          text: "Men can show emotions",
          emoji: "😊",
          description: "Expressing emotions is healthy for everyone",
          isCorrect: true
        },
        {
          id: "c",
          text: "Men can't be sensitive",
          emoji: "😐",
          description: "Sensitivity is a strength, not a weakness",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What defines healthy masculinity?",
      options: [
        {
          id: "a",
          text: "Respecting all people equally",
          emoji: "🤝",
          description: "Respect is a core component of healthy masculinity",
          isCorrect: true
        },
        {
          id: "b",
          text: "Never showing weakness",
          emoji: "💪",
          description: "Asking for help shows strength",
          isCorrect: false
        },
        {
          id: "c",
          text: "Suppressing emotions",
          emoji: "😶",
          description: "Emotional expression is important for mental health",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should men handle stress?",
      options: [
        {
          id: "b",
          text: "Bottle it up inside",
          emoji: "🤐",
          description: "Expressing emotions helps manage stress",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore it completely",
          emoji: "🤷",
          description: "Addressing stress is important for well-being",
          isCorrect: false
        },
        {
          id: "a",
          text: "Talk about feelings with friends",
          emoji: "💬",
          description: "Sharing helps manage stress effectively",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Is it okay for men to have hobbies like cooking or gardening?",
      options: [
        {
          id: "a",
          text: "No, those are for women",
          emoji: "🚫",
          description: "Hobbies have no gender.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Yes, hobbies are for everyone",
          emoji: "🍳",
          description: "Enjoying diverse activities is healthy.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only if no one sees",
          emoji: "👀",
          description: "You should be proud of your interests.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What does consent mean?",
      options: [
        {
          id: "a",
          text: "Getting what you want",
          emoji: "😤",
          description: "Consent must be mutual and enthusiastic.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Respecting boundaries",
          emoji: "🛑",
          description: "Consent is about mutual agreement and respect.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignoring 'no'",
          emoji: "🙉",
          description: "No always means no.",
          isCorrect: false
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
    navigate("/student/health-male/teens/reflex-masculinity-check");
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Masculinity Myths"
      subtitle={!gameFinished ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-62"
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
            <h3 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h3>
            <p className="text-xl text-white/90 mb-6">
              You scored {score} out of {questions.length}!
            </p>
            <p className="text-white/80 mb-8">
              Great job busting those myths! Keep learning about healthy masculinity.
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

export default QuizMasculinityMyths;
