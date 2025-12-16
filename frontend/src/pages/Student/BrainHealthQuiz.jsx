import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, CheckCircle2, XCircle, Clock, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { logActivity } from "../../services/activityService";

const QUESTIONS = [
  {
    id: 1,
    question: "Which habit is MOST helpful for keeping your brain healthy?",
    options: [
      "Playing video games all night",
      "Sleeping 7–9 hours regularly",
      "Skipping breakfast every day",
      "Checking your phone every 2 minutes",
    ],
    answerIndex: 1,
    explanation: "Good quality sleep helps your brain store memories, recover, and stay focused.",
  },
  {
    id: 2,
    question: "Which food combination is BEST for brain health?",
    options: [
      "Chips and sugary soda",
      "Fruits, nuts, and whole grains",
      "Only black coffee",
      "Candy and chocolate all day",
    ],
    answerIndex: 1,
    explanation: "Fruits, nuts, and whole grains give your brain steady energy and important nutrients.",
  },
  {
    id: 3,
    question: "What is a healthy way to manage stress?",
    options: [
      "Keeping all your feelings inside",
      "Yelling at people around you",
      "Using breathing or relaxation exercises",
      "Ignoring your problems completely",
    ],
    answerIndex: 2,
    explanation: "Breathing, relaxation, and talking to someone you trust are healthy ways to manage stress.",
  },
  {
    id: 4,
    question: "How often should you move or stretch during long study sessions?",
    options: [
      "Every 45–60 minutes",
      "Only once a day",
      "Never, just sit the whole time",
      "Only if you feel pain",
    ],
    answerIndex: 0,
    explanation: "Short movement breaks every 45–60 minutes help blood flow and keep your brain alert.",
  },
  {
    id: 5,
    question: "Which statement about screen time is MOST accurate?",
    options: [
      "More screen time always makes you smarter",
      "Too much screen time can affect sleep and focus",
      "Screen time has no effect on the brain",
      "You should never use screens at all",
    ],
    answerIndex: 1,
    explanation: "Too much screen time, especially before bed, can disturb sleep and reduce focus.",
  },
];

export default function BrainHealthQuiz() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const handleSelect = (index) => {
    if (submitted) return;
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) {
      toast.error("Please select an answer before continuing.");
      return;
    }

    const isCorrect = selectedOption === currentQuestion.answerIndex;

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: {
        selectedIndex: selectedOption,
        correct: isCorrect,
      },
    };

    setAnswers(updatedAnswers);
    setScore(Object.values(updatedAnswers).filter((a) => a.correct).length);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(
        updatedAnswers[QUESTIONS[currentQuestionIndex + 1].id]?.selectedIndex ?? null
      );
    } else {
      setSubmitted(true);

      const totalCorrect = Object.values(updatedAnswers).filter((a) => a.correct).length;
      const xpEarned = totalCorrect * 5;

      logActivity({
        activityType: "quiz_completed",
        description: "Completed Brain Health Quiz",
        metadata: {
          quiz: "brain_health_quiz",
          totalQuestions: QUESTIONS.length,
          correct: totalCorrect,
          xpEarned,
        },
      });

      toast.success(`Quiz completed! You scored ${totalCorrect}/${QUESTIONS.length}.`);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setScore(0);
    setSubmitted(false);
  };

  const handleBackToBrainHealth = () => {
    logActivity({
      activityType: "navigation",
      description: "Navigated from Brain Health Quiz back to Brain Health",
      metadata: {
        from: "/learn/brain-health-quiz",
        to: "/student/dashboard/brain-health",
      },
    });
    navigate("/student/dashboard/brain-health");
  };

  const progressPercent = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-blue-200 to-emerald-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.03, x: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBackToBrainHealth}
            className="inline-flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-md border border-gray-200 hover:shadow-lg hover:bg-gray-50 text-sm font-semibold text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Brain Health</span>
          </motion.button>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>
              Question {currentQuestionIndex + 1} of {QUESTIONS.length}
            </span>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 mb-3">
            <Brain className="w-5 h-5" />
            <span className="text-xs sm:text-sm font-semibold">Brain Health Quiz</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Test Your Brain Health Knowledge
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Answer short questions about sleep, stress, food, and habits that keep your brain strong.
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 text-xs sm:text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50 mb-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {currentQuestionIndex + 1}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                {currentQuestion.question}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Choose the best answer that supports a healthy brain.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const wasAnswered = answers[currentQuestion.id];
              const isCorrectOption = index === currentQuestion.answerIndex;

              let borderClass = "border-gray-200";
              let bgClass = "bg-white/90 hover:bg-gray-50";
              let icon = null;

              if (submitted || wasAnswered) {
                if (isCorrectOption) {
                  borderClass = "border-emerald-500";
                  bgClass = "bg-emerald-50";
                  icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
                } else if (wasAnswered?.selectedIndex === index) {
                  borderClass = "border-rose-400";
                  bgClass = "bg-rose-50";
                  icon = <XCircle className="w-5 h-5 text-rose-500" />;
                }
              } else if (isSelected) {
                borderClass = "border-indigo-500";
                bgClass = "bg-indigo-50";
              }

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(index)}
                  className={`w-full text-left px-4 py-3 rounded-2xl border ${borderClass} ${bgClass} transition-all flex items-start gap-3`}
                >
                  <div className="mt-1">
                    {icon ? (
                      icon
                    ) : (
                      <span
                        className={`w-5 h-5 rounded-full border text-xs flex items-center justify-center ${
                          isSelected
                            ? "border-indigo-500 text-indigo-600"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm sm:text-base text-gray-800">{option}</span>
                </button>
              );
            })}
          </div>

          {(submitted || answers[currentQuestion.id]) && (
            <div className="mt-4 flex items-start gap-2 text-xs sm:text-sm text-gray-600 bg-indigo-50/70 border border-indigo-100 rounded-2xl px-4 py-3">
              <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5" />
              <p>
                <span className="font-semibold text-indigo-700">Why this matters: </span>
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </motion.div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
              <Brain className="w-3 h-3" />
              Score: {score}/{QUESTIONS.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {submitted && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRestart}
                className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Retake Quiz
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold shadow-md hover:shadow-lg"
            >
              {currentQuestionIndex === QUESTIONS.length - 1
                ? submitted
                  ? "Finish"
                  : "Submit Quiz"
                : "Save & Next"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}


