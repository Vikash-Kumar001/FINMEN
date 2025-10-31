import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const IdentifyNeedsReflex = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [taps, setTaps] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedExpressions, setSelectedExpressions] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      expressions: [
        { text: "I'm hungry.", isNeed: true },
        { text: "Nice weather.", isNeed: false },
        { text: "Need help.", isNeed: true }
      ]
    },
    {
      id: 2,
      expressions: [
        { text: "Thirsty now.", isNeed: true },
        { text: "Fun game.", isNeed: false },
        { text: "Want hug.", isNeed: true }
      ]
    },
    {
      id: 3,
      expressions: [
        { text: "Tired sleep.", isNeed: true },
        { text: "Blue sky.", isNeed: false },
        { text: "Play time.", isNeed: true }
      ]
    },
    {
      id: 4,
      expressions: [
        { text: "Hurt knee.", isNeed: true },
        { text: "Big tree.", isNeed: false },
        { text: "Water please.", isNeed: true }
      ]
    },
    {
      id: 5,
      expressions: [
        { text: "Sad comfort.", isNeed: true },
        { text: "Red ball.", isNeed: false },
        { text: "Bathroom now.", isNeed: true }
      ]
    }
  ];

  const handleExpressionToggle = (index) => {
    if (selectedExpressions.includes(index)) {
      setSelectedExpressions(selectedExpressions.filter(i => i !== index));
    } else {
      setSelectedExpressions([...selectedExpressions, index]);
    }
  };

  const handleTap = () => {
    const newTaps = [...taps, selectedExpressions];
    setTaps(newTaps);

    const correctNeeds = questions[currentLevel].expressions.filter(e => e.isNeed).length;
    const isCorrect = selectedExpressions.length === correctNeeds && selectedExpressions.every(s => questions[currentLevel].expressions[s].isNeed);
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedExpressions([]); // Reset for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctLevels = newTaps.filter((sel, idx) => {
        const corr = questions[idx].expressions.filter(e => e.isNeed).length;
        return sel.length === corr && sel.every(s => questions[idx].expressions[s].isNeed);
      }).length;
      setFinalScore(correctLevels);
      if (correctLevels >= 3) {
        setCoins(3);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setTaps([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedExpressions([]);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Identify Needs Reflex"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-79"
      gameType="uvls"
      totalLevels={100}
      currentLevel={79}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Tap when need expressed!</p>
              <div className="space-y-3">
                {getCurrentLevel().expressions.map((exp, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleExpressionToggle(idx)}
                    className={`w-full p-4 rounded text-left ${selectedExpressions.includes(idx) ? 'bg-green-500' : 'bg-white/20'}`}
                  >
                    {exp.text} {selectedExpressions.includes(idx) ? '✅' : '⬜'}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleTap} 
                className="mt-4 bg-purple-500 text-white p-2 rounded"
                disabled={selectedExpressions.length === 0}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Needs Spotter!" : "💪 Spot More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You spotted correctly in {finalScore} levels!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 3 Coins! 🪙" : "Try again!"}
            </p>
            {finalScore < 3 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default IdentifyNeedsReflex;