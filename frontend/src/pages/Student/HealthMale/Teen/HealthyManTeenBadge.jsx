import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HealthyManTeenBadge = () => {
  const navigate = useNavigate();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Myth Busting",
      question: "Which statement about masculinity is a myth?",
      options: [
        {
          text: "Men should never cry or show weakness",
          emoji: "🚫",
          isCorrect: true
        },
        {
          text: "It's okay for men to ask for help",
          emoji: "✅",
          isCorrect: false
        },
        {
          text: "Men can be caring and nurturing",
          emoji: "❤️",
          isCorrect: false
        },
        {
          text: "Strength includes emotional intelligence",
          emoji: "🧠",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Emotional Health",
      question: "What is a healthy way to deal with anger?",
      options: [
        {
          text: "Punching a wall",
          emoji: "👊",
          isCorrect: false
        },
        {
          text: "Yelling at friends",
          emoji: "🗣️",
          isCorrect: false
        },
        {
          text: "Talking about it or exercising",
          emoji: "🏃",
          isCorrect: true
        },
        {
          text: "Bottling it up inside",
          emoji: "🤐",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Respect",
      question: "How do you show respect in a relationship?",
      options: [
        {
          text: "Controlling who they see",
          emoji: "📱",
          isCorrect: false
        },
        {
          text: "Listening and valuing their opinion",
          emoji: "👂",
          isCorrect: true
        },
        {
          text: "Making all the decisions",
          emoji: "👑",
          isCorrect: false
        },
        {
          text: "Ignoring their boundaries",
          emoji: "🚫",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Non-Violence",
      question: "What does it mean to choose non-violence?",
      options: [
        {
          text: "Solving conflicts with words, not fists",
          emoji: "🤝",
          isCorrect: true
        },
        {
          text: "Only fighting if someone starts it",
          emoji: "🥊",
          isCorrect: false
        },
        {
          text: "Being aggressive to get respect",
          emoji: "😠",
          isCorrect: false
        },
        {
          text: "Intimidating others",
          emoji: "😤",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Healthy Relationships",
      question: "What is a sign of a healthy friendship?",
      options: [
        {
          text: "Peer pressure to do bad things",
          emoji: "😈",
          isCorrect: false
        },
        {
          text: "Teasing that hurts feelings",
          emoji: "😢",
          isCorrect: false
        },
        {
          text: "Support and mutual trust",
          emoji: "🌟",
          isCorrect: true
        },
        {
          text: "Competition to be better",
          emoji: "🏆",
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (isCorrect) => {
    if (answered) return;

    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastChallenge = challenge === challenges.length - 1;

    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/health-male/teens");
  };

  return (
    <GameShell
      title="Badge: Healthy Man Teen"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId="health-male-teen-70"
      gameType="health-male"
      onNext={handleNext}
      nextEnabled={showResult}
    >
      <div className="space-y-8">
        {!showResult && challenges[challenge] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{challenges[challenge].title}</h3>
              <p className="text-white text-lg mb-6">
                {challenges[challenge].question}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges[challenge].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleAnswer(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === idx
                            ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                            : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-white font-semibold">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-4">Healthy Man Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct!
                  You're a true Healthy Man!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Being a healthy man means respecting yourself and others, managing emotions, and breaking harmful myths!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct.
                  Practice makes perfect!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Remember to challenge myths, express emotions healthily, and respect everyone!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HealthyManTeenBadge;
