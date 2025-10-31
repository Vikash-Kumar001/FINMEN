import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CalmReflexx = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [taps, setTaps] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      prompts: [
        { text: "Breathe deep", isCalm: true },
        { text: "Yell loud", isCalm: false },
        { text: "Count to 10", isCalm: true }
      ]
    },
    {
      id: 2,
      prompts: [
        { text: "Walk away", isCalm: true },
        { text: "Hit something", isCalm: false },
        { text: "Talk calmly", isCalm: true }
      ]
    },
    {
      id: 3,
      prompts: [
        { text: "Draw picture", isCalm: true },
        { text: "Throw toys", isCalm: false },
        { text: "Hug teddy", isCalm: true }
      ]
    },
    {
      id: 4,
      prompts: [
        { text: "Listen music", isCalm: true },
        { text: "Scream", isCalm: false },
        { text: "Stretch arms", isCalm: true }
      ]
    },
    {
      id: 5,
      prompts: [
        { text: "Think happy", isCalm: true },
        { text: "Kick ball hard", isCalm: false },
        { text: "Drink water", isCalm: true }
      ]
    }
  ];

  const handlePromptToggle = (index) => {
    if (selectedPrompts.includes(index)) {
      setSelectedPrompts(selectedPrompts.filter(i => i !== index));
    } else {
      setSelectedPrompts([...selectedPrompts, index]);
    }
  };

  const handleTap = () => {
    const newTaps = [...taps, selectedPrompts];
    setTaps(newTaps);

    const correctCalm = questions[currentLevel].prompts.filter(p => p.isCalm).length;
    const isCorrect = selectedPrompts.length === correctCalm && selectedPrompts.every(s => questions[currentLevel].prompts[s].isCalm);
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedPrompts([]); // Reset for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctLevels = newTaps.filter((sel, idx) => {
        const corr = questions[idx].prompts.filter(p => p.isCalm).length;
        return sel.length === corr && sel.every(s => questions[idx].prompts[s].isCalm);
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
    setSelectedPrompts([]);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Calm Reflex"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-73"
      gameType="uvls"
      totalLevels={100}
      currentLevel={73}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Tap calming tactics!</p>
              <div className="space-y-3">
                {getCurrentLevel().prompts.map((prompt, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handlePromptToggle(idx)}
                    className={`w-full p-4 rounded text-left ${selectedPrompts.includes(idx) ? 'bg-green-500' : 'bg-white/20'}`}
                  >
                    {prompt.text} {selectedPrompts.includes(idx) ? '😌' : '⬜'}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleTap} 
                className="mt-4 bg-purple-500 text-white p-2 rounded"
                disabled={selectedPrompts.length === 0}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Calm Tapper!" : "💪 Tap Calmer!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You tapped correctly in {finalScore} levels!
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

export default CalmReflexx;