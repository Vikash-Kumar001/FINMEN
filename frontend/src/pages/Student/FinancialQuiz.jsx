import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, HelpCircle, Award, RefreshCw, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logActivity } from '../../services/activityService';
import { saveQuizResults } from '../../services/studentService';

const FinancialQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timer, setTimer] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const quizQuestions = [
    {
      question: "What is compound interest?",
      options: [
        "Interest calculated only on the initial principal",
        "Interest calculated on the initial principal and accumulated interest",
        "A fixed interest rate that never changes",
        "Interest that compounds once at maturity"
      ],
      correctAnswer: 1,
      explanation: "Compound interest is calculated on both the initial principal and the accumulated interest from previous periods, making your money grow faster over time."
    },
    {
      question: "Which of the following is generally considered the most liquid asset?",
      options: [
        "Real estate",
        "Stocks",
        "Cash in a savings account",
        "Collectibles"
      ],
      correctAnswer: 2,
      explanation: "Cash in a savings account is the most liquid asset because it can be accessed and used immediately without having to sell or convert it."
    },
    {
      question: "What is diversification in investing?",
      options: [
        "Putting all your money in one promising investment",
        "Spreading investments across various assets to reduce risk",
        "Investing only in high-risk stocks for maximum returns",
        "Changing your investment strategy every month"
      ],
      correctAnswer: 1,
      explanation: "Diversification means spreading your investments across different asset classes to reduce risk. If one investment performs poorly, others might perform well, helping to minimize overall losses."
    },
    {
      question: "What is a credit score primarily used for?",
      options: [
        "To determine your net worth",
        "To evaluate your job performance",
        "To assess your creditworthiness for loans and credit cards",
        "To calculate your tax liability"
      ],
      correctAnswer: 2,
      explanation: "A credit score is a numerical representation of your creditworthiness, used by lenders to evaluate the risk of lending you money or extending credit."
    },
    {
      question: "Which of the following is NOT typically a fixed expense in a budget?",
      options: [
        "Mortgage or rent payment",
        "Car insurance premium",
        "Grocery expenses",
        "Internet bill"
      ],
      correctAnswer: 2,
      explanation: "Grocery expenses are typically variable expenses because the amount spent can change from month to month based on your needs and choices, unlike fixed expenses like rent or insurance premiums."
    },
    {
      question: "What is the purpose of an emergency fund?",
      options: [
        "To save for retirement",
        "To cover unexpected expenses or financial emergencies",
        "To invest in the stock market",
        "To pay for regular monthly bills"
      ],
      correctAnswer: 1,
      explanation: "An emergency fund is money set aside specifically to cover unexpected expenses or financial emergencies, such as medical bills, car repairs, or job loss."
    },
    {
      question: "What is a 401(k)?",
      options: [
        "A type of health insurance plan",
        "A tax credit for first-time homebuyers",
        "A retirement savings plan sponsored by an employer",
        "A government loan program for small businesses"
      ],
      correctAnswer: 2,
      explanation: "A 401(k) is a retirement savings plan sponsored by an employer that allows workers to save and invest a portion of their paycheck before taxes are taken out."
    },
    {
      question: "What does 'APR' stand for in financial terms?",
      options: [
        "Annual Percentage Rate",
        "Approved Payment Return",
        "Asset Protection Reserve",
        "Average Price Reduction"
      ],
      correctAnswer: 0,
      explanation: "APR stands for Annual Percentage Rate, which is the yearly interest rate charged for a loan or earned on an investment, including fees and costs."
    },
    {
      question: "Which of the following is generally considered a good debt?",
      options: [
        "Credit card debt for vacation expenses",
        "Payday loans",
        "Student loans for education",
        "High-interest personal loans for luxury items"
      ],
      correctAnswer: 2,
      explanation: "Student loans are often considered 'good debt' because they are an investment in education that can increase your earning potential and typically have lower interest rates."
    },
    {
      question: "What is the rule of 72 in finance?",
      options: [
        "A law requiring 72 months of credit history to qualify for a mortgage",
        "A formula to estimate how long it takes for an investment to double at a fixed interest rate",
        "A requirement to pay off 72% of debt before applying for new credit",
        "A tax rule allowing deduction of 72% of investment losses"
      ],
      correctAnswer: 1,
      explanation: "The Rule of 72 is a simple formula to estimate how long it will take for an investment to double at a fixed annual rate of return. You divide 72 by the annual rate of return to get the approximate number of years."
    }
  ];

  const startQuiz = () => {
    setQuizStarted(true);
    startTimer();
    
    // Log quiz started activity
    logActivity({
      activityType: "learning_activity",
      description: "Started financial quiz",
      metadata: {
        action: "start_quiz",
        totalQuestions: quizQuestions.length
      }
    });
  };

  const startTimer = () => {
    clearInterval(timer);
    setTimeLeft(30);
    const newTimer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(newTimer);
          if (!showExplanation && !quizCompleted) {
            handleAnswerSelection(null);
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setTimer(newTimer);
  };

  useEffect(() => {
    // Log page view when component mounts
    logActivity({
      activityType: "page_view",
      description: "Viewed financial quiz page"
    });
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const handleAnswerSelection = (answerIndex) => {
    clearInterval(timer);
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Log answer selection activity
    logActivity({
      activityType: "learning_activity",
      description: `Answered question ${currentQuestionIndex + 1}`,
      metadata: {
        action: "answer_question",
        questionIndex: currentQuestionIndex + 1,
        questionText: currentQuestion.question,
        selectedAnswer: currentQuestion.options[answerIndex] || "Timed out",
        correctAnswer: currentQuestion.options[currentQuestion.correctAnswer],
        isCorrect: isCorrect,
        timeRemaining: timeLeft
      }
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      startTimer();
    } else {
      setQuizCompleted(true);
      clearInterval(timer);
      
      // Calculate percentage score
      const percentage = (score / quizQuestions.length) * 100;
      
      // Save quiz results to backend
      const quizData = {
        score: score,
        totalQuestions: quizQuestions.length,
        percentage: percentage,
        completedAt: new Date().toISOString()
      };
      
      saveQuizResults(quizData).catch(err => console.error("Failed to save quiz results:", err));
      
      // Log quiz completion activity
      logActivity({
        activityType: "learning_activity",
        description: "Completed financial quiz",
        metadata: {
          action: "complete_quiz",
          score: score,
          totalQuestions: quizQuestions.length,
          percentage: percentage,
          performanceLevel: getScoreMessage()
        }
      });
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowExplanation(false);
    setQuizCompleted(false);
    startTimer();
    
    // Log quiz restart activity
    logActivity({
      activityType: "learning_activity",
      description: "Restarted financial quiz",
      metadata: {
        action: "restart_quiz",
        previousScore: score,
        totalQuestions: quizQuestions.length
      }
    });
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 90) return "Excellent! You're a financial expert!";
    if (percentage >= 70) return "Great job! You have solid financial knowledge.";
    if (percentage >= 50) return "Good effort! You're on your way to financial literacy.";
    return "Keep learning! Financial literacy is a journey.";
  };

  const getScoreColor = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button 
            onClick={() => navigate('/student/dashboard')} 
            className="flex items-center text-red-600 hover:text-red-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Financial Quiz</h1>
          <p className="text-lg text-gray-600">Test your financial knowledge</p>
        </motion.div>

        {/* Quiz Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {!quizStarted ? (
            <div className="p-8 text-center">
              <HelpCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Ready to Test Your Financial Knowledge?</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                This quiz contains {quizQuestions.length} questions about personal finance and money management. You'll have 30 seconds to answer each question.
              </p>
              <button
                onClick={startQuiz}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center"
              >
                Start Quiz
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          ) : quizCompleted ? (
            <div className="p-8">
              <div className="text-center mb-8">
                <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
                <p className={`text-3xl font-bold ${getScoreColor()}`}>
                  {score} / {quizQuestions.length}
                </p>
                <p className="text-gray-600 mt-2">{getScoreMessage()}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Question Summary</h3>
                <div className="space-y-3">
                  {quizQuestions.map((q, index) => (
                    <div key={index} className="flex items-start">
                      {index < currentQuestionIndex || (index === currentQuestionIndex && selectedAnswer === q.correctAnswer) ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">Question {index + 1}</p>
                        <p className="text-sm text-gray-600">{q.question}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => navigate('/student/dashboard')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={restartQuiz}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Restart Quiz
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Progress Bar */}
              <div className="bg-gray-100 h-2">
                <div 
                  className="bg-red-600 h-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="p-8">
                {/* Question Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
                    <p className="text-sm font-medium text-red-600">Score: {score}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                    {timeLeft} seconds
                  </div>
                </div>
                
                {/* Question */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-2">{quizQuestions[currentQuestionIndex].question}</h2>
                </div>
                
                {/* Answer Options */}
                <div className="space-y-3 mb-8">
                  {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => !showExplanation && handleAnswerSelection(index)}
                      disabled={showExplanation}
                      className={`w-full p-4 rounded-lg text-left transition-all ${showExplanation ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'} 
                        ${showExplanation && index === quizQuestions[currentQuestionIndex].correctAnswer ? 'bg-green-100 border border-green-300' : ''}
                        ${showExplanation && selectedAnswer === index && index !== quizQuestions[currentQuestionIndex].correctAnswer ? 'bg-red-100 border border-red-300' : ''}
                        ${!showExplanation && selectedAnswer === index ? 'bg-blue-50 border border-blue-300' : 'border border-gray-200'}
                      `}
                    >
                      <div className="flex items-start">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${showExplanation && index === quizQuestions[currentQuestionIndex].correctAnswer ? 'bg-green-500 text-white' : showExplanation && selectedAnswer === index && index !== quizQuestions[currentQuestionIndex].correctAnswer ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
                    >
                      <h3 className="font-bold text-blue-800 mb-2">Explanation:</h3>
                      <p className="text-blue-900">{quizQuestions[currentQuestionIndex].explanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Next Button */}
                {showExplanation && (
                  <div className="flex justify-end">
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={goToNextQuestion}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium flex items-center"
                    >
                      {currentQuestionIndex < quizQuestions.length - 1 ? (
                        <>
                          Next Question
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </>
                      ) : (
                        'Complete Quiz'
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialQuiz;