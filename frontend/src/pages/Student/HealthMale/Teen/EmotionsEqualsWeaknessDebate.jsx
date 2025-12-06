import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmotionsEqualsWeaknessDebate = () => {
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
      text: "Is showing emotions weak or strong?",
      options: [
        {
          id: "b",
          text: "Strong",
          emoji: "💪",
          description: "Expressing emotions takes courage and builds emotional intelligence",
          isCorrect: true
        },
        {
          id: "a",
          text: "Weak",
          emoji: "😔",
          description: "Suppressing emotions can harm mental health",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only for certain emotions",
          emoji: "🤔",
          description: "All emotions are valid and should be expressed healthily",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What happens when men express emotions?",
      options: [
        {
          id: "a",
          text: "They appear weaker",
          emoji: "😞",
          description: "Expressing emotions shows emotional maturity",
          isCorrect: false
        },
        {
          id: "c",
          text: "They build stronger relationships",
          emoji: "🤝",
          description: "Open emotional expression improves connections with others",
          isCorrect: true
        },
        {
          id: "b",
          text: "Nothing changes",
          emoji: "😐",
          description: "Emotional expression leads to better mental health",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should society view men who express emotions?",
      options: [
        {
          id: "b",
          text: "As less masculine",
          emoji: "👎",
          description: "Emotional expression is a sign of strength",
          isCorrect: false
        },
        {
          id: "a",
          text: "As emotionally healthy",
          emoji: "❤️",
          description: "Healthy emotional expression benefits everyone",
          isCorrect: true
        },
        {
          id: "c",
          text: "As attention-seeking",
          emoji: "📢",
          description: "Expressing emotions is a normal human need",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What is the result of suppressing emotions?",
      options: [
        {
          id: "a",
          text: "Better focus",
          emoji: "🎯",
          description: "Suppression often leads to distraction and stress.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Increased stress and anxiety",
          emoji: "😫",
          description: "Bottling up feelings harms mental and physical health.",
          isCorrect: true
        },
        {
          id: "c",
          text: "More friends",
          emoji: "👯",
          description: "Authenticity attracts genuine friends.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Can a leader show vulnerability?",
      options: [
        {
          id: "a",
          text: "No, never",
          emoji: "🙅",
          description: "Vulnerability builds trust.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Yes, it builds trust",
          emoji: "🤝",
          description: "Vulnerability shows humanity and builds connection.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only if they are failing",
          emoji: "📉",
          description: "Vulnerability is powerful in success and failure.",
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
    navigate("/student/health-male/teens/journal-of-masculinity");
  };

  const currentQuestionData = questions[currentQuestion];

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
        {!gameFinished ? (
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
                      : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
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
