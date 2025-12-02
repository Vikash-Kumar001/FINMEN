import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const InclusionQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-teen-12");
  const gameId = gameData?.id || "uvls-teen-12";
  
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
      text: "Which school policy best promotes inclusion?",
      options: [
        { id: "a", text: "Zero tolerance for bullying and discrimination", isCorrect: true },
        { id: "b", text: "Separate classes for different ability levels", isCorrect: false },
        { id: "c", text: "Ignoring differences to treat everyone the same", isCorrect: false }
      ],
      rationale: "Active anti-discrimination policies create safe, inclusive environments."
    },
    {
      id: 2,
      text: "What is an inclusive school action?",
      options: [
        { id: "a", text: "Providing accommodations for students with different needs", isCorrect: true },
        { id: "b", text: "Making everyone do exactly the same thing", isCorrect: false },
        { id: "c", text: "Grouping students only by academic performance", isCorrect: false }
      ],
      rationale: "True inclusion recognizes and supports diverse needs."
    },
    {
      id: 3,
      text: "How can a school cafeteria be more inclusive?",
      options: [
        { id: "a", text: "Offer diverse food options respecting dietary restrictions", isCorrect: true },
        { id: "b", text: "Serve only one type of meal for simplicity", isCorrect: false },
        { id: "c", text: "Let students bring their own food only", isCorrect: false }
      ],
      rationale: "Diverse options respect cultural, religious, and dietary needs."
    },
    {
      id: 4,
      text: "Which classroom setup promotes inclusion?",
      options: [
        { id: "a", text: "Flexible seating with wheelchair-accessible spaces", isCorrect: true },
        { id: "b", text: "Fixed rows with students grouped by ability", isCorrect: false },
        { id: "c", text: "Only desks, no alternatives", isCorrect: false }
      ],
      rationale: "Flexible, accessible seating welcomes all students."
    },
    {
      id: 5,
      text: "What makes a school event inclusive?",
      options: [
        { id: "a", text: "Offering multiple ways to participate and accessible venues", isCorrect: true },
        { id: "b", text: "Having one standard format everyone must follow", isCorrect: false },
        { id: "c", text: "Only inviting high-achieving students", isCorrect: false }
      ],
      rationale: "Multiple participation options ensure everyone can join."
    },
    {
      id: 6,
      text: "How should schools handle name pronunciation?",
      options: [
        { id: "a", text: "Ask students their preferred pronunciation and use it", isCorrect: true },
        { id: "b", text: "Give students easier nicknames", isCorrect: false },
        { id: "c", text: "Just use last names for everyone", isCorrect: false }
      ],
      rationale: "Respecting names honors students' identities."
    },
    {
      id: 7,
      text: "What's an inclusive approach to group projects?",
      options: [
        { id: "a", text: "Assign diverse roles so everyone can contribute their strengths", isCorrect: true },
        { id: "b", text: "Let popular students choose all team members", isCorrect: false },
        { id: "c", text: "Group only similar students together", isCorrect: false }
      ],
      rationale: "Diverse roles leverage everyone's unique abilities."
    },
    {
      id: 8,
      text: "How can schools support LGBTQ+ students?",
      options: [
        { id: "a", text: "Have gender-neutral bathrooms and anti-discrimination policies", isCorrect: true },
        { id: "b", text: "Ignore the topic completely", isCorrect: false },
        { id: "c", text: "Tell them to hide their identity", isCorrect: false }
      ],
      rationale: "Supportive policies and facilities show all identities are valued."
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

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <GameShell
      title="Inclusion Quiz"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && percentage >= 75}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="uvls"
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                      <span className="font-semibold text-lg">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {answered && (
                <div className="bg-blue-500/20 rounded-lg p-3 mt-4">
                  <p className="text-white/80 text-sm">
                    💡 {questions[currentQuestion].rationale}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {percentage >= 75 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Inclusion Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct ({percentage}%)!
                  You understand what makes schools inclusive!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Inclusion means creating environments where everyone feels welcome, valued, and supported. This includes accommodations, diverse options, accessible spaces, and policies that respect all identities!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct ({percentage}%).
                  Get 75% or higher to earn coins!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Inclusion means making sure everyone feels welcome and can participate, regardless of their background, abilities, or identity!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InclusionQuiz;
