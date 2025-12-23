import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GroupChatSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-84");
  const gameId = gameData?.id || "dcos-teen-84";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Group mocks classmate's religion. What should you do?",
      options: [
        { 
          id: "join", 
          text: "Join in the mocking", 
          emoji: "😞", 
          description: "Participate in the mocking",
          isCorrect: false
        },
        
        { 
          id: "exit", 
          text: "Exit the group chat", 
          emoji: "🚪", 
          description: "Leave the group",
          isCorrect: false
        },
        { 
          id: "defend", 
          text: "Defend the classmate", 
          emoji: "🛡️", 
          description: "Stand up and defend them",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "Someone posts hateful comments about a religion. What's your response?",
      options: [
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "😐", 
          description: "Don't respond",
          isCorrect: false
        },
        { 
          id: "defend-religion", 
          text: "Defend and report", 
          emoji: "🛡️", 
          description: "Stand up and report hate",
          isCorrect: true
        },
        { 
          id: "leave-chat", 
          text: "Leave the chat", 
          emoji: "🚪", 
          description: "Exit the group",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Group makes fun of someone's beliefs. What do you do?",
      options: [
         { 
          id: "stand-up", 
          text: "Stand up for them", 
          emoji: "🛡️", 
          description: "Defend the person",
          isCorrect: true
        },
        { 
          id: "stay-silent", 
          text: "Stay silent", 
          emoji: "😶", 
          description: "Don't say anything",
          isCorrect: false
        },
       
        { 
          id: "exit-group", 
          text: "Exit the group", 
          emoji: "🚪", 
          description: "Leave the group chat",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Religious discrimination happens in group chat. What's the right action?",
      options: [
        { 
          id: "watch", 
          text: "Just watch", 
          emoji: "👀", 
          description: "Observe without acting",
          isCorrect: false
        },
        { 
          id: "defend-discrimination", 
          text: "Defend and report discrimination", 
          emoji: "🛡️", 
          description: "Stand up and report",
          isCorrect: true
        },
        { 
          id: "leave-discrimination", 
          text: "Leave the group", 
          emoji: "🚪", 
          description: "Exit the chat",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Hateful messages target someone's religion. What should you do?",
      options: [
        { 
          id: "do-nothing", 
          text: "Do nothing", 
          emoji: "😐", 
          description: "Take no action",
          isCorrect: false
        },
       
        { 
          id: "exit-hate", 
          text: "Exit the group chat", 
          emoji: "🚪", 
          description: "Leave the group",
          isCorrect: false
        },
         { 
          id: "defend-hate", 
          text: "Defend them and report", 
          emoji: "🛡️", 
          description: "Stand up and report hate",
          isCorrect: true
        },
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
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

  return (
    <GameShell
      title="Group Chat Simulation"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-3xl mb-3">{option.emoji}</div>
                      <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                      <p className="text-white/90 text-sm">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct!
                  You understand how to respond to hate and discrimination!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Always defend those being targeted by hate and discrimination. Stand up, report it, or exit toxic group chats!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember to defend others and stand against hate!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: The right choices are to defend those being targeted, report hate, or exit toxic group chats!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GroupChatSimulation;
