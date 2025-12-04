import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GrowingUpPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-26";
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
      question: "Which poster shows normal growth?",
      posters: [
        {
          id: 1,
          title: "Stop Growing",
          description: "A poster saying growth is bad",
          emoji: "🚫📏",
          isCorrect: false
        },
        {
          id: 2,
          title: "Growing Strong",
          description: "A poster showing a happy growing child",
          emoji: "💪📏",
          isCorrect: true
        },
        {
          id: 3,
          title: "Shrinking Kid",
          description: "A poster showing a child getting smaller",
          emoji: "📉👶",
          isCorrect: false
        }
      ],
      correctFeedback: "Growing Strong is the right message!",
      explanation: "Growing taller and stronger is a normal part of being a kid!"
    },
    {
      question: "Which poster explains voice changes?",
      posters: [
        {
          id: 1,
          title: "Silent Voice",
          description: "A poster saying not to talk",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: 2,
          title: "New Voice",
          description: "A poster showing voice changing is natural",
          emoji: "🗣️🎵",
          isCorrect: true
        },
        {
          id: 3,
          title: "Scary Sounds",
          description: "A poster saying voice changes are scary",
          emoji: "😱🔊",
          isCorrect: false
        }
      ],
      correctFeedback: "New Voice explains it best!",
      explanation: "Your voice changing is just your body growing up!"
    },
    {
      question: "Which poster shows healthy habits for growth?",
      posters: [
        {
          id: 1,
          title: "Sleep & Eat Well",
          description: "A poster with healthy food and good sleep",
          emoji: "🥗🛌",
          isCorrect: true
        },
        {
          id: 2,
          title: "Stay Up Late",
          description: "A poster encouraging no sleep",
          emoji: "🌙🎮",
          isCorrect: false
        },
        {
          id: 3,
          title: "Junk Food Only",
          description: "A poster with only candy and chips",
          emoji: "🍬🍟",
          isCorrect: false
        }
      ],
      correctFeedback: "Sleep & Eat Well is the winner!",
      explanation: "Healthy food and plenty of sleep help your body grow its best!"
    },
    {
      question: "Which poster is about body hair?",
      posters: [
        {
          id: 1,
          title: "Shave It All",
          description: "A poster saying hair is bad",
          emoji: "🪒❌",
          isCorrect: false
        },
        {
          id: 2,
          title: "Hair is Normal",
          description: "A poster showing body hair is natural",
          emoji: "🧔✨",
          isCorrect: true
        },
        {
          id: 3,
          title: "Hide Your Hair",
          description: "A poster saying to hide body hair",
          emoji: "🙈👕",
          isCorrect: false
        }
      ],
      correctFeedback: "Hair is Normal is correct!",
      explanation: "Body hair growth happens to everyone during puberty!"
    },
    {
      question: "Which poster shows confidence?",
      posters: [
        {
          id: 1,
          title: "Be Ashamed",
          description: "A poster about hiding changes",
          emoji: "😔🙈",
          isCorrect: false
        },
        {
          id: 2,
          title: "Proud of Me",
          description: "A poster showing confidence in growing up",
          emoji: "😎🌟",
          isCorrect: true
        },
        {
          id: 3,
          title: "Fear Growth",
          description: "A poster about being scared of growing",
          emoji: "😨🛑",
          isCorrect: false
        }
      ],
      correctFeedback: "Proud of Me is the best attitude!",
      explanation: "Be proud of your growing body and the amazing changes happening!"
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
      title="Poster: Growing Up"
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
                <h3 className="text-2xl font-bold text-white mb-4">Creative Choice!</h3>
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
                  {currentStageData?.explanation || "Look for the poster that promotes healthy growth."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GrowingUpPoster;
