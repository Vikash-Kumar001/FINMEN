import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const VolunteerSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-teen-83");
  const gameId = gameData?.id || "uvls-teen-83";
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getUvlsTeenGames({});
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
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const challenges = [
    {
      id: 1,
      title: "Venue Setup",
      question: "Task: Setup venue. How should you assign volunteers?",
      options: [
       
        { 
          text: "Random assignment", 
          emoji: "🎲",
          isCorrect: false
        },
        { 
          text: "No assignment", 
          emoji: "🚫",
          isCorrect: false
        },
        { 
          text: "Assign to the most experienced volunteers only", 
          emoji: "👑",
          isCorrect: false
        },
         { 
          text: "Match skills and assign to strong helpers", 
          emoji: "🪑",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      title: "Event Promotion",
      question: "Task: Promote event. How should you assign volunteers?",
      options: [
       
        { 
          text: "Anyone available", 
          emoji: "👤",
          isCorrect: false
        },
        { 
          text: "Skip promotion", 
          emoji: "🚫",
          isCorrect: false
        },
         { 
          text: "Creative team or social media experts", 
          emoji: "📢",
          isCorrect: true
        },
        { 
          text: "Assign to the most talkative volunteers", 
          emoji: "🗣️",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Registration",
      question: "Task: Handle registration. How should you assign volunteers?",
      options: [
        { 
          text: "Organized people or train volunteers", 
          emoji: "📝",
          isCorrect: true
        },
        { 
          text: "Novices without training", 
          emoji: "😰",
          isCorrect: false
        },
        { 
          text: "No registration system", 
          emoji: "🚫",
          isCorrect: false
        },
        { 
          text: "Assign to volunteers who arrived early", 
          emoji: "⏰",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Food Management",
      question: "Task: Manage food. How should you assign volunteers?",
      options: [
       
        { 
          text: "Random assignment", 
          emoji: "🎲",
          isCorrect: false
        },
         { 
          text: "Experienced cooks or hygiene trained", 
          emoji: "🍲",
          isCorrect: true
        },
        { 
          text: "No food service", 
          emoji: "🚫",
          isCorrect: false
        },
        { 
          text: "Assign to volunteers who eat the most", 
          emoji: "😋",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Cleanup",
      question: "Task: Cleanup. How should you assign volunteers?",
      options: [
       
        { 
          text: "Leave mess", 
          emoji: "😔",
          isCorrect: false
        },
        { 
          text: "One person does everything", 
          emoji: "😰",
          isCorrect: false
        },
         { 
          text: "Efficient team or rotate duty", 
          emoji: "🧹",
          isCorrect: true
        },
        { 
          text: "Assign to volunteers who made the most mess", 
          emoji: "🤪",
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
    
    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 500);
  };

  const currentChallengeData = challenges[challenge];

  return (
    <GameShell
      title="Badge: Volunteer Simulation"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="uvls"
      totalLevels={challenges.length}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && currentChallengeData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{currentChallengeData.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallengeData.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallengeData.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleChoice(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
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
        ) : null}
      </div>
    </GameShell>
  );
};

export default VolunteerSimulation;
