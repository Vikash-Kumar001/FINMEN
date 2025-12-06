import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BoysShouldNotCryDebate = () => {
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
      text: "Is crying weakness or natural?",
      options: [
        {
          id: "b",
          text: "Weakness",
          emoji: "💪",
          description: "Expressing emotions shows strength, not weakness",
          isCorrect: false
        },
        {
          id: "a",
          text: "Natural",
          emoji: "😢",
          description: "Crying is a healthy emotional response for everyone",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only for girls",
          emoji: "👧",
          description: "Everyone has emotions and needs to express them",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What happens when boys suppress emotions?",
      options: [
        {
          id: "a",
          text: "Makes them stronger",
          emoji: "💪",
          description: "Suppressing emotions weakens mental resilience",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing happens",
          emoji: "😐",
          description: "Unexpressed emotions affect well-being",
          isCorrect: false
        },
        {
          id: "b",
          text: "Builds mental health issues",
          emoji: "😞",
          description: "Bottling emotions can lead to stress and depression",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "How should teens handle difficult emotions?",
      options: [
        {
          id: "c",
          text: "Talk about feelings openly",
          emoji: "💬",
          description: "Open communication helps process emotions healthily",
          isCorrect: true
        },
        {
          id: "a",
          text: "Hide them completely",
          emoji: "🤐",
          description: "Hiding emotions prevents getting needed support",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only cry in private",
          emoji: "🏠",
          description: "Expressing emotions when needed is important",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A friend is crying. What is the manly thing to do?",
      options: [
        {
          id: "b",
          text: "Laugh at him",
          emoji: "😆",
          description: "Mocking others is hurtful and immature.",
          isCorrect: false
        },
        {
          id: "a",
          text: "Comfort him",
          emoji: "🤗",
          description: "Supporting friends is a sign of true strength.",
          isCorrect: true
        },
        {
          id: "c",
          text: "Tell him to stop",
          emoji: "🛑",
          description: "Everyone has the right to express feelings.",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You feel like crying but are in public. Is it okay?",
      options: [
        {
          id: "a",
          text: "No, never show weakness",
          emoji: "🚫",
          description: "Vulnerability is not weakness.",
          isCorrect: false
        },
        {
          id: "b",
          text: "Run away",
          emoji: "🏃",
          description: "You don't need to hide your emotions.",
          isCorrect: false
        },
        {
          id: "c",
          text: "Yes, it's a natural reaction",
          emoji: "✅",
          description: "It's okay to show emotions anywhere.",
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
    navigate("/student/health-male/teens/journal-of-stress");
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Boys Should Not Cry?"
      subtitle={!gameFinished ? `Debate ${currentQuestion + 1} of ${questions.length}` : "Debate Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-56"
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
              <h3 className="text-2xl font-bold text-white mb-2">Emotional Expression Debate</h3>
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
              Real strength is being honest about your feelings.
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

export default BoysShouldNotCryDebate;
