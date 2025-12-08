import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RoleplayRespectLeader = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-18");
  const gameId = gameData?.id || "moral-teen-18";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RoleplayRespectLeader, using fallback ID");
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
      text: "You're leading a group discussion. Some members are quiet while others dominate. How do you lead with respect?",
      emoji: "👥",
      options: [
        { 
          id: "equal", 
          text: "Listen to everyone's ideas equally", 
          emoji: "👂", 
          description: "Equal listening shows respect for all",
          isCorrect: true 
        },
        { 
          id: "loud", 
          text: "Let loud members continue", 
          emoji: "🗣️", 
          description: "This ignores quiet members",
          isCorrect: false 
        },
        { 
          id: "smart", 
          text: "Only listen to the smartest members", 
          emoji: "🧠", 
          description: "This disrespects others' contributions",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "A teammate disagrees with your idea during a project meeting. What's your respectful response?",
      emoji: "💬",
      options: [
        { 
          id: "ignore", 
          text: "Ignore their opinion", 
          emoji: "😶", 
          description: "Ignoring shows disrespect",
          isCorrect: false 
        },
        { 
          id: "listen", 
          text: "Listen carefully and discuss calmly", 
          emoji: "🤝", 
          description: "Respectful discussion builds understanding",
          isCorrect: true 
        },
        { 
          id: "command", 
          text: "Tell them you're the leader and they must follow", 
          emoji: "👆", 
          description: "Commanding shows lack of respect",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "You notice one group member is always doing extra work. What's a respectful leadership move?",
      emoji: "💼",
      options: [
        { 
          id: "let", 
          text: "Let them handle it since they're responsible", 
          emoji: "😶", 
          description: "This takes advantage of them",
          isCorrect: false 
        },
        { 
          id: "appreciate", 
          text: "Appreciate them and redistribute tasks fairly", 
          emoji: "🙏", 
          description: "Fair distribution shows respect",
          isCorrect: true 
        },
        { 
          id: "credit", 
          text: "Take credit for the team's success", 
          emoji: "😏", 
          description: "Taking credit is disrespectful",
          isCorrect: false 
        }
      ]
    },
    {
      id: 4,
      text: "Two members are arguing loudly in your group. How would you lead respectfully?",
      emoji: "😠",
      options: [
        { 
          id: "calm", 
          text: "Calm them, listen to both sides, and find balance", 
          emoji: "🕊️", 
          description: "Calm mediation shows respect for all",
          isCorrect: true 
        },
        { 
          id: "argue", 
          text: "Let them argue it out", 
          emoji: "😠", 
          description: "This doesn't resolve the conflict",
          isCorrect: false 
        },
        { 
          id: "pick", 
          text: "Pick a side quickly to end it", 
          emoji: "👆", 
          description: "Picking sides shows bias",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "You're presenting your group's idea. Some classmates mock the plan. How do you respond as a respectful leader?",
      emoji: "🎤",
      options: [
        { 
          id: "argue", 
          text: "Argue back rudely", 
          emoji: "😠", 
          description: "Rudeness shows lack of respect",
          isCorrect: false 
        },
        { 
          id: "calm", 
          text: "Stay calm, respond politely, and stand by your team", 
          emoji: "💪", 
          description: "Calm respect shows strong leadership",
          isCorrect: true 
        },
        { 
          id: "giveup", 
          text: "Stop presenting and give up", 
          emoji: "😔", 
          description: "Giving up doesn't show leadership",
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
      title="Roleplay: Respect Leader"
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
                <h3 className="text-2xl font-bold text-white mb-4">You're a Respectful Leader!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to lead with respect and fairness!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Respectful leaders listen to everyone, stay calm, and value all team members!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Choose respectful and fair leadership actions!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Respectful leaders listen to everyone, stay calm, and value all team members. Practice showing respect in your leadership!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayRespectLeader;
