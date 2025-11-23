import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Image, Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HonestyPosterGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();
  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [entry, setEntry] = useState("");
  const [showResult, setShowResult] = useState(false);

  const stages = [
    {
      question: 'Create a slogan: “Be Fair with Money because ___.”',
      minLength: 10,
    },
    {
      question: 'Write a poster tagline: “Honesty with money is ___.”',
      minLength: 10,
    },
    {
      question: 'Design a message: “I stay honest with money by ___.”',
      minLength: 10,
    },
    {
      question: 'Write a motto: “Money and honesty go together because ___.”',
      minLength: 10,
    },
    {
      question: 'Create a final slogan: “Honest money choices make me ___.”',
      minLength: 10,
    },
  ];

  const handleSubmit = () => {
    resetFeedback();
    if (entry.trim().length >= stages[currentStage].minLength) {
      setCoins((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
      if (currentStage < stages.length - 1) {
        setTimeout(() => {
          setEntry("");
          setCurrentStage((prev) => prev + 1);
        }, 800);
      } else {
        setTimeout(() => setShowResult(true), 800);
      }
    }
  };

  const handleFinish = () => navigate("/games/financial-literacy/kids");

  return (
    <GameShell
      title="Poster: Honesty Pays"
      subtitle="Create posters to promote fair money choices."
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
      gameId="finance-kids-186"
      gameType="finance"
    
      maxScore={stages.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Image className="mx-auto w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold mb-4">{stages[currentStage].question}</h3>
            <textarea
              className="w-full p-4 rounded-xl text-black bg-white/90"
              rows={4}
              placeholder="Write your poster slogan here..."
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-pink-500 to-orange-500 px-8 py-4 rounded-full font-bold text-white hover:scale-105 transition-transform mt-4"
              disabled={entry.trim().length < stages[currentStage].minLength}
            >
              Submit Poster
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <Image className="mx-auto w-16 h-16 text-yellow-400 mb-3" />
            <h3 className="text-3xl font-bold mb-4">Poster Master!</h3>
            <p className="text-white/90 text-xl mb-6">
              You earned {coins} out of 5 for creative honesty posters!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 py-3 px-6 rounded-full inline-flex items-center gap-2 mb-6">
              +{coins} Coins
            </div>
            <p className="text-white/80">Lesson: Promoting honesty inspires everyone!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HonestyPosterGame;