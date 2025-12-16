import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Earth, Leaf, Recycle, TreePine, Heart, Globe } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const BadgeEarthGuardian = () => {
  const location = useLocation();
  const gameId = "sustainability-kids-25";
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

  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Badge: Earth Guardian game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
      title: "Ocean Protection",
      question: "How can you protect the ocean?",
      icon: Globe,
      item: "Ocean Protection",
      options: [
        { text: "Reduce plastic use and clean beaches", correct: true, coins: 1 },
        { text: "Throw trash in ocean", correct: false, coins: 0 },
        { text: "Ignore ocean pollution", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Protecting oceans helps marine life!",
        wrong: "We should reduce plastic and clean beaches to protect oceans!"
      }
    },
    {
      id: 2,
      title: "Wildlife Care",
      question: "How can you help protect wildlife?",
      icon: Heart,
      item: "Wildlife Care",
      options: [
        { text: "Harm animal homes", correct: false, coins: 0 },
        { text: "Protect habitats and plant trees", correct: true, coins: 1 },
        { text: "Ignore wildlife", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! Protecting habitats helps animals thrive!",
        wrong: "We should protect habitats and plant trees for wildlife!"
      }
    },
    {
      id: 3,
      title: "Clean Air",
      question: "What helps keep air clean?",
      icon: Leaf,
      item: "Clean Air",
      options: [
        { text: "Use cars everywhere", correct: false, coins: 0 },
        { text: "Pollute the air", correct: false, coins: 0 },
        { text: "Walk, bike, and plant trees", correct: true, coins: 1 }
      ],
      feedback: {
        correct: "Great! Walking, biking, and trees keep air clean!",
        wrong: "We should walk, bike, and plant trees to keep air clean!"
      }
    },
    {
      id: 4,
      title: "Green Transportation",
      question: "What's the best way to travel?",
      icon: TreePine,
      item: "Green Transportation",
      options: [
        { text: "Always use cars", correct: false, coins: 0 },
        { text: "Walk, bike, or use public transport", correct: true, coins: 1 },
        { text: "Waste fuel", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Amazing! Green transportation helps our planet!",
        wrong: "Walking, biking, and public transport are better for Earth!"
      }
    },
    {
      id: 5,
      title: "Earth Guardian",
      question: "What makes you an Earth Guardian?",
      icon: Earth,
      item: "Earth Guardian",
      options: [
        { text: "Harm the environment", correct: false, coins: 0 },
        { text: "Ignore Earth's problems", correct: false, coins: 0 },
        { text: "Protect oceans, wildlife, air, and use green transport", correct: true, coins: 1 }
      ],
      feedback: {
        correct: "Wonderful! You're a true Earth Guardian!",
        wrong: "Earth Guardians protect oceans, wildlife, air, and use green transport!"
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
      title="Badge: Earth Guardian"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Master all eco-challenges!` : "Badge Earned!"}
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
            <h3 className="text-2xl font-bold mb-2">{currentLevelData.title}</h3>
            <p className="text-lg mb-6">{currentLevelData.question}</p>
            <div className="space-y-3">
              {currentLevelData.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className={`w-full p-4 rounded-xl font-semibold transition-all ${
                    answered && selectedAnswer === option
                      ? option.correct
                        ? "bg-green-500"
                        : "bg-red-500"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  } text-white disabled:opacity-50`}
                >
                  {option.text}
                </button>
              ))}
            </div>
            {answered && selectedAnswer && (
              <p className="mt-4 text-yellow-300">
                {selectedAnswer.correct ? currentLevelData.feedback.correct : currentLevelData.feedback.wrong}
              </p>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeEarthGuardian;

