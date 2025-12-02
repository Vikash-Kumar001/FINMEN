import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PerspectivePuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-teen-3";
  const gameData = getGameDataById(gameId);
  
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
      text: "A student is struggling with homework and looks frustrated. What's the best response?",
      options: [
        { 
          id: "a", 
          text: "Offer to help explain the concept", 
          emoji: "🤝", 
          description: "Validates their struggle and provides support",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Tell them they should have paid attention in class", 
          emoji: "😠", 
          description: "Not helpful and dismissive",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Ignore them and continue your work", 
          emoji: "🙈", 
          description: "Shows lack of empathy",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "Someone is being excluded from a group project. What's the best response?",
      options: [
        { 
          id: "b", 
          text: "Laugh along with others", 
          emoji: "😄", 
          description: "Hurts the excluded person",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Invite them to join your group", 
          emoji: "👥", 
          description: "Shows understanding of how exclusion feels",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Pretend not to notice", 
          emoji: "🫥", 
          description: "Doesn't help the situation",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "A peer is upset about family problems. What's the best response?",
      options: [
        { 
          id: "b", 
          text: "Tell them your problems are worse", 
          emoji: "😤", 
          description: "Dismisses their feelings",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Change the subject quickly", 
          emoji: "🔄", 
          description: "Avoids their need for support",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Listen without judgment and offer support", 
          emoji: "👂", 
          description: "Helps them feel heard and understood",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "Someone made a mistake in front of the class. What's the best response?",
      options: [
        { 
          id: "b", 
          text: "Make fun of them later", 
          emoji: "😈", 
          description: "Hurts their feelings",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Reassure them that mistakes happen to everyone", 
          emoji: "💪", 
          description: "Helps them feel less alone",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Act like it was embarrassing", 
          emoji: "😳", 
          description: "Makes them feel worse",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "A new student doesn't understand the local language well. What's the best response?",
      options: [
        { 
          id: "b", 
          text: "Speak louder thinking they'll understand", 
          emoji: "📢", 
          description: "Doesn't help with language barrier",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Avoid talking to them", 
          emoji: "🚶", 
          description: "Excludes them further",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Speak slowly and offer to help translate", 
          emoji: "🗣️", 
          description: "Shows understanding of their challenge",
          isCorrect: true 
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
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Perspective Puzzle"
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
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.isCorrect)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">{option.emoji}</span>
                      <span className="font-semibold text-lg">{option.text}</span>
                      <span className="text-sm opacity-90">{option.description}</span>
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
                <h3 className="text-2xl font-bold text-white mb-4">Perspective Pro!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You understand how to see things from others' perspectives!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding others' perspectives helps us respond with empathy and support. When we see situations from someone else's point of view, we can offer help, inclusion, and kindness that truly makes a difference!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Try to see situations from others' perspectives!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: When someone is struggling, excluded, or upset, think about how you would feel in their situation. This helps you respond with empathy and support!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PerspectivePuzzle;

