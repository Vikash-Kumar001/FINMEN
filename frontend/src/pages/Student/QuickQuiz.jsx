import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Check,
    X,
    Star,
    Sparkles,
    Target,
    Clock,
    Brain,
    Rocket
} from "lucide-react";
import { toast } from "react-hot-toast";
import { logActivity } from "../../services/activityService";

export default function QuickQuiz() {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15);
    const [answers, setAnswers] = useState([]);

    // Quiz questions (can be fetched from backend)
    const quizQuestions = [
        {
            question: "What is the best way to save money?",
            options: [
                "Spend first, save what's left",
                "Save first, spend what's left",
                "Don't save at all",
                "Save only on special occasions"
            ],
            correctAnswer: 1,
            explanation: "Always pay yourself first by saving before spending!",
            icon: "💰"
        },
        {
            question: "What does 'budget' mean?",
            options: [
                "A plan for spending and saving money",
                "A type of bank account",
                "Money you owe to others",
                "A shopping list"
            ],
            correctAnswer: 0,
            explanation: "A budget is a plan that helps you manage your income and expenses.",
            icon: "📊"
        },
        {
            question: "Which is a 'need' rather than a 'want'?",
            options: [
                "Video games",
                "Designer clothes",
                "Healthy food",
                "Latest smartphone"
            ],
            correctAnswer: 2,
            explanation: "Needs are essentials for survival like food, water, and shelter.",
            icon: "🍎"
        },
        {
            question: "What is compound interest?",
            options: [
                "Interest on borrowed money",
                "Interest earned on interest",
                "Simple addition of money",
                "Bank fees"
            ],
            correctAnswer: 1,
            explanation: "Compound interest is when you earn interest on both your initial deposit and previously earned interest!",
            icon: "📈"
        },
        {
            question: "What's the 50/30/20 budgeting rule?",
            options: [
                "50% needs, 30% wants, 20% savings",
                "50% savings, 30% needs, 20% wants",
                "50% wants, 30% savings, 20% needs",
                "Equal split for everything"
            ],
            correctAnswer: 0,
            explanation: "The 50/30/20 rule suggests 50% for needs, 30% for wants, and 20% for savings!",
            icon: "🎯"
        }
    ];

    const totalQuestions = quizQuestions.length;

    // Timer countdown
    useEffect(() => {
        if (quizCompleted || showResult) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleNextQuestion();
                    return 15;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestion, quizCompleted, showResult]);

    // Reset timer when moving to next question
    useEffect(() => {
        setTimeLeft(15);
    }, [currentQuestion]);

    const handleAnswerSelect = (index) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(index);
        const isCorrect = index === quizQuestions[currentQuestion].correctAnswer;
        
        setAnswers([...answers, {
            questionIndex: currentQuestion,
            selectedAnswer: index,
            isCorrect
        }]);

        if (isCorrect) {
            setScore(score + 1);
            toast.success("Correct! 🎉", { duration: 1500, icon: "✅" });
        } else {
            toast.error("Oops! Try again next time", { duration: 1500, icon: "❌" });
        }

        setShowResult(true);

        // Log activity
        logActivity({
            activityType: "quiz_completed",
            description: `Answered question ${currentQuestion + 1}: ${isCorrect ? 'Correct' : 'Incorrect'}`,
            metadata: {
                questionIndex: currentQuestion,
                isCorrect,
                timestamp: new Date().toISOString()
            },
            pageUrl: window.location.pathname
        });
    };

    const handleNextQuestion = () => {
        setShowResult(false);
        setSelectedAnswer(null);

        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setQuizCompleted(true);
            
            // Log quiz completion
            logActivity({
                activityType: "quiz_completed",
                description: `Completed Quick Quiz - Score: ${score}/${totalQuestions}`,
                metadata: {
                    score,
                    totalQuestions,
                    percentage: Math.round((score / totalQuestions) * 100),
                    timestamp: new Date().toISOString()
                },
                pageUrl: window.location.pathname
            });
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setQuizCompleted(false);
        setTimeLeft(15);
        setAnswers([]);
    };

    const getScoreColor = () => {
        const percentage = (score / totalQuestions) * 100;
        if (percentage >= 80) return "from-green-400 to-emerald-500";
        if (percentage >= 60) return "from-yellow-400 to-amber-500";
        return "from-orange-400 to-red-500";
    };

    const question = quizQuestions[currentQuestion];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-20 blur-3xl"
                    animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full opacity-20 blur-3xl"
                    animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <motion.button
                        onClick={() => navigate('/student/dashboard')}
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="mb-6 inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-indigo-600" />
                        <span className="font-bold text-gray-800">Back to Dashboard</span>
                    </motion.button>

                    <div className="text-center">
                        <motion.h1
                            className="text-4xl sm:text-5xl font-black mb-3 flex items-center justify-center gap-3"
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Brain className="w-12 h-12 text-purple-600" />
                            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                                Quick Quiz
                            </span>
                            <Sparkles className="w-10 h-10 text-yellow-500" />
                        </motion.h1>
                        <p className="text-lg text-gray-600 font-medium">Test your financial knowledge!</p>
                    </div>
                </motion.div>

                {!quizCompleted ? (
                    <>
                        {/* Progress Bar */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            className="mb-8 bg-white rounded-2xl p-4 shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-gray-700">
                                    Question {currentQuestion + 1} of {totalQuestions}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-orange-500" />
                                    <span className={`font-bold ${timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                                        {timeLeft}s
                                    </span>
                                </div>
                            </div>
                            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </motion.div>

                        {/* Question Card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion}
                                initial={{ opacity: 0, x: 100, rotateY: 90 }}
                                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                exit={{ opacity: 0, x: -100, rotateY: -90 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white rounded-3xl p-8 shadow-2xl mb-6"
                            >
                                {/* Question Icon */}
                                <motion.div
                                    className="text-center mb-6"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <span className="text-7xl">{question.icon}</span>
                                </motion.div>

                                {/* Question Text */}
                                <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
                                    {question.question}
                                </h2>

                                {/* Answer Options */}
                                <div className="space-y-4">
                                    {question.options.map((option, index) => {
                                        const isSelected = selectedAnswer === index;
                                        const isCorrect = index === question.correctAnswer;
                                        const showCorrect = showResult && isCorrect;
                                        const showWrong = showResult && isSelected && !isCorrect;

                                        const colors = [
                                            'from-purple-400 to-pink-400',
                                            'from-blue-400 to-cyan-400',
                                            'from-green-400 to-emerald-400',
                                            'from-orange-400 to-red-400'
                                        ];

                                        return (
                                            <motion.button
                                                key={index}
                                                onClick={() => handleAnswerSelect(index)}
                                                disabled={selectedAnswer !== null}
                                                whileHover={selectedAnswer === null ? { scale: 1.03, x: 5 } : {}}
                                                whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                                                className={`w-full p-5 rounded-2xl font-semibold text-left transition-all duration-300 relative overflow-hidden ${
                                                    showCorrect
                                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                                                        : showWrong
                                                        ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-lg'
                                                        : isSelected
                                                        ? `bg-gradient-to-r ${colors[index % colors.length]} text-white shadow-lg`
                                                        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:shadow-lg'
                                                }`}
                                            >
                                                {/* Animated background on hover */}
                                                {selectedAnswer === null && (
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                                                        initial={{ x: '-100%' }}
                                                        whileHover={{ x: '100%' }}
                                                        transition={{ duration: 0.6 }}
                                                    />
                                                )}

                                                <div className="flex items-center justify-between relative z-10">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                                            showCorrect || showWrong ? 'bg-white/20' : 'bg-white/50'
                                                        }`}>
                                                            {String.fromCharCode(65 + index)}
                                                        </div>
                                                        <span>{option}</span>
                                                    </div>
                                                    {showCorrect && <Check className="w-6 h-6" />}
                                                    {showWrong && <X className="w-6 h-6" />}
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Explanation */}
                                <AnimatePresence>
                                    {showResult && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200"
                                        >
                                            <div className="flex items-start gap-3">
                                                <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                                <div>
                                                    <h4 className="font-bold text-gray-800 mb-1">Did you know?</h4>
                                                    <p className="text-sm text-gray-600">{question.explanation}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </AnimatePresence>

                        {/* Next Button */}
                        {showResult && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNextQuestion}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                            >
                                {currentQuestion < totalQuestions - 1 ? (
                                    <>Next Question →</>
                                ) : (
                                    <>See Results 🎉</>
                                )}
                            </motion.button>
                        )}

                        {/* Score Display */}
                        <motion.div
                            className="mt-6 text-center"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
                                <Star className="w-5 h-5 text-yellow-500" />
                                <span className="font-bold text-gray-800">
                                    Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
                                </span>
                            </div>
                        </motion.div>
                    </>
                ) : (
                    /* Results Screen */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="text-center"
                    >
                        {/* Celebration Animation */}
                        <motion.div
                            className="mb-8"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="text-9xl">
                                {score === totalQuestions ? '🏆' : score >= totalQuestions * 0.6 ? '🎉' : '💪'}
                            </span>
                        </motion.div>

                        {/* Results Card */}
                        <motion.div
                            className={`bg-gradient-to-br ${getScoreColor()} rounded-3xl p-10 shadow-2xl mb-6 text-white`}
                            whileHover={{ scale: 1.02 }}
                        >
                            <h2 className="text-4xl font-black mb-4">
                                {score === totalQuestions 
                                    ? 'Perfect Score!' 
                                    : score >= totalQuestions * 0.6 
                                    ? 'Great Job!' 
                                    : 'Keep Learning!'}
                            </h2>
                            <div className="text-7xl font-black mb-4">
                                {score}/{totalQuestions}
                            </div>
                            <p className="text-2xl font-bold mb-6">
                                {Math.round((score / totalQuestions) * 100)}% Correct
                            </p>

                            <p className="text-lg text-white/90 mb-4">
                                {score === totalQuestions 
                                    ? "Outstanding! You're a financial genius! 🌟" 
                                    : score >= totalQuestions * 0.6 
                                    ? "Well done! Keep up the great work! 💪" 
                                    : "Practice makes perfect! Keep learning! 📚"}
                            </p>
                        </motion.div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={restartQuiz}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                            >
                                <Rocket className="w-6 h-6" />
                                Try Again
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/student/dashboard')}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                            >
                                <Target className="w-6 h-6" />
                                Back to Dashboard
                            </motion.button>
                        </div>

                        {/* Review Answers */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 bg-white rounded-3xl p-6 shadow-xl"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Review Your Answers</h3>
                            <div className="space-y-3">
                                {quizQuestions.map((q, qIndex) => {
                                    const userAnswer = answers.find(a => a.questionIndex === qIndex);
                                    return (
                                        <div
                                            key={qIndex}
                                            className={`p-4 rounded-xl ${
                                                userAnswer?.isCorrect 
                                                    ? 'bg-green-50 border-2 border-green-300' 
                                                    : 'bg-red-50 border-2 border-red-300'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">{q.icon}</span>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800 mb-1">{q.question}</p>
                                                    <p className={`text-sm ${userAnswer?.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                        Your answer: {q.options[userAnswer?.selectedAnswer]} 
                                                        {userAnswer?.isCorrect ? ' ✓' : ' ✗'}
                                                    </p>
                                                    {!userAnswer?.isCorrect && (
                                                        <p className="text-sm text-green-600 mt-1">
                                                            Correct: {q.options[q.correctAnswer]} ✓
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// Missing import
const Lightbulb = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
        <path d="M9 18h6"/>
        <path d="M10 22h4"/>
    </svg>
);

