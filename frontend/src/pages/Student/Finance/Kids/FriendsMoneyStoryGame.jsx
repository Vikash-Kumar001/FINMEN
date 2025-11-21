import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HeartHandshake } from "lucide-react";
import { Confetti, ScoreFlash, GameOverModal } from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FriendsMoneyStoryGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
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
      situation: "Your friend is walking and drops a ₹10 note without noticing.",
      prompt: "What is the honest thing to do?",
      options: [
        {
          text: "Return the money to your friend",
          description: "You tell them kindly and give it back.",
          correct: true,
        },
        {
          text: "Keep it for yourself",
          description: "You pretend you never saw it fall.",
          correct: false,
        },
        {
          text: "Spend it on snacks",
          description: "You use it because you like treats.",
          correct: false,
        },
      ],
    },
    {
      id: 2,
      situation: "Your friend forgot their lunch money and asks if you can help.",
      prompt: "You have ₹10. What is the best choice?",
      options: [
        {
          text: "Lend ₹5 and agree when they can return it",
          description: "You help and keep it fair for both of you.",
          correct: true,
        },
        {
          text: "Give all ₹10 away",
          description: "You give everything even if you also need lunch.",
          correct: false,
        },
        {
          text: "Say no and keep it all",
          description: "You don’t care if your friend is hungry.",
          correct: false,
        },
      ],
    },
    {
      id: 3,
      situation: "You find a ₹20 note near your group of friends in class.",
      prompt: "No one knows whose it is. What should you do?",
      options: [
        {
          text: "Give it to the teacher",
          description: "They can keep it safe and ask the class.",
          correct: true,
        },
        {
          text: "Buy candy for everyone",
          description: "You spend it trying to be popular.",
          correct: false,
        },
        {
          text: "Keep it quietly",
          description: "You say nothing and take it home.",
          correct: false,
        },
      ],
    },
    {
      id: 4,
      situation: "Your friend borrowed ₹5 from you last week and now offers candy instead.",
      prompt: "What is the fairest response?",
      options: [
        {
          text: "Politely ask for the ₹5 back",
          description: "You respect the deal and stay kind.",
          correct: true,
        },
        {
          text: "Accept the candy instead",
          description: "You let the money part slide.",
          correct: false,
        },
        {
          text: "Forget about it",
          description: "You decide it doesn’t matter at all.",
          correct: false,
        },
      ],
    },
    {
      id: 5,
      situation: "You and your friends often deal with small amounts of money together.",
      prompt: "Why is being honest with money important for friendships?",
      options: [
        {
          text: "It builds trust between friends",
          description: "Everyone feels safe and respected.",
          correct: true,
        },
        {
          text: "It lets you get more gifts",
          description: "You think friends will give you extra things.",
          correct: false,
        },
        {
          text: "It helps you win every argument",
          description: "You believe honesty is for winning fights.",
          correct: false,
        },
      ],
    },
  ];

  const currentData = questions[currentQuestion];
  const totalQuestions = questions.length;

  const handleChoice = (option, index) => {
    if (showResult) return;

    const correct = option.correct;
    setSelectedIndex(index);
    setIsCorrect(correct);

    const newAnswers = [...answers, { questionId: currentData.id, correct }];
    setAnswers(newAnswers);

    resetFeedback();
    if (correct) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      setShowResult(true);
    }, correct ? 900 : 0);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedIndex(null);
      setShowResult(false);
      setIsCorrect(false);
      resetFeedback();
    } else {
      const correctCount = answers.filter((a) => a.correct).length;
      setFinalScore(correctCount);
    }
  };

  const allQuestionsAnswered = answers.length === totalQuestions;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-emerald-100 via-sky-50 to-indigo-100 flex flex-col relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
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
            {["🤝", "💰", "🍭", "📚", "😊", "✅"][i % 6]}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 relative z-30 bg-white/40 backdrop-blur-sm border-b border-emerald-200 flex-shrink-0 gap-2 sm:gap-4">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/80 hover:bg-white text-emerald-700 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-300 shadow-md transition-all cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex-1 flex items-center justify-center min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold px-2 flex items-center justify-center gap-1 sm:gap-2 truncate">
            <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-500" />
            <span className="bg-gradient-to-r from-emerald-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">Friend’s Money Story</span>
              <span className="xs:hidden">Friends & Money</span>
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-md px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-300 shadow-md">
            <span className="text-lg sm:text-xl md:text-2xl">💰</span>
            <span className="text-emerald-800 font-bold text-xs sm:text-sm md:text-lg">
              Coins: {coins}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 md:px-6 z-10 py-2 sm:py-4 overflow-y-auto min-h-0">
        {finalScore === 0 && (
          <div className="mb-1 sm:mb-2 md:mb-3 relative z-20 flex-shrink-0">
            <p className="text-emerald-900 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
          </div>
        )}

        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center min-h-0">
          {finalScore === 0 ? (
            !showResult ? (
              <div className="space-y-2 sm:space-y-3">
                {/* Story Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border-2 border-emerald-200 shadow-xl">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <span className="text-lg sm:text-xl md:text-2xl">🤝</span>
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-emerald-700">
                      Honest Choices with Friends’ Money
                    </span>
                  </div>
                  <p className="text-emerald-950 text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 font-semibold leading-relaxed px-1">
                    {currentData.situation}
                  </p>
                  <p className="text-emerald-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 font-bold px-1">
                    {currentData.prompt}
                  </p>

                  {/* Options - Single Row */}
                  <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap mb-3 sm:mb-4">
                    {currentData.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleChoice(option, index)}
                        disabled={showResult}
                        className={`flex-1 min-w-[130px] sm:min-w-[150px] px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl border-2 transition-all shadow-md bg-emerald-50 hover:bg-emerald-100 ${
                          selectedIndex === index && showResult
                            ? option.correct
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-rose-500 bg-rose-50"
                            : "border-emerald-200"
                        }`}
                      >
                        <div className="flex flex-col items-start text-left w-full">
                          <span className="font-semibold text-xs sm:text-sm md:text-base text-emerald-900">
                            {option.text}
                          </span>
                          <span className="mt-1 text-[11px] sm:text-xs md:text-sm text-emerald-700 leading-snug">
                            {option.description}
                          </span>
                        </div>
                      </button>
                    ))}
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
                            ? "bg-emerald-500 w-5 sm:w-6 animate-pulse"
                            : "bg-emerald-200 w-2"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-emerald-200 shadow-xl text-center max-w-2xl w-full">
                  <div
                    className={`text-6xl sm:text-7xl md:text-8xl mb-3 sm:mb-4 ${
                      isCorrect ? "animate-bounce" : ""
                    }`}
                  >
                    {isCorrect ? "✅" : "🤔"}
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-800 mb-2 sm:mb-3">
                    {isCorrect ? "Good Friend Move!" : "Think About Fairness"}
                  </h3>
                  <p className="text-emerald-900 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed px-1">
                    {isCorrect
                      ? "Nice! You chose an honest way to handle money with friends."
                      : "A fairer choice is: " +
                        currentData.options.find((o) => o.correct)?.text}
                  </p>
                  <button
                    onClick={handleNext}
                    className="px-8 sm:px-10 py-2.5 sm:py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all hover:scale-105 shadow-lg"
                  >
                    {currentQuestion < totalQuestions - 1 ? "Next Story" : "See Result"}
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-emerald-200 shadow-xl text-center max-w-2xl w-full">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">
                🤝💚
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-700 mb-2 sm:mb-3">
                Honest Friend Champion!
              </h3>
              <p className="text-emerald-900 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed px-1">
                You made {finalScore} out of {totalQuestions} honest choices with friends’
                money.
                <br />
                Friends trust and respect you when you return money, help fairly, and keep
                your promises.
              </p>
              <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 shadow-lg">
                <span className="text-xl sm:text-2xl">💰</span>
                <span className="text-base sm:text-lg md:text-xl font-bold">
                  +{coins} Coins
                </span>
              </div>
              <p className="text-emerald-800 text-xs sm:text-sm mb-3 sm:mb-4 px-1">
                Lesson: With friends and money, honesty is the best rule — it keeps both
                hearts and wallets safe.
              </p>
              {allQuestionsAnswered && (
                <button
                  onClick={() => navigate(resolvedBackPath)}
                  className="bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 hover:from-emerald-600 hover:via-sky-600 hover:to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all transform hover:scale-105"
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
      {finalScore > 0 && (
        <GameOverModal
          score={finalScore}
          totalQuestions={totalQuestions}
          coinsPerLevel={5}
          totalLevels={1}
          onClose={handleGameOverClose}
          gameId="finance-kids-95"
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

export default FriendsMoneyStoryGame;