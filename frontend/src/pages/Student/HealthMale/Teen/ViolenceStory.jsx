import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ViolenceStory = () => {
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
      text: 'Peer says: "Be a man, fight him." Should you?',
      options: [
        {
          id: "a",
          text: "Yes, prove you're tough",
          emoji: "💪",
          description: "Violence doesn't prove masculinity or solve problems",
          isCorrect: false
        },
        {
          id: "b",
          text: "Fight back harder",
          emoji: "👊",
          description: "Physical fights often lead to more problems",
          isCorrect: false
        },
        {
          id: "c",
          text: "No, walk away",
          emoji: "🚶",
          description: "Walking away shows strength and maturity",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "What should you do if someone challenges you to fight?",
      options: [
        {
          id: "b",
          text: "Accept to save face",
          emoji: "😤",
          description: "True strength is choosing peace over conflict",
          isCorrect: false
        },
        {
          id: "a",
          text: "Report to an adult",
          emoji: "📞",
          description: "Getting help is brave, not weak",
          isCorrect: true
        },
        {
          id: "c",
          text: "Fight to win respect",
          emoji: "🏆",
          description: "Respect comes from character, not fighting",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How can you respond to peer pressure to fight?",
      options: [
        {
          id: "a",
          text: "Give in to pressure",
          emoji: "😞",
          description: "Standing up for yourself means making your own choices",
          isCorrect: false
        },
        {
          id: "c",
          text: "Say no and suggest talking instead",
          emoji: "💬",
          description: "Communication solves problems better than violence",
          isCorrect: true
        },
        {
          id: "b",
          text: "Challenge them back",
          emoji: "👊",
          description: "Escalating conflict rarely helps",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You see someone being bullied. What is the best action?",
      options: [
        {
          id: "a",
          text: "Join the bully",
          emoji: "😈",
          description: "Bullying is harmful and wrong.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ignore it",
          emoji: "🙈",
          description: "Ignoring bullying allows it to continue.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Get help or intervene safely",
          emoji: "🛡️",
          description: "Helping others is a sign of true strength.",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "Is violence ever the answer to solve a disagreement?",
      options: [
        {
          id: "a",
          text: "Yes, always",
          emoji: "⚔️",
          description: "Violence usually makes things worse.",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, communication is key",
          emoji: "🗣️",
          description: "Talking things out is the mature way to handle conflict.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only if you are angry",
          emoji: "😡",
          description: "Anger should be managed without violence.",
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
    navigate("/student/health-male/teens/emotions-equals-weakness-debate");
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Violence Story"
      subtitle={!gameFinished ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-65"
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
              Remember, true strength is shown through kindness and resolving conflicts peacefully.
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

export default ViolenceStory;
