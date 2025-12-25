import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsTeenGames } from "../../../../pages/Games/GameCategories/UVLS/teenGamesData";

const CitizenLeaderBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-teen-90");
  const gameId = gameData?.id || "uvls-teen-90";
  
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
      title: "Community Cleanup Initiative",
      question: "You want to organize a neighborhood cleanup. What's the best leadership approach?",
      options: [
        
        { 
          text: "Do it all yourself", 
          emoji: "😓", 
          isCorrect: false
        },
        { 
          text: "Organize a planning meeting, recruit volunteers, and coordinate with local authorities", 
          emoji: "🗑️", 
          isCorrect: true
        },
        { 
          text: "Wait for someone else to organize it", 
          emoji: "⏳", 
          isCorrect: false
        },
        { 
          text: "Just complain about the mess", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Youth Council Proposal",
      question: "You want to create a youth council in your community. How do you lead this initiative?",
      options: [
        { 
          text: "Research successful models, present a proposal, and build support from peers and adults", 
          emoji: "📋", 
          isCorrect: true
        },
        { 
          text: "Give up if adults don't support it", 
          emoji: "😔", 
          isCorrect: false
        },
        { 
          text: "Complain about lack of representation", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Start without any planning", 
          emoji: "🤪", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "School Improvement Project",
      question: "You want to improve school facilities. What's the best way to lead this effort?",
      options: [
       
        { 
          text: "Demand changes without a plan", 
          emoji: "📢", 
          isCorrect: false
        },
        { 
          text: "Ignore the problem", 
          emoji: "🙈", 
          isCorrect: false
        },
         { 
          text: "Gather student input, create a proposal, and present to school administration", 
          emoji: "🏫", 
          isCorrect: true
        },
        { 
          text: "Start a protest without any solutions", 
          emoji: "✊", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Community Event Planning",
      question: "You want to organize a community event. How do you demonstrate leadership?",
      options: [
       
        { 
          text: "Plan everything alone", 
          emoji: "😓", 
          isCorrect: false
        },
        { 
          text: "Form a planning committee, delegate tasks, and coordinate logistics", 
          emoji: "🎉", 
          isCorrect: true
        },
        { 
          text: "Wait for permission before starting", 
          emoji: "⏸️", 
          isCorrect: false
        },
        { 
          text: "Just wing it without any planning", 
          emoji: "🤷", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Advocacy Campaign",
      question: "You want to advocate for an important community issue. What's the best leadership approach?",
      options: [
        
        { 
          text: "Post on social media only", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Hope someone else addresses it", 
          emoji: "🤷", 
          isCorrect: false
        },
        { 
          text: "Start without any research or planning", 
          emoji: "🤔", 
          isCorrect: false
        },
         { 
          text: "Form a planning committee, delegate tasks, and coordinate logistics", 
          emoji: "🎉", 
          isCorrect: true
        },
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
      title="Badge: Citizen Leader"
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

export default CitizenLeaderBadge;
