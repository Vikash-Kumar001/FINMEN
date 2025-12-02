import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TypesMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-34";
  const gameData = getGameDataById(gameId);
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
      text: "What type of bullying is 'Pushing'?",
      emoji: "👊",
      options: [
        { 
          id: "physical", 
          text: "Physical", 
          emoji: "💪", 
          description: "Harming someone's body",
          isCorrect: true 
        },
        { 
          id: "verbal", 
          text: "Verbal", 
          emoji: "🗣️", 
          description: "Using words to hurt",
          isCorrect: false 
        },
        { 
          id: "cyber", 
          text: "Cyber", 
          emoji: "💻", 
          description: "Bullying online",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "What type of bullying is 'Name-calling'?",
      emoji: "😢",
      options: [
        { 
          id: "physical", 
          text: "Physical", 
          emoji: "💪", 
          description: "Harming someone's body",
          isCorrect: false 
        },
        { 
          id: "verbal", 
          text: "Verbal", 
          emoji: "🗣️", 
          description: "Using words to hurt",
          isCorrect: true 
        },
        { 
          id: "cyber", 
          text: "Cyber", 
          emoji: "💻", 
          description: "Bullying online",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "What type of bullying is 'Mean texts'?",
      emoji: "📱",
      options: [
        { 
          id: "physical", 
          text: "Physical", 
          emoji: "💪", 
          description: "Harming someone's body",
          isCorrect: false 
        },
        { 
          id: "verbal", 
          text: "Verbal", 
          emoji: "🗣️", 
          description: "Using words to hurt",
          isCorrect: false 
        },
        { 
          id: "cyber", 
          text: "Cyber", 
          emoji: "💻", 
          description: "Bullying online",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "What type of bullying is 'Hitting'?",
      emoji: "👊",
      options: [
        { 
          id: "physical", 
          text: "Physical", 
          emoji: "💪", 
          description: "Harming someone's body",
          isCorrect: true 
        },
        { 
          id: "verbal", 
          text: "Verbal", 
          emoji: "🗣️", 
          description: "Using words to hurt",
          isCorrect: false 
        },
        { 
          id: "cyber", 
          text: "Cyber", 
          emoji: "💻", 
          description: "Bullying online",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "What type of bullying is 'Online rumors'?",
      emoji: "💻",
      options: [
        { 
          id: "physical", 
          text: "Physical", 
          emoji: "💪", 
          description: "Harming someone's body",
          isCorrect: false 
        },
        { 
          id: "cyber", 
          text: "Cyber", 
          emoji: "💻", 
          description: "Bullying online",
          isCorrect: true 
        },
        { 
          id: "verbal", 
          text: "Verbal", 
          emoji: "🗣️", 
          description: "Using words to hurt",
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

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  return (
    <GameShell
      title="Types Match"
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
      gameType="uvls"
      onNext={handleNext}
      nextEnabled={showResult && score >= 3}
    >
      <div className="space-y-8 max-w-2xl mx-auto">
        {!showResult && questions[currentQuestion] ? (
          <div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl p-6 mb-6 text-center">
                <div className="text-6xl mb-3">{questions[currentQuestion].emoji}</div>
                <h3 className="text-white text-xl font-bold">{questions[currentQuestion].text}</h3>
              </div>
              
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
                        : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
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
                <h3 className="text-2xl font-bold text-white mb-4">Type Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You understand different types of bullying!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding different types of bullying (physical, verbal, and cyber) helps us recognize and stop it. Physical bullying harms the body, verbal bullying uses hurtful words, and cyber bullying happens online!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Match Better!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Keep learning about different types of bullying!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Physical bullying harms the body (hitting, pushing). Verbal bullying uses words (name-calling, insults). Cyber bullying happens online (mean texts, rumors)!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TypesMatch;
