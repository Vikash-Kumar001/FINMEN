import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getUvlsKidsGames } from '../../../../pages/Games/GameCategories/UVLS/kidGamesData';

const GoodCommunicatorBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-70");
  const gameId = gameData?.id || "uvls-kids-70";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for GoodCommunicatorBadge, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
    try {
      const games = getUvlsKidsGames({});
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
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Meeting Someone New",
      description: "You meet a new student. How do you communicate?",
      question: "You meet a new student. How do you communicate?",
      options: [
        
        { 
          text: "Ignore them - Pretend you don't see them", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Laugh at them - Make fun of them", 
          emoji: "😂", 
          isCorrect: false
        },
        { 
          text: "Stare at them - Look at them without speaking", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Greet politely and introduce yourself - Say hello and tell them your name", 
          emoji: "👋", 
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      title: "Friend is Upset",
      description: "Your friend looks upset. How do you communicate?",
      question: "Your friend looks upset. How do you communicate?",
      options: [
        { 
          text: "Ignore their feelings - Don't ask about it", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Listen and ask what's wrong - Show you care and want to help", 
          emoji: "👂", 
          isCorrect: true
        },
        { 
          text: "Make jokes - Try to make them laugh", 
          emoji: "😄", 
          isCorrect: false
        },
        { 
          text: "Tell them to get over it - Say they're overreacting", 
          emoji: "🙄", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Asking for Help",
      description: "You need help with homework. How do you ask?",
      question: "You need help with homework. How do you ask?",
      options: [
        { 
          text: "Demand help - Tell them they must help", 
          emoji: "😤", 
          isCorrect: false
        },
        { 
          text: "Don't ask - Try to figure it out alone", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Ask clearly and politely - Explain what you need help with", 
          emoji: "🙋", 
          isCorrect: true
        },
        { 
          text: "Whisper quietly - Mumble your request", 
          emoji: "🤫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Disagreement",
      description: "You disagree with a friend. How do you communicate?",
      question: "You disagree with a friend. How do you communicate?",
      options: [
        { 
          text: "Share your view respectfully - Explain your opinion without being mean", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          text: "Yell at them - Shout to make your point", 
          emoji: "😠", 
          isCorrect: false
        },
        
        { 
          text: "Stop talking to them - Give them the silent treatment", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Interrupt them constantly - Don't let them finish speaking", 
          emoji: "🗣️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Giving Feedback",
      description: "A friend asks for your opinion. How do you respond?",
      question: "A friend asks for your opinion. How do you respond?",
      options: [
        { 
          text: "Be mean and critical - Point out only bad things", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Lie to make them happy - Say everything is perfect", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          text: "Give kind, helpful feedback - Be honest but gentle", 
          emoji: "💝", 
          isCorrect: true
        },
        { 
          text: "Avoid giving any feedback - Don't say anything at all", 
          emoji: "🤐", 
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

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Good Communicator"
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
      backPath="/games/uvls/kids"
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{currentChallenge.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedAnswer(index);
                      handleChoice(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === index
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
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Good Communicator Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct!
                  You show great communication skills!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Being a good communicator means greeting people politely, listening when friends are upset, asking for help respectfully, sharing disagreements respectfully, and giving kind, helpful feedback. You've shown you can communicate well!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} correct.
                  Remember: Good communication is important for building relationships!
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setChallenge(0);
                    setScore(0);
                    setAnswered(false);
                    setSelectedAnswer(null);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always be respectful, listen actively, and express yourself clearly and kindly!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GoodCommunicatorBadge;
