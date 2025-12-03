import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const ProfilePictureSimulation = () => {
  const location = useLocation();
  const gameId = "dcos-teen-4";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getDcosTeenGames({});
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

  const stages = [
    {
      id: 1,
      title: "Social Media Profile",
      emoji: "📱",
      question: "Which profile picture is safest for social media?",
      choices: [
        { id: 1, type: "Personal Photo", emoji: "📸", description: "Your real photo showing your face", isCorrect: false },
        { id: 2, type: "Cartoon/Avatar", emoji: "🎨", description: "Animated character or cartoon", isCorrect: true },
        { id: 3, type: "Full Body Photo", emoji: "🧍", description: "Photo showing your full appearance", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Gaming Platform",
      emoji: "🎮",
      question: "What's the safest profile picture for gaming?",
      choices: [
        { id: 1, type: "Real Photo", emoji: "📷", description: "Your actual photo", isCorrect: false },
        { id: 2, type: "Game Avatar", emoji: "🎨", description: "Character from the game", isCorrect: true },
        { id: 3, type: "School Photo", emoji: "🎓", description: "Photo from school", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Chat App",
      emoji: "💬",
      question: "Which profile picture protects your identity?",
      choices: [
        { id: 1, type: "Selfie", emoji: "🤳", description: "Recent selfie photo", isCorrect: false },
        { id: 2, type: "Cartoon Character", emoji: "🎭", description: "Animated character", isCorrect: true },
        { id: 3, type: "Group Photo", emoji: "👥", description: "Photo with friends", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Online Forum",
      emoji: "💻",
      question: "What profile picture should you use?",
      choices: [
        { id: 1, type: "Personal Photo", emoji: "👤", description: "Your real photo", isCorrect: false },
        { id: 2, type: "Avatar/Icon", emoji: "🎨", description: "Cartoon or icon", isCorrect: true },
        { id: 3, type: "Pet Photo", emoji: "🐕", description: "Photo of your pet", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Video Platform",
      emoji: "📺",
      question: "Which is the safest profile picture choice?",
      choices: [
        { id: 1, type: "Real Photo", emoji: "📸", description: "Your actual photo", isCorrect: false },
        { id: 2, type: "Animated Avatar", emoji: "🎨", description: "Cartoon or animation", isCorrect: true },
        { id: 3, type: "Celebrity Photo", emoji: "⭐", description: "Photo of a celebrity", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (choiceId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const currentStageData = stages[currentStage];
    const selectedChoice = currentStageData.choices.find(c => c.id === choiceId);
    const isCorrect = selectedChoice?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentStage < stages.length - 1) {
        setCurrentStage(prev => prev + 1);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentStageData = stages[currentStage];

  return (
    <GameShell
      title="Profile Picture Simulation"
      score={score}
      subtitle={!showResult ? `Scenario ${currentStage + 1} of ${stages.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score === stages.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl md:text-8xl mb-4 text-center">{currentStageData.emoji}</div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">{currentStageData.title}</h2>
            <p className="text-white/70 mb-6 text-center text-lg">{currentStageData.question}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentStageData.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  disabled={answered}
                  className={`border-2 rounded-xl p-4 md:p-6 transition-all ${
                    answered && choice.isCorrect
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !choice.isCorrect
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-5xl md:text-6xl mb-3 text-center">{choice.emoji}</div>
                  <div className="text-white font-bold text-base md:text-lg mb-2 text-center">{choice.type}</div>
                  <div className="text-white/70 text-xs md:text-sm text-center">{choice.description}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🌟</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === stages.length ? "Perfect Smart Choice! 🎉" : `You got ${score} out of ${stages.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === stages.length 
                ? "Perfect! Using a cartoon or avatar protects your identity online. Personal photos can be used for facial recognition, identity theft, or tracking. Cartoons keep you anonymous while still expressing your personality!"
                : "Great job! Keep learning to protect your identity!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Using personal photos as profile pictures puts you at risk! Use cartoons or avatars instead.
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ProfilePictureSimulation;
