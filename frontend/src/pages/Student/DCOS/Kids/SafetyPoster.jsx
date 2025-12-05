import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SafetyPoster = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-6");
  const gameId = gameData?.id || "dcos-kids-6";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SafetyPoster, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stages = [
    {
      question: 'Which poster would best show "Don\'t Share Your Password"?',
      choices: [
        { text: "Poster showing sharing passwords with everyone 📤", correct: false },
        { text: "Poster showing password protection and privacy 🔒", correct: true },
        { text: "Poster showing passwords don't matter 🚫", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Stranger Danger Online"?',
      choices: [
        { text: "Poster showing trusting all strangers online 👥", correct: false },
        { text: "Poster showing meeting strangers in person 🤝", correct: false },
        { text: "Poster showing being careful with strangers online ⚠️", correct: true },
      ],
    },
    {
      question: 'Which poster would best show "Keep Personal Info Private"?',
      choices: [
        { text: "Poster showing protecting personal information 🛡️", correct: true },
        { text: "Poster showing sharing all personal info 📢", correct: false },
        { text: "Poster showing privacy doesn't matter 😔", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Ask Parent Before Clicking"?',
      choices: [
        { text: "Poster showing clicking on all links 🔗", correct: false },
        { text: "Poster showing asking parents before clicking links 👨‍👩‍👧", correct: true },
        { text: "Poster showing never asking parents 🙈", correct: false },
      ],
    },
    {
      question: 'Which poster would best show "Stay Safe Online"?',
      choices: [
        { text: "Poster showing safety doesn't matter ❌", correct: false },
        { text: "Poster showing ignoring safety rules 🚫", correct: false },
        { text: "Poster showing always being safe when using the internet 🛡️", correct: true },
      ],
    },
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastStage = currentStage === stages.length - 1;
    
    setTimeout(() => {
      if (isLastStage) {
        setShowResult(true);
      } else {
        setCurrentStage(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const currentStageData = stages[currentStage];

  return (
    <GameShell
      title="Poster: Safety"
      score={score}
      subtitle={!showResult ? `Question ${currentStage + 1} of ${stages.length}` : "Poster Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={stages.length}
      currentLevel={currentStage + 1}
      maxScore={stages.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentStageData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentStage + 1}/{stages.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{stages.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentStageData.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentStageData.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChoice(choice.correct)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <p className="font-semibold text-lg">{choice.text}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default SafetyPoster;
