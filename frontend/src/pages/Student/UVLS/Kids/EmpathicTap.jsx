import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EmpathicTap = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-69";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedStatements, setSelectedStatements] = useState([]);

  const questions = [
    {
      id: 1,
      text: "Tap all the validating statements:",
      statements: [
        { text: "I understand.", isValidating: true },
        { text: "Stop crying!", isValidating: false },
        { text: "That sounds hard.", isValidating: true }
      ]
    },
    {
      id: 2,
      text: "Tap all the validating statements:",
      statements: [
        { text: "I'm here for you.", isValidating: true },
        { text: "Get over it.", isValidating: false },
        { text: "I feel the same.", isValidating: true }
      ]
    },
    {
      id: 3,
      text: "Tap all the validating statements:",
      statements: [
        { text: "You're right to feel that.", isValidating: true },
        { text: "Wrong feeling.", isValidating: false },
        { text: "Tell me more.", isValidating: true }
      ]
    },
    {
      id: 4,
      text: "Tap all the validating statements:",
      statements: [
        { text: "That's tough.", isValidating: true },
        { text: "Not my problem.", isValidating: false },
        { text: "I care.", isValidating: true }
      ]
    },
    {
      id: 5,
      text: "Tap all the validating statements:",
      statements: [
        { text: "You're not alone.", isValidating: true },
        { text: "Go away.", isValidating: false },
        { text: "Let's talk.", isValidating: true }
      ]
    }
  ];

  const toggleStatementSelection = (index) => {
    setSelectedStatements(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSubmit = () => {
    const correctValid = questions[currentQuestion].statements.filter(s => s.isValidating).length;
    const selectedValid = selectedStatements.filter(idx => questions[currentQuestion].statements[idx].isValidating).length;
    const isCorrect = selectedStatements.length === correctValid && selectedValid === correctValid;
    
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
        setSelectedStatements([]);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedStatements([]);
    resetFeedback();
  };

  return (
    <GameShell
      title="Empathic Tap"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="uvls"
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].statements.map((stmt, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => toggleStatementSelection(idx)}
                    className={`w-full p-4 rounded-xl transition-all transform hover:scale-102 flex items-center gap-3 ${
                      selectedStatements.includes(idx)
                        ? "bg-green-500/30 border-2 border-green-400"
                        : "bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40"
                    }`}
                  >
                    <div className="text-2xl">
                      {selectedStatements.includes(idx) ? "✅" : "💬"}
                    </div>
                    <div className="text-white font-medium text-left flex-1">{stmt.text}</div>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={handleSubmit} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedStatements.length === 0}
              >
                Submit ({selectedStatements.length} selected)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Empath Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to validate others' feelings!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Validating statements like "I understand", "That sounds hard", "I'm here for you", and "Tell me more" show empathy and make others feel heard and supported. Avoid dismissive statements like "Get over it" or "Stop crying" - they make people feel worse!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Validate others' feelings!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Validating statements show you understand and care. Use phrases like "I understand", "That sounds hard", "I'm here for you", and "Tell me more" to show empathy!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmpathicTap;
