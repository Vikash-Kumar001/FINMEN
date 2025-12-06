import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BodyImageStory = () => {
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
      text: "You feel short compared to your peers. Should you feel worthless?",
      options: [
        {
          id: "b",
          text: "Yes, height determines worth",
          emoji: "📏",
          description: "Everyone has unique qualities beyond physical appearance",
          isCorrect: false
        },
        {
          id: "a",
          text: "No, worth comes from within",
          emoji: "💪",
          description: "Self-worth is about character, not physical traits",
          isCorrect: true
        },
        {
          id: "c",
          text: "Compare yourself to others",
          emoji: "👀",
          description: "Comparing leads to negative self-image",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friends are taller and you feel left out. What should you do?",
      options: [
        {
          id: "a",
          text: "Try to change your height",
          emoji: "📏",
          description: "Accepting yourself as you are is healthier",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid social activities",
          emoji: "🏠",
          description: "Isolation worsens negative feelings",
          isCorrect: false
        },
        {
          id: "b",
          text: "Focus on your strengths",
          emoji: "⭐",
          description: "Everyone has unique talents and abilities",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "How can you improve body image during puberty?",
      options: [
        {
          id: "c",
          text: "Practice self-acceptance",
          emoji: "❤️",
          description: "Accepting changes and focusing on health is key",
          isCorrect: true
        },
        {
          id: "a",
          text: "Compare to social media",
          emoji: "📱",
          description: "Social media often shows unrealistic standards",
          isCorrect: false
        },
        {
          id: "b",
          text: "Focus only on appearance",
          emoji: "🪞",
          description: "Body image includes mental and emotional health",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You see a muscled model on Instagram. How do you feel?",
      options: [
        {
          id: "b",
          text: "Feel bad about myself",
          emoji: "😞",
          description: "Social media isn't real life.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Remember it's often edited",
          emoji: "📸",
          description: "Photos are often enhanced and unrealistic.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Try to look like him now",
          emoji: "🏋️",
          description: "Healthy growth takes time and patience.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Someone teases you about acne. What to do?",
      options: [
        {
          id: "a",
          text: "Hide face",
          emoji: "🙈",
          description: "Don't let others control how you feel.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tease them back",
          emoji: "😡",
          description: "Retaliation doesn't solve the problem.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore and focus on hygiene",
          emoji: "🧼",
          description: "Confidence is the best response.",
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
    navigate("/student/health-male/teens/boys-should-not-cry-debate");
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Body Image Story"
      subtitle={!gameFinished ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-55"
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
            <h3 className="text-3xl font-bold text-white mb-4">Story Complete!</h3>
            <p className="text-xl text-white/90 mb-6">
              You scored {score} out of {questions.length}!
            </p>
            <p className="text-white/80 mb-8">
              Your body is changing and that's okay. Focus on being healthy and happy!
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

export default BodyImageStory;
