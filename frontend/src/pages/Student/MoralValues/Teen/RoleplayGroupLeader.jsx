import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RoleplayGroupLeader = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-38");
  const gameId = gameData?.id || "moral-teen-38";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RoleplayGroupLeader, using fallback ID");
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
      text: "Your team is behind schedule. How do you motivate them to finish tasks on time?",
      emoji: "⏰",
      options: [
        { 
          id: "priorities", 
          text: "Set clear priorities and encourage collaboration", 
          emoji: "📋", 
          description: "Clear planning and teamwork help teams succeed",
          isCorrect: true 
        },
        { 
          id: "yell", 
          text: "Yell at everyone to hurry", 
          emoji: "😠", 
          description: "Yelling creates stress and reduces productivity",
          isCorrect: false 
        },
        { 
          id: "alone", 
          text: "Do all tasks yourself", 
          emoji: "😶", 
          description: "Doing everything alone doesn't build teamwork",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "A team member is not contributing. How do you handle it?",
      emoji: "👤",
      options: [
        { 
          id: "ignore", 
          text: "Ignore them and hope they improve", 
          emoji: "😶", 
          description: "Ignoring problems doesn't solve them",
          isCorrect: false 
        },
        { 
          id: "assign", 
          text: "Assign tasks suited to their strengths and guide them", 
          emoji: "💪", 
          description: "Matching tasks to strengths helps team members contribute",
          isCorrect: true 
        },
        { 
          id: "criticize", 
          text: "Criticize publicly", 
          emoji: "👆", 
          description: "Public criticism damages relationships",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Two team members are arguing and delaying work. What do you do?",
      emoji: "😠",
      options: [
        { 
          id: "fight", 
          text: "Let them fight it out", 
          emoji: "😠", 
          description: "Letting conflicts continue delays progress",
          isCorrect: false 
        },
        { 
          id: "focus", 
          text: "Ignore conflict and focus on yourself", 
          emoji: "😶", 
          description: "Leaders should address team conflicts",
          isCorrect: false 
        },
        { 
          id: "mediate", 
          text: "Mediate and help them reach agreement", 
          emoji: "🕊️", 
          description: "Mediation resolves conflicts and helps teams work together",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "Deadline is tight and team is stressed. How do you act?",
      emoji: "😰",
      options: [
        { 
          id: "support", 
          text: "Offer support, break tasks into manageable steps", 
          emoji: "💪", 
          description: "Support and organization reduce stress",
          isCorrect: true 
        },
        { 
          id: "pressure", 
          text: "Add more pressure to force results", 
          emoji: "😠", 
          description: "More pressure increases stress and reduces performance",
          isCorrect: false 
        },
        { 
          id: "panic", 
          text: "Let them panic and figure it out", 
          emoji: "😰", 
          description: "Leaders should help, not abandon their team",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "Some tasks are boring, some fun. How do you ensure everyone participates?",
      emoji: "🎯",
      options: [
        { 
          id: "favorites", 
          text: "Assign fun tasks to favorites", 
          emoji: "😏", 
          description: "Favoritism creates unfairness",
          isCorrect: false 
        },
        { 
          id: "rotate", 
          text: "Rotate tasks fairly and motivate the team", 
          emoji: "🔄", 
          description: "Fair rotation ensures everyone participates",
          isCorrect: true 
        },
        { 
          id: "boring", 
          text: "Do boring tasks yourself", 
          emoji: "😶", 
          description: "Leaders should distribute work fairly",
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
      title="Roleplay: Group Leader"
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
                <h3 className="text-2xl font-bold text-white mb-4">You're an Effective Group Leader!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to lead teams effectively!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Effective leaders organize, support, and motivate their teams to work together!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Choose actions that help your team work together!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Effective leaders organize, support, and motivate their teams. Practice leading with fairness and encouragement!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayGroupLeader;
