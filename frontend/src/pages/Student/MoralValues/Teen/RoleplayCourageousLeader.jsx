import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RoleplayCourageousLeader = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-59");
  const gameId = gameData?.id || "moral-teen-59";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RoleplayCourageousLeader, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "You see a team member being blamed unfairly for a group mistake. What do you do?",
      emoji: "🛡️",
      options: [
        { 
          id: "speak", 
          text: "Speak up and clarify everyone's role", 
          emoji: "🗣️", 
          description: "Standing up for fairness shows courage",
          isCorrect: true 
        },
        { 
          id: "silent", 
          text: "Stay silent to avoid conflict", 
          emoji: "😶", 
          description: "Staying silent allows unfairness",
          isCorrect: false 
        },
        { 
          id: "join", 
          text: "Join others in blaming to stay popular", 
          emoji: "😏", 
          description: "Joining unfair blame is wrong",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "A classmate is being teased for asking questions. How would you lead?",
      emoji: "💬",
      options: [
        { 
          id: "ignore", 
          text: "Ignore the teasing", 
          emoji: "😶", 
          description: "Ignoring allows bullying to continue",
          isCorrect: false 
        },
        { 
          id: "stop", 
          text: "Tell others to stop and encourage curiosity", 
          emoji: "🛡️", 
          description: "Standing up against teasing shows courage",
          isCorrect: true 
        },
        { 
          id: "laugh", 
          text: "Laugh along to fit in", 
          emoji: "😄", 
          description: "Laughing along supports bullying",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Your team excludes a quiet member from discussions. What's your action?",
      emoji: "👥",
      options: [
        { 
          id: "let", 
          text: "Let it continue, it's their choice", 
          emoji: "😶", 
          description: "Leaders should ensure inclusion",
          isCorrect: false 
        },
        { 
          id: "focus", 
          text: "Only focus on your work", 
          emoji: "📝", 
          description: "Leaders should help the team",
          isCorrect: false 
        },
        { 
          id: "include", 
          text: "Include everyone and ensure fairness", 
          emoji: "🤝", 
          description: "Including everyone shows courageous leadership",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "During a sports match, your team cheats to win. What do you do?",
      emoji: "⚽",
      options: [
        { 
          id: "admit", 
          text: "Admit the mistake and accept fair results", 
          emoji: "💎", 
          description: "Admitting mistakes shows courage and integrity",
          isCorrect: true 
        },
        { 
          id: "nothing", 
          text: "Say nothing since you won", 
          emoji: "😶", 
          description: "Staying silent about cheating is wrong",
          isCorrect: false 
        },
        { 
          id: "defend", 
          text: "Defend the cheating as teamwork", 
          emoji: "😏", 
          description: "Defending cheating is dishonest",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "You notice favoritism in assigning team roles. What's the right stand?",
      emoji: "⚖️",
      options: [
        { 
          id: "accept", 
          text: "Accept it quietly", 
          emoji: "😶", 
          description: "Accepting unfairness doesn't help",
          isCorrect: false 
        },
        { 
          id: "speak", 
          text: "Speak to the teacher about equal opportunities", 
          emoji: "🗣️", 
          description: "Speaking up for fairness shows courage",
          isCorrect: true 
        },
        { 
          id: "complain", 
          text: "Complain secretly to friends", 
          emoji: "🤫", 
          description: "Secret complaints don't solve problems",
          isCorrect: false 
        }
      ]
    }
  ];

  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Roleplay: Courageous Leader"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="moral"
    >
      <div className="space-y-8 max-w-2xl mx-auto">
        {!showResult && questions[currentQuestion] ? (
          <div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">{questions[currentQuestion].emoji}</div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.isCorrect)}
                    disabled={answered}
                    className={`w-full text-left p-4 rounded-xl transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{option.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{option.text}</div>
                        <div className="text-sm opacity-90">{option.description}</div>
                      </div>
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
                <h3 className="text-2xl font-bold text-white mb-4">You're a Courageous Leader!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to stand up for what's right!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Courageous leaders stand up for fairness, speak against wrong, and protect others!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Choose actions that stand up for what's right!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Courageous leaders stand up for fairness, speak against wrong, and protect others. Practice being brave!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayCourageousLeader;
