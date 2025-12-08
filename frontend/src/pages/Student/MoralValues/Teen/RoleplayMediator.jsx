import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RoleplayMediator = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-88");
  const gameId = gameData?.id || "moral-teen-88";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RoleplayMediator, using fallback ID");
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
      text: "Two classmates argue loudly over who should present the project. What's your first move as a mediator?",
      emoji: "🗣️",
      options: [
        { 
          id: "ask", 
          text: "Ask both to share their sides calmly one by one", 
          emoji: "👂", 
          description: "Listening to both sides helps find solutions",
          isCorrect: true 
        },
        { 
          id: "let", 
          text: "Let them argue until they calm down", 
          emoji: "😠", 
          description: "Letting arguments continue doesn't help",
          isCorrect: false 
        },
        { 
          id: "pick", 
          text: "Pick your favorite side to stop the fight faster", 
          emoji: "👆", 
          description: "Picking sides creates more conflict",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "One student refuses to listen while the other talks. What would you say?",
      emoji: "👂",
      options: [
        { 
          id: "tell", 
          text: "Tell them to stay quiet and let the teacher decide", 
          emoji: "👩‍🏫", 
          description: "Mediators should help resolve conflicts",
          isCorrect: false 
        },
        { 
          id: "remind", 
          text: "Remind them that listening is key to solving conflicts", 
          emoji: "🕊️", 
          description: "Encouraging listening helps resolve conflicts",
          isCorrect: true 
        },
        { 
          id: "leave", 
          text: "Leave the situation to avoid stress", 
          emoji: "🚶", 
          description: "Mediators should help, not leave",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Both students feel misunderstood. How can you help them reach common ground?",
      emoji: "🤝",
      options: [
        { 
          id: "forget", 
          text: "Tell them to forget it and move on", 
          emoji: "😶", 
          description: "Ignoring feelings doesn't solve problems",
          isCorrect: false 
        },
        { 
          id: "repeat", 
          text: "Repeat what each person said to ensure clarity", 
          emoji: "🔄", 
          description: "Clarifying helps people understand each other",
          isCorrect: true 
        },
        { 
          id: "choose", 
          text: "Ask others to choose who's right", 
          emoji: "👥", 
          description: "Choosing sides doesn't help find common ground",
          isCorrect: false 
        }
      ]
    },
    {
      id: 4,
      text: "The argument gets heated again. How should you handle it?",
      emoji: "😠",
      options: [
        { 
          id: "encourage", 
          text: "Encourage deep breaths and respectful tone", 
          emoji: "🕊️", 
          description: "Calming techniques help de-escalate conflicts",
          isCorrect: true 
        },
        { 
          id: "raise", 
          text: "Raise your voice to control them", 
          emoji: "😠", 
          description: "Raising your voice escalates conflicts",
          isCorrect: false 
        },
        { 
          id: "walk", 
          text: "Walk away immediately", 
          emoji: "🚶", 
          description: "Mediators should help resolve, not abandon",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "After resolving the fight, what should a good mediator do next?",
      emoji: "✅",
      options: [
        { 
          id: "ignore", 
          text: "Ignore both since the fight is over", 
          emoji: "😶", 
          description: "Good mediators follow up to ensure peace",
          isCorrect: false 
        },
        { 
          id: "check", 
          text: "Check in later to ensure peace continues", 
          emoji: "💚", 
          description: "Following up shows care and ensures lasting peace",
          isCorrect: true 
        },
        { 
          id: "remind", 
          text: "Remind them you were the hero", 
          emoji: "😏", 
          description: "Bragging doesn't show good mediation",
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
      title="Roleplay: Mediator"
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
                <h3 className="text-2xl font-bold text-white mb-4">You're a Peaceful Mediator!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to calm conflicts and bring peace!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Good mediators listen to both sides, stay calm, and help people find solutions together!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Choose actions that help people resolve conflicts peacefully!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Good mediators listen to both sides, stay calm, and help people find solutions. Practice being a peacemaker!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayMediator;
