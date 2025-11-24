import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JournalOfSaving = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-7";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentStage, setCurrentStage] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stages = [
    {
      prompt: 'Write in your journal: "One thing I saved money for is ___"',
      feedback: "Great Reflection!",
      message: "Writing about your saving goals helps you remember why saving is important!",
      explanation: "Keep up the good work on your saving journey!"
    },
    {
      prompt: 'Write in your journal: "The best way I save money is by ___"',
      feedback: "Excellent Thinking!",
      message: "Reflecting on your saving methods helps you improve your financial habits!",
      explanation: "Understanding your saving strategies makes you a better money manager!"
    },
    {
      prompt: 'Write in your journal: "When I save money, I feel ___"',
      feedback: "Wonderful Reflection!",
      message: "Recognizing your feelings about saving helps build positive money habits!",
      explanation: "Positive feelings about saving motivate you to continue!"
    },
    {
      prompt: 'Write in your journal: "My savings goal for this month is ___"',
      feedback: "Goal-Setting Success!",
      message: "Setting clear savings goals helps you stay focused and motivated!",
      explanation: "Having specific goals makes saving easier and more rewarding!"
    },
    {
      prompt: 'Write in your journal: "I will save money by ___"',
      feedback: "Perfect Plan!",
      message: "Making a plan to save money is the first step to financial success!",
      explanation: "A clear plan helps you achieve your saving goals!"
    }
  ];

  const currentStageData = stages[currentStage];

  const handleSubmit = () => {
    if (journalEntry.trim().length > 10) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      
      setTimeout(() => {
        setShowResult(true);
      }, 1000);
    } else {
      setShowResult(true);
    }
  };

  const handleNext = () => {
    if (currentStage < stages.length - 1) {
      // Move to next journal entry
      setCurrentStage(currentStage + 1);
      setJournalEntry("");
      setShowResult(false);
      resetFeedback();
    } else {
      // Game complete, navigate to next game
      navigate("/student/finance/kids/shop-story");
    }
  };

  const handleTryAgain = () => {
    setJournalEntry("");
    setShowResult(false);
    resetFeedback();
  };

  const isLastStage = currentStage === stages.length - 1;
  const isValidEntry = journalEntry.trim().length > 10;

  return (
    <GameShell
      title="Journal of Saving"
      score={coins}
      subtitle="Write about your saving experience!"
      coins={coins}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={showResult && isValidEntry}
      maxScore={stages.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && isLastStage && isValidEntry}
      
      gameId="finance-kids-7"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-6">
                {currentStageData?.prompt}
              </p>
              
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Start writing your journal entry here..."
                disabled={showResult}
                className="w-full h-40 p-4 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none disabled:opacity-75 disabled:cursor-not-allowed"
              />
              
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={journalEntry.trim().length === 0 || showResult}
                  className={`py-3 px-8 rounded-full font-bold transition-all ${
                    journalEntry.trim().length === 0 || showResult
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                  }`}
                >
                  Submit Entry
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {isValidEntry ? (
              <div>
                <div className="text-5xl mb-4">📖</div>
                <h3 className="text-2xl font-bold text-white mb-4">{currentStageData?.feedback}</h3>
                <p className="text-white/90 text-lg mb-4">
                  {currentStageData?.message}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+1 Coin</span>
                </div>
                <p className="text-white/80 mb-4">
                  {currentStageData?.explanation}
                </p>
                {!isLastStage && (
                  <>
                    <p className="text-white/70 text-sm mb-4">
                      Entry {currentStage + 1} of {stages.length} completed!
                    </p>
                    <button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold transition-all mt-4"
                    >
                      Next Entry
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Writing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  Try writing more about your saving experience. Write at least a few sentences.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Write at least a few sentences about your saving experience.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfSaving;