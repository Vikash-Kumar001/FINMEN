import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard } from '../../Finance/GameShell';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Trophy, Zap, Target, Award, Play, RotateCcw, ChevronRight } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const BadgeFocusHero = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-20";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 5;
  const totalCoins = gameData?.coins || 5;
  const totalXp = gameData?.xp || 10;
  const [showConfetti, setShowConfetti] = useState(true);
  const [completedCriteria, setCompletedCriteria] = useState([]);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [showSkillDetails, setShowSkillDetails] = useState(false);
  const [gameState, setGameState] = useState('celebration'); // celebration, quiz, challenge
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);

  // This badge is awarded for beating distraction challenges
  const badgeCriteria = [
    "Completed Exam Story",
    "Passed Attention Quiz",
    "Demonstrated Concentration Reflex",
    "Solved Distractions Puzzle",
    "Understood Social Media Impact",
    "Participated in Multitask Debate",
    "Documented Attention Strategies in Journal",
    "Chose Optimal Study Environment",
    "Practiced Distraction Alert Reflex"
  ];

  const skillsDeveloped = [
    {
      title: "Improved Concentration",
      description: "Enhanced ability to maintain focus for longer periods",
      icon: <Target className="w-6 h-6" />
    },
    {
      title: "Distraction Resistance",
      description: "Better at ignoring interruptions and staying on task",
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: "Study Strategies",
      description: "Developed effective techniques for learning",
      icon: <Award className="w-6 h-6" />
    },
    {
      title: "Mindfulness",
      description: "Practiced awareness and present-moment focus",
      icon: <Star className="w-6 h-6" />
    },
    {
      title: "Self-Awareness",
      description: "Understand your focus patterns and habits",
      icon: <Trophy className="w-6 h-6" />
    },
    {
      title: "Time Management",
      description: "Learned to allocate time effectively for tasks",
      icon: <Target className="w-6 h-6" />
    }
  ];

  // Quick quiz questions to make it interactive
  const quizQuestions = [
    {
      question: "What's the best strategy to avoid social media distractions while studying?",
      options: [
        "Keep phone in another room",
        "Turn off notifications",
        "Check every 5 minutes",
        "Study with phone nearby"
      ],
      correct: 0
    },
    {
      question: "How long should you focus before taking a break for optimal concentration?",
      options: [
        "10-15 minutes",
        "25-30 minutes",
        "45-60 minutes",
        "90 minutes"
      ],
      correct: 1
    },
    {
      question: "Which environment is best for focused studying?",
      options: [
        "Noisy café",
        "Silent library",
        "Bedroom with music",
        "Living room with TV"
      ],
      correct: 1
    }
  ];

  useEffect(() => {
    // Animate criteria one by one
    const timer = setTimeout(() => {
      if (completedCriteria.length < badgeCriteria.length) {
        setCompletedCriteria(prev => [...prev, badgeCriteria[prev.length]]);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [completedCriteria.length]);

  useEffect(() => {
    // Animate skills
    const skillTimer = setInterval(() => {
      setCurrentSkillIndex(prev => (prev + 1) % skillsDeveloped.length);
    }, 3000);
    
    return () => clearInterval(skillTimer);
  }, []);

  const handleGameComplete = () => {
    // Navigate without triggering game completion submission since this is a badge page
    navigate('/games/brain-health/teens');
  };

  const toggleSkillDetails = () => {
    setShowSkillDetails(!showSkillDetails);
  };

  const startQuickQuiz = () => {
    setGameState('quiz');
    setQuizScore(0);
    setCurrentQuizQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const currentQuestion = quizQuestions[currentQuizQuestion];
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 10);
      setFeedbackType('correct');
    } else {
      setFeedbackType('wrong');
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      
      if (currentQuizQuestion < quizQuestions.length - 1) {
        setCurrentQuizQuestion(prev => prev + 1);
      } else {
        // Quiz completed
        setTimeout(() => {
          setGameState('challenge');
        }, 1000);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setGameState('celebration');
  };

  const renderCelebrationScreen = () => (
    <div className="text-center">
      <motion.h3 
        className="text-2xl font-bold mb-6 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Focus Hero Badge
      </motion.h3>
      
      <div className="mb-8">
        <motion.div 
          className="inline-block p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.2
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {showConfetti && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 1,
                    scale: 1
                  }}
                  animate={{ 
                    x: Math.cos(i * Math.PI / 4) * 100, 
                    y: Math.sin(i * Math.PI / 4) * 100, 
                    opacity: 0,
                    scale: 0
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
        
        <motion.h4 
          className="text-2xl font-bold text-white mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Congratulations, Focus Hero!
        </motion.h4>
        
        <motion.p 
          className="text-white/90 max-w-md mx-auto text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          You've earned the Focus Hero badge for conquering distraction challenges!
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">100</div>
              <div className="text-xs text-white/70">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">9</div>
              <div className="text-xs text-white/70">Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">6</div>
              <div className="text-xs text-white/70">Skills</div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 text-left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <h5 className="text-lg font-semibold mb-4 text-white flex items-center">
          <Check className="w-5 h-5 text-green-400 mr-2" />
          Badge Requirements Completed:
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnimatePresence>
            {completedCriteria.map((criterion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 + 1.3 }}
                className="flex items-start p-3 bg-green-500/10 rounded-lg border border-green-400/20"
              >
                <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white text-sm">{criterion}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        className="bg-blue-500/20 border border-blue-400/30 rounded-2xl p-6 mb-8"
      >
        <div 
          className="cursor-pointer flex items-center justify-between"
          onClick={toggleSkillDetails}
        >
          <h5 className="font-medium text-blue-300 mb-2 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Skills You've Developed:
          </h5>
          <motion.div
            animate={{ rotate: showSkillDetails ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {showSkillDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-4">
                {skillsDeveloped.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start p-3 bg-white/5 rounded-lg"
                  >
                    <div className="text-blue-400 mr-3 mt-0.5">
                      {skill.icon}
                    </div>
                    <div>
                      <p className="text-white font-medium">{skill.title}</p>
                      <p className="text-white/70 text-sm">{skill.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!showSkillDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="mt-4 p-3 bg-white/5 rounded-lg"
          >
            <p className="text-white/80 text-sm flex items-center">
              <span className="bg-blue-500/20 p-1 rounded mr-2">
                <Trophy className="w-4 h-4 text-blue-400" />
              </span>
              Click to see all the skills you've mastered!
            </p>
          </motion.div>
        )}
      </motion.div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <motion.button
          onClick={startQuickQuiz}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-bold hover:opacity-90 transition duration-200 shadow-lg flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-5 h-5 mr-2" />
          Quick Focus Quiz
        </motion.button>
        
        <motion.button
          onClick={handleGameComplete}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold hover:opacity-90 transition duration-200 shadow-lg flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Award className="w-5 h-5 mr-2" />
          Dashboard
        </motion.button>
      </div>
    </div>
  );

  const renderQuizScreen = () => {
    const currentQuestion = quizQuestions[currentQuizQuestion];
    
    return (
      <div className="text-center">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Focus Quiz Challenge</h3>
          <div className="bg-blue-500/20 px-4 py-2 rounded-full">
            <span className="text-white font-bold">Score: {quizScore}</span>
          </div>
        </div>
        
        <div className="mb-2 text-white/70">
          Question {currentQuizQuestion + 1} of {quizQuestions.length}
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%` }}
          ></div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h4 className="text-xl font-bold text-white mb-6">{currentQuestion.question}</h4>
          
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                  selectedAnswer === index 
                    ? 'bg-blue-500 text-white' 
                    : showFeedback && index === currentQuestion.correct
                      ? 'bg-green-500 text-white'
                      : showFeedback && selectedAnswer === index
                        ? 'bg-red-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                disabled={showFeedback}
                whileHover={{ scale: showFeedback ? 1 : 1.02 }}
                whileTap={{ scale: showFeedback ? 1 : 0.98 }}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3">
                    {selectedAnswer === index && !showFeedback && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                    {showFeedback && index === currentQuestion.correct && (
                      <Check className="w-4 h-4" />
                    )}
                    {showFeedback && selectedAnswer === index && selectedAnswer !== currentQuestion.correct && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl mb-6 ${
              feedbackType === 'correct' 
                ? 'bg-green-500/20 border border-green-400/30' 
                : 'bg-red-500/20 border border-red-400/30'
            }`}
          >
            <div className="flex items-center justify-center">
              {feedbackType === 'correct' ? (
                <>
                  <Check className="w-6 h-6 text-green-400 mr-2" />
                  <span className="text-green-400 font-bold">Correct! Great focus skills!</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-400 font-bold">Not quite! The correct answer is highlighted.</span>
                </>
              )}
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-between">
          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-white/20 text-white rounded-full font-bold hover:bg-white/30 transition duration-200 flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Back
          </button>
          
          {!showFeedback ? (
            <button
              onClick={submitAnswer}
              disabled={selectedAnswer === null}
              className={`px-6 py-3 rounded-full font-bold transition duration-200 flex items-center ${
                selectedAnswer !== null
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 shadow-lg'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              Submit Answer
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <div className="w-32"></div> // Spacer to maintain layout
          )}
        </div>
      </div>
    );
  };

  return (
    <GameShell
      title="Focus Hero Badge"
      score={gameState === 'quiz' ? quizScore : 100}
      currentLevel={1}
      totalLevels={1}
      coinsPerLevel={coinsPerLevel}
      gameId={gameId}
      gameType="brain"
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={false}
      backPath="/games/brain-health/teens"
    >
      <GameCard>
        {gameState === 'celebration' && renderCelebrationScreen()}
        {gameState === 'quiz' && renderQuizScreen()}
      </GameCard>
    </GameShell>
  );
};

export default BadgeFocusHero;