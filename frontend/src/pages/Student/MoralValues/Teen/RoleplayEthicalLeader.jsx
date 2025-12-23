import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RoleplayEthicalLeader = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-98");
  const gameId = gameData?.id || "moral-teen-98";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RoleplayEthicalLeader, using fallback ID");
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
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Your classmates want to skip cleaning duty, but the rule says everyone should take turns. What would you do as a fair leader?",
      emoji: "🧹",
      options: [
        { 
          id: "remind", 
          text: "Remind them kindly that rules apply equally to everyone", 
          emoji: "⚖️", 
          description: "Fair leaders ensure rules apply to everyone equally",
          isCorrect: true 
        },
        { 
          id: "ignore", 
          text: "Ignore and let them skip—it's not your problem", 
          emoji: "😶", 
          description: "Leaders should ensure fairness",
          isCorrect: false 
        },
        { 
          id: "silent", 
          text: "Do all the work yourself silently", 
          emoji: "😶", 
          description: "Doing others' work doesn't ensure fairness",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "You're organizing an event. A talented but rude student wants the spotlight. How do you act ethically?",
      emoji: "🎭",
      options: [
        { 
          id: "give", 
          text: "Give them all the attention—they're talented", 
          emoji: "⭐", 
          description: "Favoring talent over fairness is unethical",
          isCorrect: false 
        },
        { 
          id: "balance", 
          text: "Balance opportunities for all, promoting teamwork", 
          emoji: "🤝", 
          description: "Fair distribution shows ethical leadership",
          isCorrect: true 
        },
        { 
          id: "exclude", 
          text: "Exclude them to avoid drama", 
          emoji: "🚫", 
          description: "Exclusion is unfair",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "A friend asks you to bend a rule just for them. What is the right ethical response?",
      emoji: "🤔",
      options: [
        { 
          id: "agree", 
          text: "Agree because they're your close friend", 
          emoji: "👥", 
          description: "Favoring friends is unethical",
          isCorrect: false 
        },
        { 
          id: "pretend", 
          text: "Pretend to agree but don't actually help", 
          emoji: "😶", 
          description: "Being dishonest is unethical",
          isCorrect: false 
        },
        { 
          id: "refuse", 
          text: "Politely refuse and explain fairness matters", 
          emoji: "💎", 
          description: "Standing by fairness shows ethical leadership",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "Your teacher praises your team, but another group's idea was used. What's the ethical thing to do?",
      emoji: "👏",
      options: [
        { 
          id: "acknowledge", 
          text: "Acknowledge the other group's idea publicly", 
          emoji: "🙏", 
          description: "Giving credit where due shows ethics",
          isCorrect: true 
        },
        { 
          id: "silent", 
          text: "Stay silent and take the credit", 
          emoji: "😶", 
          description: "Taking undeserved credit is unethical",
          isCorrect: false 
        },
        { 
          id: "blame", 
          text: "Blame the teacher for missing it", 
          emoji: "👆", 
          description: "Blaming others is unethical",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "A student breaks a rule accidentally. The teacher didn't see it. What should an ethical leader do?",
      emoji: "📋",
      options: [
        { 
          id: "hide", 
          text: "Hide it to protect the student", 
          emoji: "🙈", 
          description: "Hiding mistakes isn't ethical",
          isCorrect: false 
        },
        { 
          id: "tell", 
          text: "Tell others to stay quiet about it", 
          emoji: "🤫", 
          description: "Encouraging silence isn't ethical",
          isCorrect: false 
        },
        { 
          id: "encourage", 
          text: "Encourage honesty and explain it calmly to the teacher", 
          emoji: "💎", 
          description: "Encouraging honesty shows ethical leadership",
          isCorrect: true 
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (showFeedback || showResult) return;
    
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setShowFeedback(true);
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        resetFeedback();
      }
    }, isCorrect ? 1000 : 800);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setSelectedOption(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Roleplay: Ethical Leader"
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
      <div className="max-w-4xl mx-auto space-y-6">
        {!showResult && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-7xl mb-4">{questions[currentQuestion].emoji}</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {questions[currentQuestion].text}
              </h3>
              <div className="flex justify-center gap-4 mt-2">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
            </div>
            
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = showFeedback && option.isCorrect;
                  const showIncorrect = showFeedback && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={showFeedback}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${showFeedback ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <h4 className="font-bold text-base mb-2">{option.text}</h4>
                    </button>
                  );
                })}
              </div>
              
              {showFeedback && (
                <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                  <div className="text-lg font-semibold">
                    {questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect 
                      ? "🌟 Great choice! That's the right action for an ethical leader!" 
                      : "💭 Good try! Remember, ethical leaders do what's right and fair even when it's difficult."}
                  </div>
                </div>
              )}
            </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">You're an Ethical Leader!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to lead with ethics and fairness!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Ethical leaders do what's right, ensure fairness, and act with integrity even when it's difficult!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Choose actions that are fair and ethical!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Ethical leaders do what's right, ensure fairness, and act with integrity. Practice making ethical decisions!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayEthicalLeader;
