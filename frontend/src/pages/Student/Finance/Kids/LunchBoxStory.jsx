import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LunchBoxStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

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
      text: "You borrow your friend’s lunch today. What is the best thing to do tomorrow?",
      choices: [
        { id: "a", text: "Share or return lunch to them", emoji: "🍱", correct: true },
        { id: "b", text: "Ignore it and say nothing", emoji: "😐", correct: false },
        { id: "c", text: "Borrow again without asking", emoji: "🙈", correct: false },
      ],
    },
    {
      id: 2,
      text: "Your friend shares their lunch with you. How can you show thanks?",
      choices: [
        { id: "a", text: "Share your lunch another time", emoji: "🤝", correct: true },
        { id: "b", text: "Say nothing and take more", emoji: "🍴", correct: false },
        { id: "c", text: "Tell others it was your food", emoji: "🙃", correct: false },
      ],
    },
    {
      id: 3,
      text: "You have ₹10 for lunch. Your friend forgot their lunch. What is a kind choice?",
      choices: [
        { id: "a", text: "Share some money or food", emoji: "💸", correct: true },
        { id: "b", text: "Spend it all on yourself", emoji: "🍔", correct: false },
        { id: "c", text: "Hide your lunch", emoji: "💼", correct: false },
      ],
    },
    {
      id: 4,
      text: "You borrowed ₹10 from a friend for lunch. When should you repay?",
      choices: [
        { id: "a", text: "As soon as you have the money", emoji: "✅", correct: true },
        { id: "b", text: "Never, they will forget", emoji: "😅", correct: false },
        { id: "c", text: "Only if they get angry", emoji: "😠", correct: false },
      ],
    },
    {
      id: 5,
      text: "Why is sharing lunch with friends a good habit?",
      choices: [
        { id: "a", text: "It builds trust and kindness", emoji: "😊", correct: true },
        { id: "b", text: "You get more snacks", emoji: "🍟", correct: false },
        { id: "c", text: "It makes you look cool", emoji: "😎", correct: false },
      ],
    },
  ];

  const handleSelect = (choice) => {
    if (showResult) return;
    setSelectedAnswer(choice.id);
    const correct = choice.correct;
    setIsCorrect(correct);

    const newAnswers = [
      ...answers,
      { questionId: questions[currentQuestion].id, correct },
    ];
    setAnswers(newAnswers);

    if (correct) {
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      setShowResult(true);
    }, correct ? 1000 : 0);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
      resetFeedback();
    } else {
      const correctCount = answers.filter((a) => a.correct).length;
      setFinalScore(correctCount);
      setCoins(5);
    }
  };

  useEffect(() => {
    if (finalScore > 0 && coins === 5) {
      setShowResult(true);
    }
  }, [finalScore, coins]);

  const currentQuestionData = questions[currentQuestion];
  const allQuestionsAnswered = answers.length === questions.length;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 flex flex-col relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
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
            {["🍱", "🥪", "🤝", "💸", "😊", "🎯"][i % 6]}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/30 backdrop-blur-sm border-b border-amber-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-amber-700 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-amber-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl flex-shrink-0">
              🍱
            </span>
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Lunch Box Story</span>
              <span className="xs:hidden">Lunch Story</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-amber-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">💰</span>
            <span className="text-amber-800 font-bold text-xs sm:text-sm md:text-lg">
              Coins: {coins}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {!showResult && finalScore === 0 && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-gray-700 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        )}

        {/* Game Content */}
        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center min-h-0">
          {finalScore === 0 ? (
            !showResult ? (
              <div className="space-y-2 sm:space-y-3">
                {/* Question Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-amber-300 shadow-xl">
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">
                    🍱
                  </div>
                  <p className="text-gray-800 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 font-semibold leading-relaxed px-1">
                    {currentQuestionData.text}
                  </p>

                  {/* Options - Single Row */}
                  <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap mb-3 sm:mb-4">
                    {currentQuestionData.choices.map((choice) => {
                      const isSelected = selectedAnswer === choice.id;

                      return (
                        <button
                          key={choice.id}
                          onClick={() => handleSelect(choice)}
                          disabled={showResult}
                          className={`flex-1 min-w-[120px] sm:min-w-[150px] p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none ${
                            !showResult
                              ? "bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 hover:from-orange-500 hover:via-amber-500 hover:to-yellow-500 text-white border-2 border-white/30"
                              : isSelected && choice.correct
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-2 border-green-400 ring-4 ring-green-200"
                              : isSelected && !choice.correct
                              ? "bg-gradient-to-r from-red-500 to-rose-600 text-white border-2 border-red-400 ring-4 ring-red-200"
                              : choice.correct && showResult
                              ? "bg-gradient-to-r from-green-500/50 to-emerald-600/50 text-white border-2 border-green-400/50"
                              : "bg-gradient-to-r from-orange-400/50 via-amber-400/50 to-yellow-400/50 text-white/70 border-2 border-white/20"
                          }`}
                        >
                          <div className="text-2xl sm:text-3xl md:text-4xl mb-2">
                            {choice.emoji}
                          </div>
                          <h3 className="font-bold text-xs sm:text-sm md:text-base">
                            {choice.text}
                          </h3>
                        </button>
                      );
                    })}
                  </div>

                  {/* Progress Indicator - Inside Card */}
                  <div className="mt-3 sm:mt-4 flex justify-center gap-1 sm:gap-1.5 flex-wrap">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                          index < currentQuestion
                            ? "bg-green-500 w-5 sm:w-6"
                            : index === currentQuestion
                            ? "bg-amber-500 w-5 sm:w-6 animate-pulse"
                            : "bg-gray-300 w-2"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-amber-300 shadow-xl text-center">
                <div
                  className={`text-6xl sm:text-7xl md:text-8xl mb-4 ${
                    isCorrect ? "animate-bounce" : ""
                  }`}
                >
                  {isCorrect ? "✅" : "❌"}
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
                  {isCorrect ? "Correct!" : "Incorrect"}
                </h3>
                <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8">
                  {isCorrect
                    ? "Great choice! You’re a kind and fair lunch sharer!"
                    : "The correct answer is: " +
                      currentQuestionData.choices.find((opt) => opt.correct)?.text}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="px-8 sm:px-10 py-3 sm:py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl transition-all hover:scale-105 shadow-lg"
                >
                  {currentQuestion < questions.length - 1
                    ? "Next Question"
                    : "Finish"}
                </button>
              </div>
            )
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-amber-300 shadow-xl text-center max-w-2xl w-full">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">
                🎉🍱
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2 sm:mb-3">
                Lunch Hero!
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You scored {finalScore} out of {questions.length} — wonderful sharing and
                borrowing manners!
                <br />
                You know how to share, repay, and care for your friends. 🎯
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: Sharing food and repaying lunch money keeps friendships strong and
                fair.
              </p>
              {allQuestionsAnswered && (
                <button
                  onClick={() => navigate(resolvedBackPath)}
                  className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
                >
                  <span className="hidden sm:inline">
                    Continue to Next Level
                  </span>
                  <span className="sm:hidden">Next Level</span> →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confetti and Score Flash */}
      {showAnswerConfetti && <Confetti duration={2000} />}
      {flashPoints > 0 && <ScoreFlash points={flashPoints} />}

      {/* Game Over Modal */}
      {finalScore > 0 && coins === 5 && (
        <GameOverModal
          score={finalScore}
          totalQuestions={questions.length}
          coinsPerLevel={5}
          totalLevels={1}
          onClose={handleGameOverClose}
          gameId="finance-kids-55"
          gameType="finance"
          showConfetti={true}
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

export default LunchBoxStory;