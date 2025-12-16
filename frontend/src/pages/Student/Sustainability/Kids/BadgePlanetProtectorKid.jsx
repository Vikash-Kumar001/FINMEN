import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Earth, Leaf, Recycle, TreePine, Heart } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const BadgePlanetProtectorKid = () => {
  const location = useLocation();
  const gameId = "sustainability-kids-20";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti, resetFeedback } = useGameFeedback();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityKidsGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Badge: Planet Protector Kid game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId]);

  const levels = [
    {
      id: 1,
      title: "Recycling",
      question: "What should you do with recyclable items?",
      icon: Recycle,
      item: "Recycling",
      options: [
        { text: "Put them in recycling bin", correct: true, coins: 1 },
        { text: "Throw them on the ground", correct: false, coins: 0 },
        { text: "Leave them anywhere", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Recycling helps protect our planet!",
        wrong: "Recyclable items should go in the recycling bin!"
      }
    },
    {
      id: 2,
      title: "Energy Saving",
      question: "What should you do when leaving a room?",
      icon: Leaf,
      item: "Energy Saving",
      options: [
        { text: "Leave all lights on", correct: false, coins: 0 },
        { text: "Turn off lights", correct: true, coins: 1 },
        { text: "Turn on more lights", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! Turning off lights saves energy!",
        wrong: "We should turn off lights when leaving a room to save energy!"
      }
    },
    {
      id: 3,
      title: "Water Conservation",
      question: "How can you save water?",
      icon: TreePine,
      item: "Water Conservation",
      options: [
        { text: "Leave tap running", correct: false, coins: 0 },
        { text: "Use lots of water", correct: false, coins: 0 },
        { text: "Turn off tap when brushing", correct: true, coins: 1 }
      ],
      feedback: {
        correct: "Great! Turning off taps saves precious water!",
        wrong: "We should turn off taps when not using them to save water!"
      }
    },
    {
      id: 4,
      title: "Nature Care",
      question: "How can you help protect nature?",
      icon: Heart,
      item: "Nature Care",
      options: [
        { text: "Harm plants and animals", correct: false, coins: 0 },
        { text: "Plant trees and care for them", correct: true, coins: 1 },
        { text: "Ignore nature", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Amazing! Caring for nature helps our planet!",
        wrong: "We should plant trees and care for nature to protect our planet!"
      }
    },
    {
      id: 5,
      title: "Planet Protection",
      question: "What makes you a Planet Protector?",
      icon: Earth,
      item: "Planet Protection",
      options: [
        { text: "Waste everything", correct: false, coins: 0 },
        { text: "Ignore the environment", correct: false, coins: 0 },
        { text: "Recycle, save energy, and care for nature", correct: true, coins: 1 }
      ],
      feedback: {
        correct: "Wonderful! You're a true Planet Protector Kid!",
        wrong: "Planet Protectors recycle, save energy, and care for nature!"
      }
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData.icon;

  const handleAnswer = (option) => {
    if (answered) return;
    setSelectedAnswer(option);
    setAnswered(true);
    resetFeedback();
    const isCorrect = option.correct;
    const isLastQuestion = currentLevel === 5;
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
        if (score + (isCorrect ? 1 : 0) >= 4) {
          showAnswerConfetti();
        }
      } else {
        setCurrentLevel(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const finalScore = score;
  const coins = finalScore;

  return (
    <GameShell
      title="Badge: Planet Protector Kid"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Test your planet protection knowledge!` : "Badge Earned!"}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      coins={coins}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="sustainability"
      maxScore={5}
      showConfetti={showResult && finalScore >= 4}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="text-center text-white space-y-6">
        {!showResult && currentLevelData && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="flex justify-center mb-4">
              <Icon className="w-16 h-16 text-green-400" />
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentLevel} of 5</span>
              <span className="text-yellow-400 font-bold">Score: {score}/5</span>
            </div>
            <p className="text-white text-lg mb-6 text-center">
              {currentLevelData.question}
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {currentLevelData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className="w-full min-h-[60px] bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {option.text}
                </button>
              ))}
            </div>
            {answered && selectedAnswer && (
              <div className={`mt-4 p-4 rounded-xl ${
                selectedAnswer.correct
                  ? 'bg-green-500/20 border-2 border-green-400' 
                  : 'bg-red-500/20 border-2 border-red-400'
              }`}>
                <p className="text-white font-semibold">
                  {selectedAnswer.correct
                    ? currentLevelData.feedback.correct
                    : currentLevelData.feedback.wrong}
                </p>
              </div>
            )}
          </div>
        )}
        {showResult && (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🏆🌍</div>
            <h3 className="text-3xl font-bold text-white">Planet Protector Kid Badge Earned!</h3>
            <p className="text-gray-300">
              You scored {finalScore} out of 5!
            </p>
            <p className="text-green-400 font-semibold text-xl">
              You earned {coins} coins! You're a true planet protector! 🌍🌱
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgePlanetProtectorKid;

