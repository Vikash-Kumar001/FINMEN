import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SafetyOfferReflex = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-32";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentOffer, setCurrentOffer] = useState(0);
  const [refused, setRefused] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const offers = [
    {
      id: 1,
      offer: "Stranger offers ride.",
      suspicious: true
    },
    {
      id: 2,
      offer: "Friend offers help.",
      suspicious: false
    },
    {
      id: 3,
      offer: "Unknown online friend asks info.",
      suspicious: true
    },
    {
      id: 4,
      offer: "Teacher asks for meeting.",
      suspicious: false
    },
    {
      id: 5,
      offer: "Free gift from unknown.",
      suspicious: true
    }
  ];

  const handleRefuse = () => {
    const offer = offers[currentOffer];
    if (offer.suspicious) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setRefused(true);
    proceedToNext();
  };

  const handleAccept = () => {
    const offer = offers[currentOffer];
    if (!offer.suspicious) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setRefused(true);
    proceedToNext();
  };

  const proceedToNext = () => {
    setTimeout(() => {
      setRefused(false);
      if (currentOffer < offers.length - 1) {
        setCurrentOffer(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Safety Offer Reflex"
      subtitle={`Offer ${currentOffer + 1} of ${offers.length}`}
      onNext={handleNext}
      nextEnabled={showResult && (score / offers.length * 100 >= 70)}
      showGameOver={showResult && (score / offers.length * 100 >= 70)}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-32"
      gameType="uvls"
      totalLevels={20}
      currentLevel={32}
      showConfetti={showResult && (score / offers.length * 100 >= 70)}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6 text-center">"{offers[currentOffer].offer}"</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleRefuse}
                  className="py-3 rounded-xl font-bold text-white bg-red-500 hover:opacity-90"
                >
                  Refuse!
                </button>
                <button
                  onClick={handleAccept}
                  className="py-3 rounded-xl font-bold text-white bg-green-500 hover:opacity-90"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Reflex Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Score: {score} / {offers.length} ({(score / offers.length * 100).toFixed(0)}%)
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {(score / offers.length * 100 >= 70) ? "Earned 3 Coins!" : "Aim for 70%."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Practice refusal lines.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SafetyOfferReflex;