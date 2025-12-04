import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PowerOfNoPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-66";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentStage, setCurrentStage] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stages = [
    {
      question: "Which poster shows the power of saying NO?",
      posters: [
        {
          id: 1,
          title: "Say Yes to Everything",
          description: "A poster showing someone always agreeing",
          emoji: "👍",
          isCorrect: false
        },
        {
          id: 2,
          title: "Power of No",
          description: "A poster showing strength in saying no",
          emoji: "🛡️",
          isCorrect: true
        },
        {
          id: 3,
          title: "Maybe Later",
          description: "A poster showing indecision",
          emoji: "🤷",
          isCorrect: false
        }
      ],
      correctFeedback: "The Power of No protects you!",
      explanation: "Saying no is a superpower that keeps you safe and strong!"
    },
    {
      question: "Which poster shows standing up to peer pressure?",
      posters: [
        {
          id: 1,
          title: "Follow the Crowd",
          description: "A poster showing doing what everyone else does",
          emoji: "👥",
          isCorrect: false
        },
        {
          id: 2,
          title: "Hide Away",
          description: "A poster showing hiding from problems",
          emoji: "🙈",
          isCorrect: false
        },
        {
          id: 3,
          title: "Stand Tall",
          description: "A poster showing standing confident and firm",
          emoji: "🦁",
          isCorrect: true
        }
      ],
      correctFeedback: "Stand Tall and be confident!",
      explanation: "Confidence helps you resist pressure from others!"
    },
    {
      question: "Which poster shows a healthy boundary?",
      posters: [
        {
          id: 1,
          title: "My Space",
          description: "A poster showing personal space and rules",
          emoji: "🚧",
          isCorrect: true
        },
        {
          id: 2,
          title: "No Rules",
          description: "A poster showing chaos and no limits",
          emoji: "🌀",
          isCorrect: false
        },
        {
          id: 3,
          title: "Open Door",
          description: "A poster showing letting anyone do anything",
          emoji: "🚪",
          isCorrect: false
        }
      ],
      correctFeedback: "My Space, my rules!",
      explanation: "Boundaries are like fences that keep the good in and bad out!"
    },
    {
      question: "Which poster shows asking for help?",
      posters: [
        {
          id: 1,
          title: "Keep Secrets",
          description: "A poster showing keeping problems inside",
          emoji: "🤫",
          isCorrect: false
        },
        {
          id: 2,
          title: "Trusted Adult",
          description: "A poster showing talking to a parent or teacher",
          emoji: "👨‍👩‍👧",
          isCorrect: true
        },
        {
          id: 3,
          title: "Solve Alone",
          description: "A poster showing struggling alone",
          emoji: "😓",
          isCorrect: false
        }
      ],
      correctFeedback: "Trusted Adults are there to help!",
      explanation: "You don't have to face big problems alone. Asking for help is smart!"
    },
    {
      question: "Which poster shows true friendship?",
      posters: [
        {
          id: 1,
          title: "Bossy Friend",
          description: "A poster showing one friend controlling another",
          emoji: "👉",
          isCorrect: false
        },
        {
          id: 2,
          title: "Respectful Friend",
          description: "A poster showing friends listening to each other",
          emoji: "🤝",
          isCorrect: true
        },
        {
          id: 3,
          title: "Mean Friend",
          description: "A poster showing teasing and pressure",
          emoji: "😠",
          isCorrect: false
        }
      ],
      correctFeedback: "Respect is key to friendship!",
      explanation: "True friends respect your 'No' and like you for who you are!"
    }
  ];

  const currentStageData = stages[currentStage];
  const posters = currentStageData?.posters || [];

  const handlePosterSelect = (poster) => {
    setSelectedPoster(poster.id);

    if (poster.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);

      // Check if this is the last stage
      const isLastStage = currentStage === stages.length - 1;

      if (isLastStage) {
        // Last stage - show result and game over modal
        setShowResult(true);
      } else {
        // Automatically move to next question after showing feedback
        setTimeout(() => {
          setCurrentStage(currentStage + 1);
          setSelectedPoster(null);
          setShowResult(false);
          resetFeedback();
        }, 1500);
      }
    } else {
      // Show result immediately for incorrect
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  const handleTryAgain = () => {
    setSelectedPoster(null);
    setShowResult(false);
    resetFeedback();
  };

  const isLastStage = currentStage === stages.length - 1;
  const selectedPosterData = selectedPoster ? posters.find(p => p.id === selectedPoster) : null;
  const isCorrect = selectedPosterData?.isCorrect || false;

  return (
    <GameShell
      title="Poster: Power of No"
      subtitle={`Question ${currentStage + 1} of ${stages.length}`}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={showResult && selectedPoster && isCorrect && !isLastStage}
      showGameOver={showResult && isLastStage && isCorrect}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl font-bold mb-6 text-center">
                Question {currentStage + 1}: {currentStageData?.question}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {posters.map(poster => (
                  <button
                    key={poster.id}
                    onClick={() => handlePosterSelect(poster)}
                    disabled={showResult}
                    className={`p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 ${selectedPoster === poster.id
                      ? "ring-4 ring-yellow-400 bg-gradient-to-r from-blue-500 to-indigo-600"
                      : "bg-gradient-to-r from-green-500 to-emerald-600"
                      } ${showResult ? "opacity-75 cursor-not-allowed" : "hover:scale-105"}`}
                  >
                    <div className="text-4xl mb-4 text-center">{poster.emoji}</div>
                    <h3 className="font-bold text-xl text-white mb-2 text-center">{poster.title}</h3>
                    <p className="text-white/90 text-center">{poster.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {isCorrect ? (
              <div>
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-white mb-4">Powerful Choice!</h3>
                <p className="text-white/90 text-lg mb-4">
                  {currentStageData?.correctFeedback}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+1 Coin</span>
                </div>
                <p className="text-white/80 mb-4">
                  {currentStageData?.explanation}
                </p>
                {!isLastStage && (
                  <p className="text-white/70 text-sm mt-4">
                    Question {currentStage + 1} of {stages.length} completed!
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">🤔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Think About It!</h3>
                <p className="text-white/90 text-lg mb-4">
                  {currentStageData?.correctFeedback || "That's not quite right. Try again!"}
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  {currentStageData?.explanation || "Look for the poster that shows strength in saying no."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PowerOfNoPoster;
