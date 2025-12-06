import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizStressRelief = () => {
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
      text: "Which reduces stress?",
      options: [
        {
          id: "a",
          text: "Sleep + Exercise",
          emoji: "😴",
          description: "Sleep and exercise are proven stress relievers",
          isCorrect: true
        },
        {
          id: "b",
          text: "Worry More",
          emoji: "😟",
          description: "Worrying increases stress levels",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip meals",
          emoji: "🍽️",
          description: "Proper nutrition helps manage stress",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Best way to handle exam stress?",
      options: [
        {
          id: "b",
          text: "Study all night",
          emoji: "🌙",
          description: "Lack of sleep increases stress and reduces performance",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the exams",
          emoji: "🤷",
          description: "Proper preparation reduces exam anxiety",
          isCorrect: false
        },
        {
          id: "a",
          text: "Regular study breaks",
          emoji: "⏸️",
          description: "Breaks prevent burnout during study sessions",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "What helps with stress before bed?",
      options: [
        {
          id: "c",
          text: "Screen time",
          emoji: "📱",
          description: "Screens can disrupt sleep and increase stress",
          isCorrect: false
        },
        {
          id: "a",
          text: "Deep breathing exercises",
          emoji: "🫁",
          description: "Deep breathing calms the mind and promotes sleep",
          isCorrect: true
        },
        {
          id: "b",
          text: "More studying",
          emoji: "📚",
          description: "Relaxation techniques are better before bed",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How does physical activity help stress?",
      options: [
        {
          id: "b",
          text: "Increases anxiety",
          emoji: "😰",
          description: "Exercise releases endorphins that reduce stress",
          isCorrect: false
        },
        {
          id: "c",
          text: "Makes you more tired",
          emoji: "😴",
          description: "While tiring, exercise overall reduces stress",
          isCorrect: false
        },
        {
          id: "a",
          text: "Releases feel-good chemicals",
          emoji: "😊",
          description: "Endorphins from exercise improve mood and reduce stress",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What should you do when feeling overwhelmed?",
      options: [
        {
          id: "a",
          text: "Talk to a trusted adult",
          emoji: "💬",
          description: "Sharing concerns helps reduce stress burden",
          isCorrect: true
        },
        {
          id: "b",
          text: "Keep it all inside",
          emoji: "🤐",
          description: "Bottling emotions can worsen stress",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the feelings",
          emoji: "🙈",
          description: "Acknowledging feelings is important for mental health",
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
    navigate("/student/health-male/teens/reflex-stress-check");
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Stress Relief"
      subtitle={!gameFinished ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-52"
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
                      : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
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
              Great job! Knowing how to manage stress is a superpower.
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

export default QuizStressRelief;
