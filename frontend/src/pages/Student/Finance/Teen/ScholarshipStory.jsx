import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ScholarshipStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [choices, setChoices] = useState([]);

  const stages = [
    {
      id: 1,
      text: "Student lies to get extra scholarship. What’s the right action?",
      options: [
        { id: "truthful", text: "Be truthful", emoji: "✅", description: "Honesty is best", isCorrect: true },
        { id: "lie", text: "Lie for funds", emoji: "🤥", description: "Unethical choice", isCorrect: false }
      ],
      reward: 5
    },
    {
      id: 2,
      text: "Application asks for income details. Do you fake it?",
      options: [
        { id: "truthful", text: "Be truthful", emoji: "🛡️", description: "Stay honest", isCorrect: true },
        { id: "fake", text: "Fake details", emoji: "📝", description: "Risky move", isCorrect: false }
      ],
      reward: 5
    },
    {
      id: 3,
      text: "Friend suggests lying for scholarship. Your choice?",
      options: [
        { id: "truthful", text: "Be truthful", emoji: "🙏", description: "Maintain integrity", isCorrect: true },
        { id: "lie", text: "Follow friend", emoji: "👥", description: "Wrong path", isCorrect: false }
      ],
      reward: 6
    },
    {
      id: 4,
      text: "Scholarship requires proof. Do you forge documents?",
      options: [
        { id: "truthful", text: "Be truthful", emoji: "📜", description: "Honest approach", isCorrect: true },
        { id: "forge", text: "Forge documents", emoji: "🔍", description: "Illegal choice", isCorrect: false }
      ],
      reward: 6
    },
    {
      id: 5,
      text: "Extra funds if you exaggerate need. What do you do?",
      options: [
        { id: "truthful", text: "Be truthful", emoji: "⚖️", description: "Ethical decision", isCorrect: true },
        { id: "exaggerate", text: "Exaggerate need", emoji: "💰", description: "Unethical", isCorrect: false }
      ],
      reward: 7
    }
  ];

  const handleChoice = (selectedChoice) => {
    resetFeedback();
    const stage = stages[currentStage];
    const isCorrect = stage.options.find(opt => opt.id === selectedChoice)?.isCorrect;

    setChoices([...choices, { stageId: stage.id, choice: selectedChoice, isCorrect }]);
    if (isCorrect) {
      setCoins(prev => prev + stage.reward);
      showCorrectAnswerFeedback(stage.reward, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage(prev => prev + 1), 800);
    } else {
      const correctAnswers = [...choices, { stageId: stage.id, choice: selectedChoice, isCorrect }].filter(c => c.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentStage(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => navigate("/student/finance/teen");

  return (
    <GameShell
      title="Scholarship Story"
      subtitle={`Stage ${currentStage + 1} of ${stages.length}`}
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleNext : null}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-teens-191"
      gameType="finance"
    >
      <div className="space-y-8 text-white">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Stage {currentStage + 1}/{stages.length}</span>
              <span className="text-yellow-400 font-bold">Coins: {coins}</span>
            </div>
            <p className="text-xl mb-6">{stages[currentStage].text}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stages[currentStage].options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleChoice(opt.id)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">{opt.emoji}</div>
                  <h3 className="font-bold text-xl mb-2">{opt.text}</h3>
                  <p className="text-white/90">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
            {finalScore >= 3 ? (
              <>
                <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
                <h3 className="text-3xl font-bold mb-4">Ethical Scholarship Star!</h3>
                <p className="text-white/90 text-lg mb-6">You got {finalScore} out of 5 correct!</p>
                <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
                  +{coins} Coins
                </div>
                <p className="text-white/80 mt-4">Lesson: Always be truthful in financial matters!</p>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-6">You got {finalScore} out of 5 correct.</p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-transform hover:scale-105"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ScholarshipStory;