import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FeelingsNormalPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-56";
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
      question: "Which poster shows it's okay to cry?",
      posters: [
        {
          id: 1,
          title: "Stop Crying",
          description: "A poster saying crying is for babies",
          emoji: "🚫",
          isCorrect: false
        },
        {
          id: 2,
          title: "Tears are Okay",
          description: "A poster showing it's healthy to cry when sad",
          emoji: "😢",
          isCorrect: true
        },
        {
          id: 3,
          title: "Hide Tears",
          description: "A poster saying to hide your tears",
          emoji: "🙈",
          isCorrect: false
        }
      ],
      correctFeedback: "Tears are Okay is right!",
      explanation: "Crying helps let sad feelings out, and that's healthy!"
    },
    {
      question: "Which poster shows handling anger?",
      posters: [
        {
          id: 1,
          title: "Hit Something",
          description: "A poster showing hitting when mad",
          emoji: "👊",
          isCorrect: false
        },
        {
          id: 3,
          title: "Yell Loudly",
          description: "A poster showing yelling at friends",
          emoji: "🗣️",
          isCorrect: false
        },
        {
          id: 2,
          title: "Take a Breath",
          description: "A poster showing deep breathing to calm down",
          emoji: "🧘",
          isCorrect: true
        }
      ],
      correctFeedback: "Take a Breath is the best way!",
      explanation: "Calming down helps you make better choices when angry."
    },
    {
      question: "Which poster shows sharing happiness?",
      posters: [
        {
          id: 2,
          title: "Share the Joy",
          description: "A poster showing laughing with friends",
          emoji: "😄",
          isCorrect: true
        },
        {
          id: 1,
          title: "Keep it Secret",
          description: "A poster showing hiding a smile",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: 3,
          title: "Be Serious",
          description: "A poster saying not to laugh",
          emoji: "😐",
          isCorrect: false
        }
      ],
      correctFeedback: "Share the Joy is wonderful!",
      explanation: "Happiness grows when you share it with others!"
    },
    {
      question: "Which poster shows dealing with fear?",
      posters: [
        {
          id: 3,
          title: "Pretend",
          description: "A poster showing pretending not to be scared",
          emoji: "🎭",
          isCorrect: false
        },
        {
          id: 2,
          title: "Ask for Help",
          description: "A poster showing talking to an adult",
          emoji: "🤝",
          isCorrect: true
        },
        {
          id: 1,
          title: "Run Away",
          description: "A poster showing running from problems",
          emoji: "🏃",
          isCorrect: false
        }
      ],
      correctFeedback: "Ask for Help is smart!",
      explanation: "Everyone gets scared sometimes. Asking for help is brave!"
    },
    {
      question: "Which poster shows all feelings are normal?",
      posters: [
        {
          id: 3,
          title: "No Feelings",
          description: "A poster showing a robot with no feelings",
          emoji: "🤖",
          isCorrect: false
        },
        {
          id: 1,
          title: "Only Happy",
          description: "A poster saying you must always be happy",
          emoji: "😊",
          isCorrect: false
        },
        {
          id: 2,
          title: "Feelings Wheel",
          description: "A poster showing many different feelings are okay",
          emoji: "🌈",
          isCorrect: true
        }
      ],
      correctFeedback: "Feelings Wheel is perfect!",
      explanation: "All feelings—happy, sad, angry, scared—are a normal part of life!"
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
      // Show feedback for incorrect answer and move to next question
      showCorrectAnswerFeedback(0, false);
      
      // Check if this is the last stage
      const isLastStage = currentStage === stages.length - 1;
      
      if (isLastStage) {
        // Last stage - show result and game over modal
        setTimeout(() => {
          setShowResult(true);
        }, 1500);
      } else {
        // Move to next question after showing feedback
        setTimeout(() => {
          setCurrentStage(currentStage + 1);
          setSelectedPoster(null);
          setShowResult(false);
          resetFeedback();
        }, 1500);
      }
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
      title="Poster: Feelings are Normal"
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
      backPath="/games/health-male/kids"
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
                      ? "ring-4 ring-yellow-400 bg-gradient-to-r from-blue-500 to-cyan-600"
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
                <h3 className="text-2xl font-bold text-white mb-4">Great Choice!</h3>
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
                {/* Removed Try Again button to standardize behavior */}
                <p className="text-white/80 text-sm">
                  {currentStageData?.explanation || "Look for the poster that shows healthy feelings."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FeelingsNormalPoster;
