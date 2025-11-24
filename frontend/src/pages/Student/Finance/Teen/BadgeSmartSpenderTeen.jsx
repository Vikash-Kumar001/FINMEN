import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../GameShell';
import { useGameFeedback } from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const BadgeSmartSpenderTeen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-20";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [gameCompleted, setGameCompleted] = useState(false);
  const [answers, setAnswers] = useState(Array(10).fill(null));

  // Interactive quiz questions about financial literacy
  const questions = [
    {
      id: 1,
      question: "What's the best approach when you want to buy an expensive item?",
      options: [
        "Buy it immediately if you have enough money",
        "Wait and save money over time while considering if you really need it",
        "Ask friends to lend you money",
        "Buy it on credit even if you can't afford it"
      ],
      correct: 1,
      explanation: "Waiting and saving helps you make thoughtful decisions and avoid impulse purchases."
    },
    {
      id: 2,
      question: "Which of these is a 'need' rather than a 'want'?",
      options: [
        "Latest smartphone",
        "Designer clothes",
        "Groceries for your family",
        "Video game console"
      ],
      correct: 2,
      explanation: "Groceries are essential for survival, making them a need rather than a want."
    },
    {
      id: 3,
      question: "What should you do with unexpected money like a gift or bonus?",
      options: [
        "Spend it all on something fun immediately",
        "Save at least half and spend the rest thoughtfully",
        "Ignore it and pretend you never received it",
        "Use it to pay off all your friends' debts"
      ],
      correct: 1,
      explanation: "Balancing saving and spending helps build healthy financial habits."
    },
    {
      id: 4,
      question: "What's the benefit of comparing prices before making a purchase?",
      options: [
        "It wastes time and prevents spontaneous decisions",
        "It helps you find the best value and save money",
        "It makes shopping more complicated",
        "It's only useful for expensive items"
      ],
      correct: 1,
      explanation: "Price comparison helps you make informed decisions and stretch your budget further."
    },
    {
      id: 5,
      question: "What's a good strategy for managing a limited entertainment budget?",
      options: [
        "Spend it all in one day to maximize enjoyment",
        "Plan affordable activities and look for free options",
        "Borrow money to increase your entertainment budget",
        "Avoid all entertainment to save money"
      ],
      correct: 1,
      explanation: "Planning helps you enjoy entertainment while staying within your means."
    },
    {
      id: 6,
      question: "Why is it important to track your spending?",
      options: [
        "To find excuses for all your purchases",
        "To understand where your money goes and identify areas for improvement",
        "To make you feel guilty about spending",
        "To impress friends with detailed records"
      ],
      correct: 1,
      explanation: "Spending tracking provides insights that help you make better financial decisions."
    },
    {
      id: 7,
      question: "What should you do when you see a 'limited time offer'?",
      options: [
        "Buy immediately to avoid missing out",
        "Check if you need the item and if it fits your budget",
        "Ignore all sales and never buy discounted items",
        "Buy multiple items to maximize the deal"
      ],
      correct: 1,
      explanation: "Evaluating offers helps you avoid impulsive purchases and unnecessary spending."
    },
    {
      id: 8,
      question: "How can peer pressure affect your spending habits?",
      options: [
        "It always leads to better financial decisions",
        "It can cause you to spend money on things you don't need",
        "It has no effect on financial decisions",
        "It only affects spending on essential items"
      ],
      correct: 1,
      explanation: "Peer pressure can lead to unnecessary spending to fit in or impress others."
    },
    {
      id: 9,
      question: "What's the benefit of setting financial goals?",
      options: [
        "It makes you feel bad when you don't achieve them",
        "It provides direction and motivation for saving and spending decisions",
        "It prevents you from enjoying money in the present",
        "It's only useful for long-term planning"
      ],
      correct: 1,
      explanation: "Financial goals help you make purposeful decisions about money."
    },
    {
      id: 10,
      question: "What's a good approach to handling emotional spending?",
      options: [
        "Buy whatever makes you feel better immediately",
        "Find alternative ways to cope with emotions that don't involve spending",
        "Hide purchases from family and friends",
        "Spend money only when you're feeling happy"
      ],
      correct: 1,
      explanation: "Finding non-financial ways to manage emotions prevents using money as a coping mechanism."
    }
  ];

  const handleAnswerSelect = (answerIndex) => {
    if (showFeedback) return; // Prevent changing answer after feedback is shown
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === questions[currentQuestion].correct;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 10);
      showCorrectAnswerFeedback(10, true);
      setFeedbackMessage("Correct! Great financial thinking!");
    } else {
      setFeedbackMessage("Not quite right. Keep learning!");
    }
    
    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    
    setShowFeedback(true);
    
    // Move to next question or complete game
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setGameCompleted(true);
      }
    }, 2000);
  };

  const calculateProgress = () => {
    return Math.round(((currentQuestion + 1) / questions.length) * 100);
  };

  const handleGameComplete = () => {
    navigate('/games/financial-literacy/teen');
  };

  return (
    <GameShell
      gameId="finance-teens-20"
      gameType="badge"
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={currentQuestion + 1}
      score={score}
      totalScore={questions.length * 10}
      onGameComplete={handleGameComplete}
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="game-content">
        <h3 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Smart Spender Challenge</h3>
        
        {!gameCompleted ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-bold text-indigo-700">Score: {score}</div>
              <div className="text-lg font-bold text-gray-700">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className="text-lg font-bold text-green-600">
                {calculateProgress()}% Complete
              </div>
            </div>
            
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">
                {questions[currentQuestion].question}
              </h4>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-lg transition duration-200 border ${
                      selectedAnswer === index
                        ? (showFeedback 
                            ? (index === questions[currentQuestion].correct
                                ? 'bg-green-100 border-green-300'
                                : 'bg-red-100 border-red-300')
                            : 'bg-indigo-100 border-indigo-300')
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center ${
                        selectedAnswer === index
                          ? (showFeedback 
                              ? (index === questions[currentQuestion].correct
                                  ? 'bg-green-500 border-green-500'
                                  : 'bg-red-500 border-red-500')
                              : 'bg-indigo-500 border-indigo-500')
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswer === index && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-800">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {showFeedback && (
              <div className={`p-4 rounded-lg mb-6 ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <p className="font-medium text-lg">{feedbackMessage}</p>
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Explanation:</span> {questions[currentQuestion].explanation}
                </p>
              </div>
            )}
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <span className="font-semibold">Tip:</span> Think carefully about each choice. 
                Smart spending means distinguishing between needs and wants, and making decisions 
                that support your financial goals.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-block p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h4>
              <p className="text-gray-600 text-lg mb-4">
                You've earned the Smart Spender Teen badge!
              </p>
              <div className="bg-indigo-50 rounded-lg p-6 inline-block mb-6">
                <p className="text-3xl font-bold text-indigo-700">Final Score: {score}/{questions.length * 10}</p>
                <p className="text-indigo-600 mt-2">
                  {score >= questions.length * 7 ? "🏆 Financial Expert!" : 
                   score >= questions.length * 5 ? "👏 Smart Spender!" : 
                   "💪 Keep Learning!"}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-left">
              <h5 className="text-lg font-semibold mb-4 text-gray-800">Skills You've Demonstrated:</h5>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Distinguishing needs from wants</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Making smart purchasing decisions</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Budgeting for short and long-term goals</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Resisting impulsive spending</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={handleGameComplete}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200 transform hover:scale-105"
            >
              Return to Finance Dashboard
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeSmartSpenderTeen;