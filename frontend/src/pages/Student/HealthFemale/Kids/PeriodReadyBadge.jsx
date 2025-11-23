import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeriodReadyBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: false, message: "" });
  const [gameFinished, setGameFinished] = useState(false);
  const { showAnswerConfetti } = useGameFeedback();

  const tasks = [
    {
      id: 1,
      type: "multipleChoice",
      question: "What is the average length of a menstrual cycle?",
      options: ["28 days", "14 days", "42 days"],
      correctAnswer: "28 days",
      explanation: "Most menstrual cycles last between 21-35 days, with 28 days being the average."
    },
    {
      id: 2,
      type: "dragAndDrop",
      items: [
        { id: "pad", name: "Sanitary Pad", correctZone: "hygiene" },
        { id: "soap", name: "Soap", correctZone: "hygiene" },
        { id: "calendar", name: "Calendar", correctZone: "tracking" }
      ],
      zones: [
        { id: "hygiene", name: "Hygiene Items" },
        { id: "tracking", name: "Tracking Tools" }
      ],
      correctAnswer: 2, // Number of correct matches needed
      explanation: "Pads and soap are hygiene items, while calendars help with tracking."
    },
    {
      id: 3,
      type: "trueFalse",
      question: "It's normal to experience mood changes during periods.",
      correctAnswer: "true",
      explanation: "Hormonal changes during periods can cause mood swings, which is completely normal."
    },
    {
      id: 4,
      type: "fillBlank",
      question: "Pads should be changed every ___ hours.",
      correctAnswer: "4-8",
      explanation: "Pads should be changed every 4-8 hours depending on flow to maintain hygiene."
    },
    {
      id: 5,
      type: "scenario",
      question: "A friend is embarrassed about her period. You should:",
      options: [
        "Mock her for being different",
        "Comfort her and normalize the conversation",
        "Ignore her completely"
      ],
      correctAnswer: "Comfort her and normalize the conversation",
      explanation: "Support and understanding help reduce shame and create a positive environment."
    }
  ];

  const handleMultipleChoice = (selectedOption) => {
    const task = tasks[currentTask];
    const isCorrect = selectedOption === task.correctAnswer;
    
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? "Correct!" : "Not quite right.",
      explanation: task.explanation
    });
    
    setShowFeedback(true);
    
    if (isCorrect && !completedTasks.includes(task.id)) {
      setTimeout(() => {
        setCompletedTasks(prev => [...prev, task.id]);
        moveToNextTask();
      }, 2000);
    } else if (!isCorrect) {
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  const handleTrueFalse = (answer) => {
    const task = tasks[currentTask];
    const isCorrect = answer === task.correctAnswer;
    
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? "Correct!" : "Not quite right.",
      explanation: task.explanation
    });
    
    setShowFeedback(true);
    
    if (isCorrect && !completedTasks.includes(task.id)) {
      setTimeout(() => {
        setCompletedTasks(prev => [...prev, task.id]);
        moveToNextTask();
      }, 2000);
    } else if (!isCorrect) {
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  const handleFillBlank = () => {
    const task = tasks[currentTask];
    const isCorrect = userAnswer.trim().toLowerCase() === task.correctAnswer.toLowerCase();
    
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? "Correct!" : "Not quite right.",
      explanation: task.explanation
    });
    
    setShowFeedback(true);
    
    if (isCorrect && !completedTasks.includes(task.id)) {
      setTimeout(() => {
        setCompletedTasks(prev => [...prev, task.id]);
        moveToNextTask();
      }, 2000);
    } else if (!isCorrect) {
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  const moveToNextTask = () => {
    setShowFeedback(false);
    setUserAnswer("");
    
    if (currentTask < tasks.length - 1) {
      setCurrentTask(prev => prev + 1);
    } else {
      // Check if all tasks are completed
      if (completedTasks.length + 1 === tasks.length) {
        setTimeout(() => {
          setGameFinished(true);
          showAnswerConfetti();
        }, 1000);
      }
    }
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const getCurrentTask = () => tasks[currentTask];

  const renderTask = () => {
    const task = getCurrentTask();
    
    switch (task.type) {
      case "multipleChoice":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">{task.question}</h3>
            <div className="grid grid-cols-1 gap-3">
              {task.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleMultipleChoice(option)}
                  disabled={showFeedback}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 rounded-xl shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-lg mr-3">{String.fromCharCode(65 + index)}.</div>
                    <div>{option}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
        
      case "dragAndDrop":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white text-center">Sort these period items into the correct categories:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-3 text-center">Items</h4>
                <div className="space-y-2">
                  {task.items.map(item => (
                    <div 
                      key={item.id}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-3 rounded-lg text-center"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {task.zones.map(zone => (
                  <div key={zone.id} className="bg-white/10 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3 text-center">{zone.name}</h4>
                    <div className="min-h-[60px] border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
                      <p className="text-white/50 text-sm">Drag items here</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center text-white/80 text-sm">
              <p>This is a demonstration. In a real game, you would drag items to the correct zones.</p>
              <button
                onClick={() => handleMultipleChoice("Correct")}
                className="mt-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                Simulate Correct Answer
              </button>
            </div>
          </div>
        );
        
      case "trueFalse":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">{task.question}</h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleTrueFalse("true")}
                disabled={showFeedback}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg transition-all transform hover:scale-105"
              >
                True
              </button>
              <button
                onClick={() => handleTrueFalse("false")}
                disabled={showFeedback}
                className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg transition-all transform hover:scale-105"
              >
                False
              </button>
            </div>
          </div>
        );
        
      case "fillBlank":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">{task.question}</h3>
            <div className="flex justify-center">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showFeedback}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-lg w-32 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter answer"
              />
            </div>
            <div className="text-center">
              <button
                onClick={handleFillBlank}
                disabled={showFeedback || userAnswer.trim() === ""}
                className={`px-6 py-3 rounded-xl font-bold text-white transition-all ${
                  userAnswer.trim() !== ""
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105'
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            </div>
          </div>
        );
        
      case "scenario":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">{task.question}</h3>
            <div className="grid grid-cols-1 gap-3">
              {task.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleMultipleChoice(option)}
                  disabled={showFeedback}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 rounded-xl shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-lg mr-3">{String.fromCharCode(65 + index)}.</div>
                    <div>{option}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (gameFinished) {
    return (
      <GameShell
        title="Badge: Period Ready Kid"
        subtitle="Congratulations!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        gameId="health-female-kids-40"
        gameType="health-female"
        totalLevels={40}
        currentLevel={40}
        showConfetti={true}
        backPath="/games/health-female/kids"
      
      maxScore={40} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🏅</div>
          <h2 className="text-2xl font-bold mb-4">Period Ready Kid</h2>
          <p className="text-white/80 mb-6">
            You've completed all period awareness challenges!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-8">
            You've earned your Period Ready Kid Badge!
          </div>
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-colors"
          >
            Continue Learning
          </button>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Badge: Period Ready Kid"
      subtitle={`Task ${currentTask + 1} of ${tasks.length} | Completed: ${completedTasks.length}/${tasks.length}`}
      backPath="/games/health-female/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80">Progress</span>
              <span className="text-yellow-400 font-bold">{completedTasks.length}/{tasks.length} tasks</span>
            </div>
            <div className="bg-white/10 rounded-full h-3 w-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 rounded-full"
                style={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {renderTask()}

          {showFeedback && (
            <div className={`p-4 rounded-xl mt-6 ${
              feedback.correct 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <p className={`text-lg font-semibold ${feedback.correct ? 'text-green-300' : 'text-red-300'}`}>
                {feedback.message}
              </p>
              <p className="text-white/90 mt-2">{feedback.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default PeriodReadyBadge;