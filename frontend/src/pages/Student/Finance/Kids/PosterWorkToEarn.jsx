import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PosterWorkToEarn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-76";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Choose a poster: "Hard Work = Money."',
      choices: [
        { text: "Hard Work = Money 💸", correct: true },
        { text: "Money for Free 🎁", correct: false },
        { text: "Play All Day 🎉", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Earn Through Effort."',
      choices: [
        { text: "Earn Through Effort 💪", correct: true },
        { text: "Take Money Easily 🤫", correct: false },
        { text: "Spend Without Work 🛍️", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Work Smart, Earn Big."',
      choices: [
        { text: "Work Smart, Earn Big 🌟", correct: true },
        { text: "Get Money Fast 💰", correct: false },
        { text: "Avoid Work 🙈", correct: false },
      ],
    },
    {
      question: 'Choose a poster: "Effort Pays Off."',
      choices: [
        { text: "Effort Pays Off 💼", correct: true },
        { text: "Money Without Work 🎉", correct: false },
        { text: "Borrow Instead 🤝", correct: false },
      ],
    },
    {
      question: 'Why do work-to-earn posters help kids?',
      choices: [
        { text: "Teach value of work 📚", correct: true },
        { text: "Encourage laziness 😴", correct: false },
        { text: "Get free toys 🧸", correct: false },
      ],
    },
  ];

  const handleSelect = (isCorrect) => {
    resetFeedback();
    if (isCorrect) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    if (currentStage < stages.length - 1) {
      setTimeout(() => setCurrentStage((prev) => prev + 1), 800);
    } else {
      setTimeout(() => setShowResult(true), 800);
    }
  };

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Poster: Work to Earn"
      subtitle="Choose posters that promote hard work!"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      nextLabel="Finish"
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={coins}
      gameId="finance-kids-146"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stages[currentStage].choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(choice.correct)}
                  className="p-6 rounded-2xl border bg-white/10 border-white/20 hover:bg-yellow-500 transition-transform hover:scale-105"
                >
                  <div className="text-lg font-semibold">{choice.text}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-3" />
            <h3 className="text-3xl font-bold mb-4">Work-to-Earn Star!</h3>
            <p className="text-white/90 text-lg mb-6">
              You earned {coins} out of 5 for promoting hard work!
            </p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Hard work earns rewards!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PosterWorkToEarn;