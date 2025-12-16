import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Earth, Globe, Leaf, TreePine, Heart, Trophy } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const BadgeSustainabilityLeader = () => {
  const location = useLocation();
  const gameId = "sustainability-teens-25";
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
      const games = getSustainabilityTeenGames({});
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
      console.log(`🎮 Badge: Sustainability Leader game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
      title: "Biodiversity Conservation",
      question: "How can you help conserve biodiversity?",
      icon: Globe,
      item: "Biodiversity Conservation",
      options: [
        { text: "Protect natural habitats and ecosystems", correct: true, coins: 1 },
        { text: "Destroy habitats for development", correct: false, coins: 0 },
        { text: "Ignore conservation efforts", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Protecting habitats preserves species!",
        wrong: "We should protect natural habitats to conserve biodiversity!"
      }
    },
    {
      id: 2,
      title: "Sustainable Agriculture",
      question: "What makes agriculture sustainable?",
      icon: Leaf,
      item: "Sustainable Agriculture",
      options: [
        { text: "Excessive chemical use", correct: false, coins: 0 },
        { text: "Organic methods and soil health", correct: true, coins: 1 },
        { text: "Ignoring environmental impact", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Perfect! Sustainable agriculture protects the environment!",
        wrong: "Sustainable agriculture uses organic methods and maintains soil health!"
      }
    },
    {
      id: 3,
      title: "Ocean Protection",
      question: "How can you protect marine ecosystems?",
      icon: TreePine,
      item: "Ocean Protection",
      options: [
        { text: "Pollute oceans", correct: false, coins: 0 },
        { text: "Ignore marine life", correct: false, coins: 0 },
        { text: "Reduce plastic and support marine conservation", correct: true, coins: 1 }
      ],
      feedback: {
        correct: "Great! Protecting oceans helps marine life thrive!",
        wrong: "We should reduce plastic and support marine conservation!"
      }
    },
    {
      id: 4,
      title: "Community Leadership",
      question: "What makes a sustainability leader?",
      icon: Heart,
      item: "Community Leadership",
      options: [
        { text: "Work alone", correct: false, coins: 0 },
        { text: "Inspire others and lead by example", correct: true, coins: 1 },
        { text: "Ignore community needs", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Amazing! Leaders inspire and guide others!",
        wrong: "Sustainability leaders inspire others and lead by example!"
      }
    },
    {
      id: 5,
      title: "Sustainability Leader",
      question: "What makes you a Sustainability Leader?",
      icon: Earth,
      item: "Sustainability Leader",
      options: [
        { text: "Ignore sustainability", correct: false, coins: 0 },
        { text: "Work against environmental goals", correct: false, coins: 0 },
        { text: "Master all sustainability challenges and lead change", correct: true, coins: 1 }
      ],
      feedback: {
        correct: "Wonderful! You're a true Sustainability Leader!",
        wrong: "Sustainability Leaders master challenges and lead positive change!"
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
      title="Badge: Sustainability Leader"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Master all sustainability challenges!` : "Badge Earned!"}
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

export default BadgeSustainabilityLeader;

