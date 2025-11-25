import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SpotDistressReflex = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-9";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [gameStarted, setGameStarted] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [cardTimer, setCardTimer] = useState(3);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const distressCues = [
    { id: 1, cue: "😔", text: "Avoiding eye contact, hunched shoulders", hasDistress: true },
    { id: 2, cue: "😊", text: "Smiling genuinely, relaxed posture", hasDistress: false },
    { id: 3, cue: "😰", text: "Sweating, fidgeting hands, rapid breathing", hasDistress: true },
    { id: 4, cue: "😄", text: "Laughing with friends, animated gestures", hasDistress: false },
    { id: 5, cue: "😢", text: "Tears in eyes, withdrawn body language", hasDistress: true },
    { id: 6, cue: "🙂", text: "Calm expression, steady voice", hasDistress: false },
    { id: 7, cue: "😣", text: "Clenched fists, tense jaw, furrowed brow", hasDistress: true },
    { id: 8, cue: "😌", text: "Peaceful demeanor, open posture", hasDistress: false },
    { id: 9, cue: "😟", text: "Biting nails, pacing, looking worried", hasDistress: true },
    { id: 10, cue: "😁", text: "Engaged in conversation, making jokes", hasDistress: false },
    { id: 11, cue: "😞", text: "Slumped shoulders, staring at nothing", hasDistress: true },
    { id: 12, cue: "🤗", text: "Embracing friends, cheerful attitude", hasDistress: false },
    { id: 13, cue: "😨", text: "Wide eyes, shaking, backing away", hasDistress: true },
    { id: 14, cue: "😎", text: "Confident stance, relaxed smile", hasDistress: false },
    { id: 15, cue: "😖", text: "Holding head, avoiding people", hasDistress: true },
    { id: 16, cue: "🥰", text: "Happy interactions, bright mood", hasDistress: false },
    { id: 17, cue: "😓", text: "Wiping tears, trembling voice", hasDistress: true },
    { id: 18, cue: "😃", text: "Participating actively, energetic", hasDistress: false },
    { id: 19, cue: "😥", text: "Looking down, quiet, isolated", hasDistress: true },
    { id: 20, cue: "🤩", text: "Excited, sharing good news", hasDistress: false }
  ];

  const currentCue = distressCues[currentCard];

  useEffect(() => {
    if (gameStarted && !showResult && cardTimer > 0) {
      const timer = setTimeout(() => setCardTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameStarted && cardTimer === 0 && currentCard < distressCues.length - 1) {
      setCurrentCard(prev => prev + 1);
      setCardTimer(3);
    } else if (gameStarted && cardTimer === 0 && currentCard === distressCues.length - 1) {
      setShowResult(true);
    }
  }, [gameStarted, showResult, cardTimer, currentCard, score]);

  const handleFlag = (hasDistress) => {
    const isCorrect = currentCue.hasDistress === hasDistress;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentCard < distressCues.length - 1) {
      setTimeout(() => {
        setCurrentCard(prev => prev + 1);
        setCardTimer(3);
      }, 300);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setGameStarted(false);
    setCurrentCard(0);
    setScore(0);
    setCoins(0);
    setCardTimer(3);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/empathy-champion-badge");
  };

  const accuracy = Math.round((score / distressCues.length) * 100);

  return (
    <GameShell
      title="Spot Distress Reflex"
      subtitle={gameStarted ? `Card ${currentCard + 1} of ${distressCues.length}` : "Quick Detection Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-9"
      gameType="uvls"
      totalLevels={20}
      currentLevel={9}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Distress Detection!</h2>
            <p className="text-white/80 mb-6">Flag distress cues quickly - you have 3 seconds per card!</p>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Card {currentCard + 1}/{distressCues.length}</span>
                <div className="flex gap-4">
                  <span className="text-yellow-400 font-bold">Score: {score}</span>
                  <span className="text-red-400 font-bold">Time: {cardTimer}s</span>
                </div>
              </div>
              
              <div className="text-9xl mb-6 text-center animate-pulse">{currentCue.cue}</div>
              
              <p className="text-white text-lg font-bold mb-8 text-center">
                {currentCue.text}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleFlag(true)}
                  className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 transition-all transform hover:scale-105 active:scale-95"
                >
                  <div className="text-4xl mb-2">🚩</div>
                  <div className="text-white font-bold text-xl">Distress</div>
                </button>
                <button
                  onClick={() => handleFlag(false)}
                  className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 transition-all transform hover:scale-105 active:scale-95"
                >
                  <div className="text-4xl mb-2">✓</div>
                  <div className="text-white font-bold text-xl">No Distress</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🎉 Sharp Detection!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You detected {score} out of {distressCues.length} correctly!
            </p>
            <p className="text-white/80 text-lg mb-4">
              Accuracy: {accuracy}%
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned 3 Coins! 🪙" : "Get 70% or higher to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Use varied cues (nonverbal and verbal) to teach comprehensive distress recognition.
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SpotDistressReflex;

