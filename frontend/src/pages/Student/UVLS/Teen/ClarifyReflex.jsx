import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ClarifyReflex = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-76";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentClip, setCurrentClip] = useState(0);
  const [flagged, setFlagged] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const clips = [
    {
      id: 1,
      text: "The thing is kinda big.",
      ambiguous: true
    },
    {
      id: 2,
      text: "The sky is blue.",
      ambiguous: false
    },
    {
      id: 3,
      text: "It's sort of okay.",
      ambiguous: true
    },
    {
      id: 4,
      text: "2 + 2 = 4.",
      ambiguous: false
    },
    {
      id: 5,
      text: "Maybe tomorrow.",
      ambiguous: true
    }
  ];

  const handleFlag = () => {
    const clip = clips[currentClip];
    if (clip.ambiguous) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setFlagged(true);
    proceedToNext();
  };

  const handleNoAmbiguous = () => {
    const clip = clips[currentClip];
    if (!clip.ambiguous) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setFlagged(true);
    proceedToNext();
  };

  const proceedToNext = () => {
    setTimeout(() => {
      setFlagged(false);
      if (currentClip < clips.length - 1) {
        setCurrentClip(prev => prev + 1);
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
      title="Clarify Reflex"
      subtitle={`Clip ${currentClip + 1} of ${clips.length}`}
      onNext={handleNext}
      nextEnabled={showResult && (score / clips.length * 100 >= 75)}
      showGameOver={showResult && (score / clips.length * 100 >= 75)}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-76"
      gameType="uvls"
      totalLevels={20}
      currentLevel={76}
      showConfetti={showResult && (score / clips.length * 100 >= 75)}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6 text-center">"{clips[currentClip].text}"</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleFlag}
                  className="py-3 rounded-xl font-bold text-white bg-red-500 hover:opacity-90"
                >
                  Needs Clarification!
                </button>
                <button
                  onClick={handleNoAmbiguous}
                  className="py-3 rounded-xl font-bold text-white bg-green-500 hover:opacity-90"
                >
                  Clear
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
              Score: {score} / {clips.length} ({(score / clips.length * 100).toFixed(0)}%)
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {(score / clips.length * 100 >= 75) ? "Earned 3 Coins!" : "Aim for 75%."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Offer open vs closed questions.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ClarifyReflex;