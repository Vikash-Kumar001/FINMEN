import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateTooYoungStart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-46";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Can teens run businesses successfully?",
      options: [
        { id: "a", text: "No", correct: false, emoji: "❌" },
        { id: "b", text: "Yes", correct: true, emoji: "✅" },
        { id: "c", text: "Only with adult help", correct: false, emoji: "🧑‍🤝‍🧑" }
      ]
    },
    {
      id: 2,
      text: "What advantage do young entrepreneurs have?",
      options: [
        { id: "a", text: "More experience", correct: false, emoji: "📅" },
        { id: "b", text: "Fresh perspectives and digital fluency", correct: true, emoji: "📱" },
        { id: "c", text: "More capital", correct: false, emoji: "💰" }
      ]
    },
    {
      id: 3,
      text: "Why might age be an advantage in entrepreneurship?",
      options: [
        { id: "a", text: "Less energy", correct: false, emoji: "😴" },
        { id: "b", text: "More willingness to take calculated risks", correct: true, emoji: "🎲" },
        { id: "c", text: "Fewer ideas", correct: false, emoji: "EmptyEntries" }
      ]
    },
    {
      id: 4,
      text: "What challenge do young entrepreneurs face?",
      options: [
        { id: "a", text: "Too much experience", correct: false, emoji: "📚" },
        { id: "b", text: "Limited access to capital", correct: true, emoji: "🔒" },
        { id: "c", text: "Overabundance of resources", correct: false, emoji: " Overflow" }
      ]
    },
    {
      id: 5,
      text: "How can teens overcome entrepreneurial challenges?",
      options: [
        { id: "a", text: "Avoid learning", correct: false, emoji: "❌" },
        { id: "b", text: "Mentorship and skill development", correct: true, emoji: "🎓" },
        { id: "c", text: "Ignore advice", correct: false, emoji: "🙉" }
      ]
    }
  ];

  const handleAnswerSelect = (option) => {
    resetFeedback();
    
    if (option.correct) {
      const newCoins = coins + coinsPerLevel;
      setCoins(newCoins);
      setFinalScore(finalScore + 1);
      showCorrectAnswerFeedback(newCoins);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/ehe/teens");
  };

  return (
    <GameShell
      title="Debate: Too Young to Start?"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId="ehe-teen-46"
      gameType="ehe"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/ehe/teens"
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-6">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option)}
                    className="bg-white/5 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-xl md:rounded-2xl p-4 text-left transition-all duration-200 text-white hover:text-white"
                  >
                    <div className="flex items-center">
                      <span className="bg-white/10 w-6 h-6 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        {option.emoji}
                      </span>
                      <span className="font-medium">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-block p-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-6">
              <div className="bg-white p-2 rounded-full">
                <div className="text-4xl">
                  {finalScore >= 3 ? "🏆" : "📚"}
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {finalScore >= 3 ? "Great Job!" : "Good Effort!"}
            </h2>
            
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              {finalScore >= 3 
                ? "You've shown excellent understanding of youth entrepreneurship!" 
                : "You're on the right track! Review the concepts and try again."}
            </p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 border border-white/20 max-w-md mx-auto mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Your Score</span>
                <span className="text-xl font-bold text-yellow-400">{finalScore}/{questions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Coins Earned</span>
                <span className="text-xl font-bold text-yellow-400">{coins}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateTooYoungStart;