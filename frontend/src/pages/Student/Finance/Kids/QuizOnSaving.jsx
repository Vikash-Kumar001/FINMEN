import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnSaving = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Calculate back path
  const resolvedBackPath = useMemo(() => {
    if (location.state?.returnPath) {
      return location.state.returnPath;
    }

    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments[0] === "student" && pathSegments.length >= 3) {
      const categoryKey = pathSegments[1];
      const ageKey = pathSegments[2];

      const categorySlugMap = {
        finance: "financial-literacy",
        "financial-literacy": "financial-literacy",
      };

      const ageSlugMap = {
        kid: "kids",
        kids: "kids",
      };

      const mappedCategory = categorySlugMap[categoryKey] || categoryKey;
      const mappedAge = ageSlugMap[ageKey] || ageKey;

      return `/games/${mappedCategory}/${mappedAge}`;
    }

    return "/games";
  }, [location.pathname, location.state]);

  const handleGameOverClose = () => {
    navigate(resolvedBackPath);
  };

  const questions = [
    {
      id: 1,
      text: "Who is the best saver?",
      options: [
        { id: "a", text: "Someone who spends all their money", correct: false },
        { id: "b", text: "Someone who saves part of their money", correct: true },
        { id: "c", text: "Someone who wastes money", correct: false }
      ]
    },
    {
      id: 2,
      text: "What should you do with money you receive as a gift?",
      options: [
        { id: "a", text: "Spend it all immediately", correct: false },
        { id: "b", text: "Save some and spend some", correct: true },
        { id: "c", text: "Give it all away", correct: false }
      ]
    },
    {
      id: 3,
      text: "Why is saving money important?",
      options: [
        { id: "a", text: "It helps you buy things you want later", correct: true },
        { id: "b", text: "It's not important at all", correct: false },
        { id: "c", text: "It makes you poor", correct: false }
      ]
    },
    {
      id: 4,
      text: "What is a piggy bank used for?",
      options: [
        { id: "a", text: "Keeping toys", correct: false },
        { id: "b", text: "Saving money", correct: true },
        { id: "c", text: "Storing food", correct: false }
      ]
    },
    {
      id: 5,
      text: "If you save ₹10 every week, how much will you have in 4 weeks?",
      options: [
        { id: "a", text: "₹10", correct: false },
        { id: "b", text: "₹20", correct: false },
        { id: "c", text: "₹40", correct: true }
      ]
    }
  ];

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option.id);
    const correct = option.correct;
    setIsCorrect(correct);
    
    // Save the answer
    const newAnswers = [...answers, { questionId: questions[currentQuestion].id, correct }];
    setAnswers(newAnswers);
    
    if (correct) {
      showCorrectAnswerFeedback(1, true);
    }
    
    // Show result, then move to next question or finish
    setTimeout(() => {
      setShowResult(true);
    }, correct ? 1000 : 0);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
      resetFeedback();
    } else {
      // Calculate final score
      const correctCount = answers.filter(a => a.correct).length;
      setFinalScore(correctCount);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/student/finance/kids/reflex-savings");
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    resetFeedback();
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setAnswers([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const getCurrentQuestionData = () => {
    return questions[currentQuestion];
  };

  const currentQuestionData = getCurrentQuestionData();
  const isLastQuestion = currentQuestion === questions.length - 1;
  const allQuestionsAnswered = answers.length === questions.length;

  // Award 5 coins when all questions are answered
  useEffect(() => {
    if (allQuestionsAnswered && finalScore > 0) {
      setCoins(5);
    }
  }, [allQuestionsAnswered, finalScore]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex flex-col relative overflow-hidden">
      {/* Floating Quiz Elements Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-lg sm:text-2xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {['📝', '❓', '💡', '✅'][i % 4]}
          </div>
        ))}
      </div>

      {/* Animations */}
      {flashPoints !== null && <ScoreFlash points={flashPoints} />}
      {showAnswerConfetti && <Confetti duration={1000} />}
      {showResult && allQuestionsAnswered && finalScore >= 3 && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/30 backdrop-blur-sm border-b border-blue-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-blue-600 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-blue-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">📝</span>
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Quiz on Saving</span>
              <span className="xs:hidden">Quiz Saving</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-blue-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">📝</span>
            <span className="text-blue-700 font-bold text-xs sm:text-sm md:text-lg">Coins: {coins}</span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && !allQuestionsAnswered && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        )}
        {allQuestionsAnswered && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Quiz Complete!
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-2xl flex-1 flex flex-col justify-center min-h-0">
          {!allQuestionsAnswered && !showResult && currentQuestionData ? (
            <div className="space-y-2 sm:space-y-3">
              {/* Question Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-blue-300 shadow-xl transform transition-all hover:scale-[1.01]">
                {/* Quiz Icon */}
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 animate-bounce">📝</div>
                
                <h3 className="text-gray-800 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 font-semibold leading-relaxed px-1">
                  {currentQuestionData.text}
                </h3>
                
                {/* Options */}
                <div className="space-y-2 sm:space-y-3">
                  {currentQuestionData.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showResult}
                      className={`w-full text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all transform hover:scale-[1.02] ${
                        selectedAnswer === option.id
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg border-2 border-blue-400"
                          : "bg-gradient-to-r from-blue-100 to-indigo-100 text-gray-800 hover:from-blue-200 hover:to-indigo-200 border-2 border-blue-200"
                      } ${showResult ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 ${
                          selectedAnswer === option.id
                            ? "border-white/50 bg-white/20"
                            : "border-blue-400 bg-white"
                        }`}>
                          <span className={`text-xs sm:text-sm font-bold ${
                            selectedAnswer === option.id ? "text-white" : "text-blue-600"
                          }`}>
                            {option.id.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm md:text-base font-medium">{option.text}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Progress Indicator */}
                <div className="mt-3 sm:mt-4 flex justify-center gap-1 sm:gap-1.5 flex-wrap">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index < currentQuestion
                          ? "bg-green-500 w-5 sm:w-6"
                          : index === currentQuestion
                          ? "bg-blue-500 w-5 sm:w-6 animate-pulse"
                          : "bg-gray-300 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : !allQuestionsAnswered && showResult ? (
            /* Question Result */
            <div className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-blue-300 shadow-xl text-center">
              {isCorrect ? (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 animate-bounce">🎉</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">✅</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Correct!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    Great answer! You're learning about saving money!
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                  >
                    {isLastQuestion ? "See Results" : "Next Question"} →
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">😔</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">❌</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Not Quite!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    That's okay! Keep learning about saving money.
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                  >
                    {isLastQuestion ? "See Results" : "Next Question"} →
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Final Results Card */
            <div className="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-blue-300 shadow-xl text-center">
              {finalScore >= 3 ? (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 animate-bounce">🎉</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🏆</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">Excellent Work!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You got <span className="font-bold text-green-600">{finalScore}</span> out of{" "}
                    <span className="font-bold">{questions.length}</span> questions correct!
                    <br />
                    You're becoming a savings expert! 💰
                  </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
                  </div>
                  <button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                  >
                    <span className="hidden sm:inline">Continue to Next Level</span>
                    <span className="sm:hidden">Next Level</span> →
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">😔</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">📚</div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2 sm:mb-3">Keep Learning!</h3>
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                    You got <span className="font-bold text-blue-600">{finalScore}</span> out of{" "}
                    <span className="font-bold">{questions.length}</span> questions correct.
                    <br />
                    Practice makes perfect! Keep learning about saving money!
                  </p>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-3 sm:px-5 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                    <span className="text-xl sm:text-2xl">💰</span>
                    <span className="text-base sm:text-lg md:text-xl font-bold">+5 Coins</span>
                  </div>
                  <button
                    onClick={handleRestart}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105 mb-3 sm:mb-4"
                  >
                    Try Again 📝
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Game Over Modal */}
      {allQuestionsAnswered && finalScore >= 3 && (
        <GameOverModal
          score={5}
          gameId="finance-kids-2"
          gameType="finance"
          totalLevels={questions.length}
          coinsPerLevel={1}
          isReplay={location?.state?.isReplay || false}
          onClose={handleGameOverClose}
        />
      )}

      {/* Animations CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default QuizOnSaving;